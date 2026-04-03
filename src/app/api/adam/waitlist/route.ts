import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    await adminFirestore.collection('adam-waitlist').doc(trimmedEmail).set({
      email: trimmedEmail,
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to join the waitlist. Please try again.' }, { status: 500 });
  }
}
