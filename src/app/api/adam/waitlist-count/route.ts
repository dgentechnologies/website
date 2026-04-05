import { NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/server';

export async function GET() {
  try {
    const snapshot = await adminFirestore.collection('adam-waitlist').count().get();
    return NextResponse.json({ count: snapshot.data().count });
  } catch (error) {
    console.error('Failed to retrieve waitlist count:', error);
    return NextResponse.json({ error: 'Failed to retrieve count.' }, { status: 500 });
  }
}
