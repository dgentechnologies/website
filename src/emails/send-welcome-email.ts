import { render } from 'react-email';
import { WelcomeEmail } from './welcome-email';

/**
 * Renders the welcome email template as HTML
 * @param userName - The user's name for personalization
 * @param userEmail - The user's email address
 * @returns HTML string of the rendered email
 */
export const renderWelcomeEmail = (userName: string, userEmail: string): string => {
  return render(WelcomeEmail({ userName, userEmail }));
};

/**
 * Sends a welcome email using Resend API
 * Requires RESEND_API_KEY environment variable
 *
 * @param userEmail - Recipient email address
 * @param userName - Recipient's name for personalization
 * @returns Promise with email send result
 *
 * @example
 * import { sendWelcomeEmail } from '@/emails/send-welcome-email';
 *
 * await sendWelcomeEmail('john@example.com', 'John');
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  // Commented out until Resend is installed and configured
  // Uncomment and configure when ready to use:

  /*
  const { Resend } = await import('resend');
  
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: 'hello@dgentechnologies.com',
      to: userEmail,
      subject: 'Welcome to Dgen Technologies - Innovate. Integrate. Inspire.',
      react: WelcomeEmail({ userName, userEmail }),
      headers: {
        'X-Priority': '1',
      },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
  */

  throw new Error(
    'Resend email service is not configured. Please install react-email and resend packages, then uncomment the implementation.'
  );
}

/**
 * Sends welcome email from an API route or server action
 * Use this variant in Next.js API routes or Server Actions
 */
export async function sendWelcomeEmailFromAction(userEmail: string, userName: string) {
  'use server';

  return sendWelcomeEmail(userEmail, userName);
}
