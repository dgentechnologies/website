/**
 * Example API route for sending welcome emails
 * 
 * This demonstrates how to integrate the welcome email template
 * with a Resend API endpoint. Copy this as a reference and adapt
 * to your specific use case.
 * 
 * Usage: POST /api/emails/send-welcome
 * Body: { email: string, name: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/emails/send-welcome-email';

export async function POST(request: NextRequest) {
  // Validate request method
  if (request.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    // Parse request body
    const body = await request.json();
    const { email, name } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send the welcome email
    const result = await sendWelcomeEmail(email, name);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Welcome email sent successfully',
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in send-welcome email route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Example usage in a client component:
 * 
 * async function sendWelcome() {
 *   const response = await fetch('/api/emails/send-welcome', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ 
 *       email: 'user@example.com',
 *       name: 'John Doe'
 *     }),
 *   });
 * 
 *   const data = await response.json();
 *   
 *   if (data.success) {
 *     console.log('Email sent successfully');
 *   } else {
 *     console.error('Error:', data.error);
 *   }
 * }
 */
