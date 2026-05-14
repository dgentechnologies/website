import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { adminApp, adminFirestore } from '@/firebase/server';

type AdamUserItem = {
  id: string;
  identifier: string;
  email: string | null;
  name: string | null;
  interactionCount: number;
  lastMessage: string | null;
  lastReply: string | null;
  lastSeenAt: string | null;
};

type WaitlistItem = {
  id: string;
  email: string;
  createdAt: string | null;
};

type FeedbackItem = {
  id: string;
  source: string;
  identifier: string | null;
  email: string | null;
  name: string | null;
  feedback: string;
  createdAt: string | null;
};

function toIsoDate(rawTimestamp: unknown): string | null {
  if (!rawTimestamp || typeof rawTimestamp !== 'object' || !('toDate' in rawTimestamp)) {
    return null;
  }

  const maybeTimestamp = rawTimestamp as { toDate: () => Date };
  return maybeTimestamp.toDate().toISOString();
}

async function verifyAdmin(request: NextRequest): Promise<DecodedIdToken> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];
  const auth = getAuth(adminApp);
  const decodedToken = await auth.verifyIdToken(token);

  const existingUser = await auth.getUser(decodedToken.uid);
  if (!existingUser) {
    throw new Error('Unauthorized');
  }

  return decodedToken;
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);

    const [adamUsersSnapshot, waitlistSnapshot, feedbackSnapshot] = await Promise.all([
      adminFirestore.collection('adamUsers').orderBy('lastSeenAt', 'desc').limit(100).get(),
      adminFirestore.collection('adam-waitlist').orderBy('createdAt', 'desc').limit(100).get(),
      adminFirestore.collection('adamFeedback').orderBy('createdAt', 'desc').limit(100).get(),
    ]);

    const users: AdamUserItem[] = adamUsersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        identifier: typeof data.identifier === 'string' ? data.identifier : doc.id,
        email: typeof data.email === 'string' ? data.email : null,
        name: typeof data.name === 'string' ? data.name : null,
        interactionCount: typeof data.interactionCount === 'number' ? data.interactionCount : 0,
        lastMessage: typeof data.lastMessage === 'string' ? data.lastMessage : null,
        lastReply: typeof data.lastReply === 'string' ? data.lastReply : null,
        lastSeenAt: toIsoDate(data.lastSeenAt),
      };
    });

    const waitlist: WaitlistItem[] = waitlistSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: typeof data.email === 'string' ? data.email : doc.id,
        createdAt: toIsoDate(data.createdAt),
      };
    });

    const feedback: FeedbackItem[] = feedbackSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        source: typeof data.source === 'string' ? data.source : 'unknown',
        identifier: typeof data.identifier === 'string' ? data.identifier : null,
        email: typeof data.email === 'string' ? data.email : null,
        name: typeof data.name === 'string' ? data.name : null,
        feedback: typeof data.feedback === 'string' ? data.feedback : '',
        createdAt: toIsoDate(data.createdAt),
      };
    });

    return NextResponse.json({
      users,
      waitlist,
      feedback,
      totals: {
        users: users.length,
        waitlist: waitlist.length,
        feedback: feedback.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch ADAM insights';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
