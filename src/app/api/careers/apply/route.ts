import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminApp } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s\-().]{7,19}$/;
const URL_REGEX = /^https?:\/\//i;

// Sanitize a string to prevent Firestore injection or misuse
function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function normalizeBucketName(bucket: string): string {
  // Accept values like "gs://my-bucket" and strip protocol/path.
  return bucket.replace(/^gs:\/\//, '').replace(/\/.*$/, '').trim();
}

function isBucketNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { status?: number; code?: number | string; message?: string };
  if (e.status === 404 || e.code === 404) return true;
  if (typeof e.message === 'string' && e.message.toLowerCase().includes('bucket does not exist')) {
    return true;
  }
  return false;
}

async function saveToResolvedBucket(
  storagePath: string,
  fileBuffer: Buffer,
  contentType: string,
  metadata: Record<string, string>
) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const configured =
    process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';

  const candidates = new Set<string>();
  if (configured) candidates.add(normalizeBucketName(configured));
  if (projectId) {
    candidates.add(`${projectId}.firebasestorage.app`);
    candidates.add(`${projectId}.appspot.com`);
  }

  if (candidates.size === 0) {
    throw new Error('No Firebase Storage bucket is configured.');
  }

  const storage = getStorage(adminApp);
  let lastError: unknown = null;

  for (const bucketName of candidates) {
    const bucket = storage.bucket(bucketName);
    const fileRef = bucket.file(storagePath);

    try {
      await fileRef.save(fileBuffer, {
        metadata: {
          contentType,
          metadata,
        },
      });
      return { fileRef, bucketName };
    } catch (err) {
      lastError = err;
      if (isBucketNotFoundError(err)) {
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error('Unable to find a valid Firebase Storage bucket.');
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
  }

  // ── Extract & validate fields ──────────────────────────────────────────────
  const listingId = sanitizeText(formData.get('listingId'), 128);
  const listingTitle = sanitizeText(formData.get('listingTitle'), 200);
  const applicantName = sanitizeText(formData.get('applicantName'), 100);
  const applicantEmail = sanitizeText(formData.get('applicantEmail'), 254);
  const applicantPhone = sanitizeText(formData.get('applicantPhone'), 20);
  const linkedinUrl = sanitizeText(formData.get('linkedinUrl'), 500);
  const portfolioUrl = sanitizeText(formData.get('portfolioUrl'), 500);
  const githubUrl = sanitizeText(formData.get('githubUrl'), 500);
  const coverLetter = sanitizeText(formData.get('coverLetter'), 2000);

  if (!listingId || !listingTitle || !applicantName || !applicantEmail || !applicantPhone) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(applicantEmail)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (!PHONE_REGEX.test(applicantPhone)) {
    return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
  }

  if (linkedinUrl && !URL_REGEX.test(linkedinUrl)) {
    return NextResponse.json({ error: 'LinkedIn/Portfolio URL must start with http:// or https://.' }, { status: 400 });
  }

  if (portfolioUrl && !URL_REGEX.test(portfolioUrl)) {
    return NextResponse.json({ error: 'Portfolio URL must start with http:// or https://.' }, { status: 400 });
  }

  if (githubUrl && !URL_REGEX.test(githubUrl)) {
    return NextResponse.json({ error: 'GitHub URL must start with http:// or https://.' }, { status: 400 });
  }

  // ── Validate the career listing exists ────────────────────────────────────
  const listingDoc = await adminFirestore.collection('careerListings').doc(listingId).get();
  if (!listingDoc.exists || !listingDoc.data()?.isActive) {
    return NextResponse.json({ error: 'This position is no longer available.' }, { status: 404 });
  }

  // ── Validate resume file ───────────────────────────────────────────────────
  const resumeEntry = formData.get('resume');
  if (!(resumeEntry instanceof File)) {
    return NextResponse.json({ error: 'Resume file is required.' }, { status: 400 });
  }

  const resumeFile = resumeEntry as File;

  if (!ACCEPTED_MIME_TYPES.has(resumeFile.type)) {
    return NextResponse.json(
      { error: 'Only PDF, DOC, or DOCX files are accepted.' },
      { status: 400 }
    );
  }

  if (resumeFile.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: 'Resume must be under 5 MB.' }, { status: 400 });
  }

  // ── Check for duplicate application (same email + listing) ────────────────
  const existingQuery = await adminFirestore
    .collection('jobApplications')
    .where('listingId', '==', listingId)
    .where('applicantEmail', '==', applicantEmail)
    .limit(1)
    .get();

  if (!existingQuery.empty) {
    return NextResponse.json(
      { error: 'You have already applied for this position.' },
      { status: 409 }
    );
  }

  // ── Upload resume to Firebase Storage ─────────────────────────────────────
  let resumeUrl: string;
  let resumeFileName: string;

  try {
    const buffer = Buffer.from(await resumeFile.arrayBuffer());

    // Sanitize original filename before storing
    const safeOriginalName = resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `resumes/${listingId}/${Date.now()}-${safeOriginalName}`;
    resumeFileName = safeOriginalName;

    const { fileRef, bucketName } = await saveToResolvedBucket(
      storagePath,
      buffer,
      resumeFile.type,
      {
        originalName: safeOriginalName,
        listingId,
        applicantEmail,
      }
    );
    console.log(`Resume saved to bucket: ${bucketName}`);

    // Generate a long-lived signed URL (10 years) so admins can always download
    const [signedUrl] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
    });
    resumeUrl = signedUrl;
  } catch (err) {
    console.error('Resume upload failed:', err);
    return NextResponse.json(
      { error: 'Failed to upload resume. Please try again.' },
      { status: 500 }
    );
  }

  // ── Save application to Firestore ─────────────────────────────────────────
  try {
    const applicationData = {
      listingId,
      listingTitle,
      applicantName,
      applicantEmail,
      applicantPhone,
      ...(linkedinUrl && { linkedinUrl }),
      ...(portfolioUrl && { portfolioUrl }),
      ...(githubUrl && { githubUrl }),
      ...(coverLetter && { coverLetter }),
      resumeUrl,
      resumeFileName,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminFirestore.collection('jobApplications').add(applicationData);

    return NextResponse.json({ success: true, applicationId: docRef.id }, { status: 201 });
  } catch (err) {
    console.error('Firestore write failed:', err);
    return NextResponse.json(
      { error: 'Failed to save application. Please try again.' },
      { status: 500 }
    );
  }
}
