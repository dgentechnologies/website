import { NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/server';

export async function GET() {
  try {
    const [websiteSnapshot, demoSnapshot] = await Promise.all([
      adminFirestore.collection('adam-waitlist').count().get(),
      adminFirestore.collection('waitlist').count().get(),
    ]);

    const count = (websiteSnapshot.data().count ?? 0) + (demoSnapshot.data().count ?? 0);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Failed to retrieve waitlist count:', error);
    return NextResponse.json({ error: 'Failed to retrieve count.' }, { status: 500 });
  }
}
