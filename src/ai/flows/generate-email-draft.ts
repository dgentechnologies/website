
'use server';
/**
 * @fileOverview An AI flow to generate a draft email reply.
 *
 * - generateEmailDraft - A function that generates an email draft based on a sender's message.
 * - EmailDraftInput - The input type for the generateEmailDraft function.
 * - EmailDraftOutput - The return type for the generateEmailDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailDraftInputSchema = z.object({
  fromName: z.string().describe('The name of the person who sent the original message.'),
  subject: z.string().describe('The subject of the original message.'),
  message: z.string().describe('The content of the original message.'),
});
export type EmailDraftInput = z.infer<typeof EmailDraftInputSchema>;

const EmailDraftOutputSchema = z.object({
    draft: z.string().describe('The generated email draft reply, formatted as a complete email with a salutation, body, and closing.'),
});
export type EmailDraftOutput = z.infer<typeof EmailDraftOutputSchema>;

export async function generateEmailDraft(input: EmailDraftInput): Promise<EmailDraftOutput> {
  return generateEmailDraftFlow(input);
}

const generateEmailDraftFlow = ai.defineFlow(
  {
    name: 'generateEmailDraftFlow',
    inputSchema: EmailDraftInputSchema,
    outputSchema: EmailDraftOutputSchema,
  },
  async (input) => {
    const prompt = `
You are a helpful assistant for DGEN Technologies, a smart city and IoT solutions company.
Your task is to generate a professional and helpful draft reply to an incoming message.

The reply should be addressed to the original sender, ${input.fromName}.
The original message subject was: "${input.subject}".
The original message content is: "${input.message}".

Based on the message, generate a polite and helpful email draft.
If the message is a sales inquiry, be positive and suggest a follow-up call.
If it's a support request, be empathetic and provide initial guidance.
If it's a general question, answer it concisely.

The draft should be a complete email, starting with a salutation (e.g., "Hi ${input.fromName},") and ending with a professional closing (e.g., "Best regards,\nThe DGEN Technologies Team").

Output ONLY a single, valid JSON object with a "draft" key containing the email content.
`;

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      config: { temperature: 0.5 },
    });

    if (!text) {
        throw new Error('Failed to generate email draft. The AI returned an empty response.');
    }

    try {
        const parsed = JSON.parse(text);
        return { draft: parsed.draft };
    } catch (e) {
        console.error("Failed to parse AI output as JSON:", text);
        throw new Error("The AI returned invalid JSON. Please try again.");
    }
  }
);
