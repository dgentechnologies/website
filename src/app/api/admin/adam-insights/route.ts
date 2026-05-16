import { NextRequest, NextResponse } from 'next/server';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { adminApp, adminFirestore } from '@/firebase/server';

type MaybeTimestamp = {
  toDate?: () => Date;
};

type LastKnownLocation = {
  latitude: number;
  longitude: number;
  timezone: string;
  locale: string;
  permission: string;
  accuracyMeters: number;
  capturedAtClient: string;
  lastKnownLocationCapturedAt: string;
};

type AdamUserItem = {
  id: string;
  uid: string | null;
  identifier: string;
  email: string | null;
  phoneNumber: string | null;
  name: string | null;
  jobTitle: string | null;
  whereHeard: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  dob: string | null;
  age: number | null;
  intent: string | null;
  useCase: string | null;
  accountCreatedAt: string | null;
  lastKnownLocation: LastKnownLocation | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  interactionCount: number;
  lastMessage: string | null;
  lastReply: string | null;
  lastSeenAt: string | null;
};

type AggregateItem = {
  label: string;
  count: number;
};

function toIsoDate(rawTimestamp: unknown): string | null {
  if (!rawTimestamp) {
    return null;
  }

  if (rawTimestamp instanceof Date) {
    return Number.isNaN(rawTimestamp.getTime()) ? null : rawTimestamp.toISOString();
  }

  if (typeof rawTimestamp === 'number' && Number.isFinite(rawTimestamp)) {
    const millis = rawTimestamp > 1_000_000_000_000 ? rawTimestamp : rawTimestamp * 1000;
    const date = new Date(millis);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (typeof rawTimestamp === 'string') {
    const asNumber = Number(rawTimestamp);
    if (Number.isFinite(asNumber)) {
      const millis = asNumber > 1_000_000_000_000 ? asNumber : asNumber * 1000;
      const date = new Date(millis);
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString();
      }
    }

    const parsed = new Date(rawTimestamp);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  if (typeof rawTimestamp !== 'object' || !('toDate' in rawTimestamp)) {
    return null;
  }

  const maybeTimestamp = rawTimestamp as { toDate: () => Date };
  const converted = maybeTimestamp.toDate();
  return Number.isNaN(converted.getTime()) ? null : converted.toISOString();
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

function readPossibleString(data: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = data[key];
    if (typeof value !== 'string') {
      continue;
    }

    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return null;
}

function calculateAge(dob: string | null): number | null {
  if (!dob) {
    return null;
  }

  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDelta = now.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  if (age < 0 || age > 120) {
    return null;
  }

  return age;
}

function ageBand(age: number | null): string {
  if (age === null) {
    return 'Unknown';
  }
  if (age < 18) {
    return '<18';
  }
  if (age <= 24) {
    return '18-24';
  }
  if (age <= 34) {
    return '25-34';
  }
  if (age <= 44) {
    return '35-44';
  }
  if (age <= 54) {
    return '45-54';
  }
  return '55+';
}

function buildTopItems(values: Array<string | null>, limit: number, fallback: string): AggregateItem[] {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const normalized = (value ?? '').trim() || fallback;
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function readLastKnownLocation(data: Record<string, unknown>): LastKnownLocation | null {
  const rawLocation = data.lastKnownLocation;
  if (!rawLocation || typeof rawLocation !== 'object') {
    return null;
  }

  const location = rawLocation as Record<string, unknown>;
  const latitude = typeof location.latitude === 'number' ? location.latitude : null;
  const longitude = typeof location.longitude === 'number' ? location.longitude : null;

  if (latitude === null || longitude === null) {
    return null;
  }

  const timezone = typeof location.timezone === 'string' ? location.timezone : '';
  const locale = typeof location.locale === 'string' ? location.locale : '';
  const permission = typeof location.permission === 'string' ? location.permission : '';

  return {
    latitude,
    longitude,
    timezone,
    locale,
    permission,
    accuracyMeters: typeof location.accuracyMeters === 'number' ? location.accuracyMeters : 0,
    capturedAtClient: toIsoDate(location.capturedAtClient) ?? '',
    lastKnownLocationCapturedAt: toIsoDate(location.lastKnownLocationCapturedAt) ?? '',
  };
}

function mergeUser(existing: AdamUserItem | undefined, incoming: AdamUserItem): AdamUserItem {
  if (!existing) {
    return incoming;
  }

  return {
    ...existing,
    uid: existing.uid ?? incoming.uid,
    identifier: existing.identifier || incoming.identifier,
    email: existing.email ?? incoming.email,
    phoneNumber: existing.phoneNumber ?? incoming.phoneNumber,
    name: existing.name ?? incoming.name,
    jobTitle: existing.jobTitle ?? incoming.jobTitle,
    whereHeard: existing.whereHeard ?? incoming.whereHeard,
    country: existing.country ?? incoming.country,
    city: existing.city ?? incoming.city,
    region: existing.region ?? incoming.region,
    timezone: existing.timezone ?? incoming.timezone,
    dob: existing.dob ?? incoming.dob,
    age: existing.age ?? incoming.age,
    intent: existing.intent ?? incoming.intent,
    useCase: existing.useCase ?? incoming.useCase,
    accountCreatedAt: existing.accountCreatedAt ?? incoming.accountCreatedAt,
    lastKnownLocation: existing.lastKnownLocation ?? incoming.lastKnownLocation,
    isDeleted: existing.isDeleted || incoming.isDeleted,
    deletedAt: existing.deletedAt ?? incoming.deletedAt,
    deletedBy: existing.deletedBy ?? incoming.deletedBy,
    interactionCount: Math.max(existing.interactionCount, incoming.interactionCount),
    lastMessage: existing.lastMessage ?? incoming.lastMessage,
    lastReply: existing.lastReply ?? incoming.lastReply,
    lastSeenAt: existing.lastSeenAt ?? incoming.lastSeenAt,
  };
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

    const [adamUsersSnapshot, onboardingSnapshot] = await Promise.all([
      adminFirestore.collection('adamUsers').limit(300).get(),
      adminFirestore.collection('onboarding').limit(300).get(),
    ]);

    const usersMap = new Map<string, AdamUserItem>();

    const upsert = (user: AdamUserItem) => {
      const merged = mergeUser(usersMap.get(user.id), user);
      usersMap.set(user.id, merged);
      if (merged.uid && merged.uid !== merged.id) {
        usersMap.set(merged.uid, merged);
      }
    };

    adamUsersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const uid = readPossibleString(data, ['uid']);
      const country = readPossibleString(data, ['country'])?.toUpperCase() ?? null;
      const lastKnownLocation = readLastKnownLocation(data);
      const timezone =
        readPossibleString(data, ['timezone']) ??
        (lastKnownLocation?.timezone ? lastKnownLocation.timezone : null);
      const dob = readPossibleString(data, ['dob']);

      upsert({
        id: uid ?? doc.id,
        uid,
        identifier: readPossibleString(data, ['identifier']) ?? uid ?? doc.id,
        email: readPossibleString(data, ['email']),
        phoneNumber: readPossibleString(data, ['phoneNumber', 'phone_number', 'phone']),
        name: readPossibleString(data, ['name', 'displayName']),
        jobTitle: readPossibleString(data, ['jobTitle']),
        whereHeard: readPossibleString(data, ['whereHeard']),
        country,
        city: readPossibleString(data, ['city']),
        region: readPossibleString(data, ['region']),
        timezone,
        dob,
        age: calculateAge(dob),
        intent: readPossibleString(data, ['intent']),
        useCase: readPossibleString(data, ['useCase']),
        accountCreatedAt: readPossibleDate(data, ['accountCreatedAt', 'createdAt', 'accountCreatedAtRaw', 'lastSignInAtRaw']),
        lastKnownLocation,
        isDeleted: Boolean(data.isDeleted),
        deletedAt: readPossibleDate(data, ['deletedAt']),
        deletedBy: readPossibleString(data, ['deletedBy']),
        interactionCount: readPossibleNumber(data, ['interactionCount', 'totalDemoSessions', 'demoSessions', 'totalSessions']),
        lastMessage: readPossibleString(data, ['lastMessage']),
        lastReply: readPossibleString(data, ['lastReply']),
        lastSeenAt: readPossibleDate(data, ['lastSeenAt', 'updatedAt', 'lastSignInAtRaw', 'onboardingCompletedAt']),
      });
    });

    onboardingSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const uid = readPossibleString(data, ['uid']) ?? doc.id;
      const dob = readPossibleString(data, ['dob']);

      upsert({
        id: uid,
        uid,
        identifier: uid,
        email: readPossibleString(data, ['email']),
        phoneNumber: readPossibleString(data, ['phoneNumber', 'phone_number', 'phone']),
        name: readPossibleString(data, ['name', 'displayName']),
        jobTitle: readPossibleString(data, ['jobTitle']),
        whereHeard: readPossibleString(data, ['whereHeard']),
        country: readPossibleString(data, ['country'])?.toUpperCase() ?? null,
        city: readPossibleString(data, ['city']),
        region: readPossibleString(data, ['region']),
        timezone: readPossibleString(data, ['timezone']),
        dob,
        age: calculateAge(dob),
        intent: readPossibleString(data, ['intent']),
        useCase: readPossibleString(data, ['useCase']),
        accountCreatedAt: readPossibleDate(data, ['createdAt', 'accountCreatedAt', 'accountCreatedAtRaw']),
        lastKnownLocation: null,
        isDeleted: Boolean(data.isDeleted),
        deletedAt: readPossibleDate(data, ['deletedAt']),
        deletedBy: readPossibleString(data, ['deletedBy']),
        interactionCount: readPossibleNumber(data, ['interactionCount', 'totalDemoSessions', 'demoSessions', 'totalSessions']),
        lastMessage: null,
        lastReply: null,
        lastSeenAt: readPossibleDate(data, ['updatedAt', 'createdAt', 'onboardingCompletedAt']),
      });
    });

    const users = Array.from(new Map(Array.from(usersMap.values()).map((user) => [user.id, user])).values()).sort((a, b) => {
      const aTime = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
      const bTime = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
      return bTime - aTime;
    });

    const activeUsers = users.filter((user) => !user.isDeleted);
    const archivedUsers = users.filter((user) => user.isDeleted);

    const topLocations = buildTopItems(activeUsers.map((user) => user.country), 10, 'Unknown')
      .map((item) => ({ country: item.label, count: item.count }));
    const topJobTitles = buildTopItems(activeUsers.map((user) => user.jobTitle), 10, 'Unknown')
      .map((item) => ({ jobTitle: item.label, count: item.count }));
    const topTimezones = buildTopItems(activeUsers.map((user) => user.timezone), 12, 'Unknown')
      .map((item) => ({ timezone: item.label, count: item.count }));
    const ageGroups = buildTopItems(activeUsers.map((user) => ageBand(user.age)), 10, 'Unknown')
      .map((item) => ({ ageGroup: item.label, count: item.count }));
    const whereHeard = buildTopItems(activeUsers.map((user) => user.whereHeard), 12, 'Unknown')
      .map((item) => ({ whereHeard: item.label, count: item.count }));

    return NextResponse.json({
      users,
      activeUsers,
      archivedUsers,
      topLocations,
      topJobTitles,
      topTimezones,
      ageGroups,
      whereHeard,
      totals: {
        users: users.length,
        activeUsers: activeUsers.length,
        archivedUsers: archivedUsers.length,
        timezones: new Set(users.map((user) => user.timezone).filter(Boolean)).size,
        jobTitles: new Set(users.map((user) => user.jobTitle).filter(Boolean)).size,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch ADAM insights';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin(request);

    const uid = request.nextUrl.searchParams.get('uid')?.trim();
    if (!uid) {
      return NextResponse.json({ error: 'uid is required' }, { status: 400 });
    }

    const adamUsersByUidQuery = adminFirestore.collection('adamUsers').where('uid', '==', uid).get();
    const onboardingByUidQuery = adminFirestore.collection('onboarding').where('uid', '==', uid).get();
    const demoSessionsByUidQuery = adminFirestore.collection('demoSessions').where('uid', '==', uid).get();

    const [adamUsersByUid, onboardingByUid, demoSessionsByUid, adamUserById, onboardingById] = await Promise.all([
      adamUsersByUidQuery,
      onboardingByUidQuery,
      demoSessionsByUidQuery,
      adminFirestore.collection('adamUsers').doc(uid).get(),
      adminFirestore.collection('onboarding').doc(uid).get(),
    ]);

    const batch = adminFirestore.batch();
    const archivedAt = new Date().toISOString();

    const archiveRef = (ref: any) => {
      batch.set(ref, {
        isDeleted: true,
        deletedAt: archivedAt,
        deletedBy: 'admin-dashboard',
      }, { merge: true });
    };

    if (adamUserById.exists) {
      archiveRef(adamUserById.ref);
    }
    if (onboardingById.exists) {
      archiveRef(onboardingById.ref);
    }

    adamUsersByUid.docs.forEach((doc) => archiveRef(doc.ref));
    onboardingByUid.docs.forEach((doc) => archiveRef(doc.ref));
    demoSessionsByUid.docs.forEach((doc) => archiveRef(doc.ref));

    await batch.commit();

    const auth = getAuth(adminApp);
    let deletedAuthUser = false;
    try {
      await auth.deleteUser(uid);
      deletedAuthUser = true;
    } catch {
      deletedAuthUser = false;
    }

    return NextResponse.json({
      success: true,
      uid,
      deletedDocuments: adamUsersByUid.size + onboardingByUid.size + demoSessionsByUid.size + (adamUserById.exists ? 1 : 0) + (onboardingById.exists ? 1 : 0),
      deletedAuthUser,
      softDeleted: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete ADAM user';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await verifyAdmin(request);

    const uid = request.nextUrl.searchParams.get('uid')?.trim();
    if (!uid) {
      return NextResponse.json({ error: 'uid is required' }, { status: 400 });
    }

    const [adamUsersByUid, onboardingByUid, demoSessionsByUid, adamUserById, onboardingById] = await Promise.all([
      adminFirestore.collection('adamUsers').where('uid', '==', uid).get(),
      adminFirestore.collection('onboarding').where('uid', '==', uid).get(),
      adminFirestore.collection('demoSessions').where('uid', '==', uid).get(),
      adminFirestore.collection('adamUsers').doc(uid).get(),
      adminFirestore.collection('onboarding').doc(uid).get(),
    ]);

    const batch = adminFirestore.batch();
    const restoreRef = (ref: any) => {
      batch.set(ref, {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
      }, { merge: true });
    };

    if (adamUserById.exists) {
      restoreRef(adamUserById.ref);
    }
    if (onboardingById.exists) {
      restoreRef(onboardingById.ref);
    }

    adamUsersByUid.docs.forEach((doc) => restoreRef(doc.ref));
    onboardingByUid.docs.forEach((doc) => restoreRef(doc.ref));
    demoSessionsByUid.docs.forEach((doc) => restoreRef(doc.ref));

    await batch.commit();

    return NextResponse.json({
      success: true,
      uid,
      restoredDocuments: adamUsersByUid.size + onboardingByUid.size + demoSessionsByUid.size + (adamUserById.exists ? 1 : 0) + (onboardingById.exists ? 1 : 0),
      softDeleted: false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to restore ADAM user';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
