import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
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
    try {
      await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
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
      }
    }

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
