import { NextRequest, NextResponse } from 'next/server';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    // Verify the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const auth = getAuth(adminApp);

    // Verify the token and check if the user is an admin
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the user record to check if they have admin privileges
    // We check if the user already exists in Firebase Auth (meaning they are an admin)
    // since only authenticated admin users can access the admin dashboard
    const existingUser = await auth.getUser(decodedToken.uid);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create the new user
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      uid: userRecord.uid,
    });
  } catch (error: unknown) {
    console.error('Error creating admin user:', error);
    
    let message = 'Failed to create admin user';
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === 'auth/email-already-exists') {
        message = 'A user with this email already exists';
      } else if (firebaseError.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (firebaseError.code === 'auth/weak-password') {
        message = 'Password is too weak';
      } else if (firebaseError.code === 'auth/user-not-found') {
        message = 'Unauthorized: Admin privileges required';
        return NextResponse.json(
          { error: message },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
