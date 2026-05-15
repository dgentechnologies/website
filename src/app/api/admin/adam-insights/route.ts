import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { adminApp, adminFirestore } from '@/firebase/server';

type MaybeTimestamp = {
  toDate?: () => Date;
};

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
  feedback: string | null;
  source: 'adam-waitlist' | 'waitlist';
  createdAt: string | null;
};

type FeedbackItem = {
  id: string;
  source: 'waitlist' | 'chat' | 'other';
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

function readPossibleDate(data: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = data[key] as MaybeTimestamp | unknown;
    const asIso = toIsoDate(value);
    if (asIso) {
      return asIso;
    }
  }
  return null;
}

function readPossibleNumber(data: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
}

function normalizeFeedbackSource(source: unknown): 'waitlist' | 'chat' | 'other' {
  if (typeof source !== 'string') {
    return 'other';
  }

  const value = source.toLowerCase();
  if (value.includes('waitlist')) {
    return 'waitlist';
  }
  if (value.includes('chat') || value.includes('adam')) {
    return 'chat';
  }
  return 'other';
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

    const [adamUsersSnapshot, onboardingSnapshot, websiteWaitlistSnapshot, demoWaitlistSnapshot, feedbackSnapshot] = await Promise.all([
      adminFirestore.collection('adamUsers').limit(300).get(),
      adminFirestore.collection('onboarding').limit(300).get(),
      adminFirestore.collection('adam-waitlist').limit(300).get(),
      adminFirestore.collection('waitlist').limit(300).get(),
      adminFirestore.collection('adamFeedback').limit(300).get(),
    ]);

    const usersMap = new Map<string, AdamUserItem>();

    adamUsersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const key = doc.id;
      usersMap.set(key, {
        id: doc.id,
        identifier: typeof data.identifier === 'string' ? data.identifier : (typeof data.uid === 'string' ? data.uid : doc.id),
        email: typeof data.email === 'string' ? data.email : null,
        name: typeof data.name === 'string' ? data.name : (typeof data.displayName === 'string' ? data.displayName : null),
        interactionCount: readPossibleNumber(data, ['interactionCount', 'totalDemoSessions', 'demoSessions', 'totalSessions']),
        lastMessage: typeof data.lastMessage === 'string' ? data.lastMessage : null,
        lastReply: typeof data.lastReply === 'string' ? data.lastReply : null,
        lastSeenAt: readPossibleDate(data, ['lastSeenAt', 'updatedAt', 'lastSignInAtRaw', 'onboardingCompletedAt']),
      });
    });

    onboardingSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const key = doc.id;
      const existing = usersMap.get(key);
      const derivedName = typeof data.name === 'string'
        ? data.name
        : (typeof data.displayName === 'string' ? data.displayName : null);
      const derivedLastSeen = readPossibleDate(data, ['updatedAt', 'createdAt', 'onboardingCompletedAt']);

      if (!existing) {
        usersMap.set(key, {
          id: key,
          identifier: key,
          email: typeof data.email === 'string' ? data.email : null,
          name: derivedName,
          interactionCount: 0,
          lastMessage: null,
          lastReply: null,
          lastSeenAt: derivedLastSeen,
        });
        return;
      }

      usersMap.set(key, {
        ...existing,
        email: existing.email ?? (typeof data.email === 'string' ? data.email : null),
        name: existing.name ?? derivedName,
        interactionCount: existing.interactionCount > 0
          ? existing.interactionCount
          : readPossibleNumber(data, ['interactionCount', 'totalDemoSessions', 'demoSessions', 'totalSessions']),
        lastSeenAt: existing.lastSeenAt ?? derivedLastSeen,
      });
    });

    const users = Array.from(usersMap.values()).sort((a, b) => {
      const aTime = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
      const bTime = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
      return bTime - aTime;
    });

    const websiteWaitlist: WaitlistItem[] = websiteWaitlistSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: typeof data.email === 'string' ? data.email : doc.id,
        feedback: typeof data.feedback === 'string' ? data.feedback : null,
        source: 'adam-waitlist',
        createdAt: readPossibleDate(data, ['createdAt', 'updatedAt', 'timestamp']),
      };
    });

    const demoWaitlist: WaitlistItem[] = demoWaitlistSnapshot.docs.map((doc) => {
      const data = doc.data();
      const fallbackEmail = typeof data.identifier === 'string' ? data.identifier : doc.id;
      return {
        id: doc.id,
        email: typeof data.email === 'string' ? data.email : fallbackEmail,
        feedback: typeof data.feedback === 'string' ? data.feedback : null,
        source: 'waitlist',
        createdAt: readPossibleDate(data, ['createdAt', 'submittedAt', 'updatedAt', 'timestamp']),
      };
    });

    const waitlist = [...websiteWaitlist, ...demoWaitlist].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    const collectionFeedback: FeedbackItem[] = feedbackSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        source: normalizeFeedbackSource(data.source),
        identifier: typeof data.identifier === 'string' ? data.identifier : null,
        email: typeof data.email === 'string' ? data.email : null,
        name: typeof data.name === 'string' ? data.name : null,
        feedback: typeof data.feedback === 'string' ? data.feedback : '',
        createdAt: readPossibleDate(data, ['createdAt', 'updatedAt', 'timestamp']),
      };
    });

    const syntheticWaitlistFeedback: FeedbackItem[] = waitlist
      .filter((entry) => typeof entry.feedback === 'string' && entry.feedback.trim().length > 0)
      .map((entry) => ({
        id: `inline-${entry.source}-${entry.id}`,
        source: 'waitlist' as const,
        identifier: entry.email,
        email: entry.email,
        name: null,
        feedback: entry.feedback!.trim(),
        createdAt: entry.createdAt,
      }));

    const seen = new Set<string>();
    const feedback = [...collectionFeedback, ...syntheticWaitlistFeedback]
      .filter((item) => {
        const dedupeKey = `${(item.email || item.identifier || '').toLowerCase()}|${item.feedback.trim().toLowerCase()}`;
        if (!dedupeKey || dedupeKey === '|') {
          return false;
        }
        if (seen.has(dedupeKey)) {
          return false;
        }
        seen.add(dedupeKey);
        return true;
      })
      .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    const waitlistFeedbackCount = feedback.filter((item) => item.source === 'waitlist').length;
    const chatFeedbackCount = feedback.filter((item) => item.source === 'chat').length;

    return NextResponse.json({
      users,
      waitlist,
      feedback,
      totals: {
        users: users.length,
        waitlist: waitlist.length,
        feedback: feedback.length,
        waitlistFeedback: waitlistFeedbackCount,
        chatFeedback: chatFeedbackCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch ADAM insights';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
