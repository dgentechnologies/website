import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send confirmation email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hello@dgentechnologies.com',
      to: email,
      subject: 'Thank You for Contacting Dgen Technologies',
      react: WelcomeEmail({ 
        userName: name,
        userEmail: email,
        companyName: 'Dgen Technologies'
      }),
    }, {
      idempotencyKey: `contact-${email}-${Date.now()}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Confirmation email sent successfully',
        emailId: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
