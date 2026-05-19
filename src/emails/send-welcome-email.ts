import { render } from 'react-email';
import { Resend } from 'resend';
import { WelcomeEmail } from './welcome-email';

type SendWelcomeEmailResult = {
  success: boolean;
  data?: { id: string };
  error?: string;
};

/**
 * Renders the welcome email template as HTML
 * @param userName - The user's name for personalization
 * @param userEmail - The user's email address
 * @returns HTML string of the rendered email
 */
export const renderWelcomeEmail = async (userName: string, userEmail: string): Promise<string> => {
  return render(WelcomeEmail({ userName, userEmail }));
};

/**
 * Sends a welcome email using Resend API
 * Requires RESEND_API_KEY environment variable
 */
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<SendWelcomeEmailResult> {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      error: 'Missing RESEND_API_KEY environment variable.',
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL || 'hello@dgentechnologies.com';

  const { data, error } = await resend.emails.send(
    {
      from,
      to: [userEmail],
      subject: 'Welcome to Dgen Technologies - Innovate. Integrate. Inspire.',
      react: WelcomeEmail({ userName, userEmail }),
      headers: {
        'X-Priority': '1',
      },
    },
    {
      idempotencyKey: `welcome-user/${userEmail.toLowerCase()}`,
    }
  );

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data: { id: data?.id ?? '' },
  };
}

/**
 * Sends welcome email from an API route or server action
 * Use this variant in Next.js API routes or Server Actions
 */
export async function sendWelcomeEmailFromAction(userEmail: string, userName: string) {
  'use server';

  return sendWelcomeEmail(userEmail, userName);
}
