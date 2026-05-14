import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email : '';
    const feedback = typeof body.feedback === 'string' ? body.feedback.trim() : '';

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (feedback.length > 1000) {
      return NextResponse.json({ error: 'Feedback must be under 1000 characters.' }, { status: 400 });
    }

    await adminFirestore.collection('adam-waitlist').doc(trimmedEmail).set({
      email: trimmedEmail,
      createdAt: FieldValue.serverTimestamp(),
      ...(feedback ? { feedback } : {}),
    }, { merge: true });

    if (feedback) {
      await adminFirestore.collection('adamFeedback').add({
        source: 'waitlist',
        identifier: trimmedEmail,
        email: trimmedEmail,
        name: null,
        feedback,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to join the waitlist. Please try again.' }, { status: 500 });
  }
}
