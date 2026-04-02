'use server';
/**
 * @fileOverview An AI flow to generate a complete career listing from a brief description.
 *
 * - generateCareerListing - Generates all form fields for a career listing.
 * - CareerListingInput - The input type for the generateCareerListing function.
 * - CareerListingOutput - The return type for the generateCareerListing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CareerListingInputSchema = z.object({
  brief: z.string().describe(
    'A short description of the role to create. E.g. "3-month remote React internship for IoT dashboard development, paid ₹10,000/month" or "Full-time backend engineer, Node.js, hybrid, competitive salary".'
  ),
});
export type CareerListingInput = z.infer<typeof CareerListingInputSchema>;

const CareerListingOutputSchema = z.object({
  position: z.string().describe('The job title or position name.'),
  category: z.string().describe('The department or category, e.g. "Engineering", "Marketing", "Finance".'),
  topic: z.string().describe('The specific area of work or technology, e.g. "IoT, Web Development", "React, Node.js".'),
  type: z.enum(['job', 'internship']).describe('"job" for full-time roles, "internship" for internship positions.'),
  workMode: z.enum(['remote', 'onsite', 'hybrid']).describe('The work mode: remote, onsite, or hybrid.'),
  compensation: z.enum(['paid', 'unpaid', 'intern-paid']).describe(
    '"paid" = company pays the candidate; "unpaid" = no payment; "intern-paid" = intern pays a fee to join.'
  ),
  amount: z.string().optional().describe('The compensation amount in INR (₹), e.g. "₹15,000". Only set when compensation is "paid" or "intern-paid".'),
  amountSpan: z.enum(['per month', 'per year', 'per week', 'fixed']).optional().describe('The pay period. Only set when compensation is "paid" or "intern-paid".'),
  duration: z.string().describe('How long the role lasts, e.g. "3 months", "6 months", "Full-time permanent".'),
  description: z.string().describe('A detailed description of the role, responsibilities, and what the candidate will work on. At least 3-4 sentences.'),
  requirements: z.string().describe('A newline-separated list of required skills, qualifications, and experience. At least 4-6 bullet points.'),
});
export type CareerListingOutput = z.infer<typeof CareerListingOutputSchema>;

// Function to extract JSON from a string that might contain markdown fences
function extractJson(text: string): string {
  const jsonRegex = /```json\n([\s\S]*?)\n```/;
  const match = text.match(jsonRegex);
  if (match && match[1]) {
    return match[1];
  }
  return text;
}

export async function generateCareerListing(input: CareerListingInput): Promise<CareerListingOutput> {
  const { text } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `
You are an expert HR content writer for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions based in India.

Your task is to generate a complete, professional career listing based on the following brief description provided by the admin:

**Brief:** "${input.brief}"

Generate all required fields for the listing and return ONLY a single, valid JSON object matching the schema below. Do not include any markdown formatting.

**Schema:**
- "position": string — Job title (e.g. "Frontend Developer Intern", "Senior Backend Engineer")
- "category": string — Department (e.g. "Engineering", "Design", "Marketing", "Finance", "Operations")
- "topic": string — Specific technologies or area (e.g. "React, IoT Dashboard", "Python, Machine Learning")
- "type": "job" | "internship" — "internship" if the role is for a limited period/training, otherwise "job"
- "workMode": "remote" | "onsite" | "hybrid" — based on the brief; default to "onsite" if not specified
- "compensation": "paid" | "unpaid" | "intern-paid" — "paid" means company pays, "unpaid" means no payment, "intern-paid" means intern pays a fee
- "amount": string (optional) — Amount in INR format with ₹ symbol, e.g. "₹15,000". Only include if compensation is "paid" or "intern-paid". Omit for "unpaid".
- "amountSpan": "per month" | "per year" | "per week" | "fixed" (optional) — Pay period. Only include if compensation is "paid" or "intern-paid". Omit for "unpaid".
- "duration": string — How long the role lasts (e.g. "3 months", "6 months", "Full-time permanent")
- "description": string — At least 3-4 sentences describing the role, key responsibilities, and what the candidate will work on at DGEN Technologies
- "requirements": string — Newline-separated list of 5-7 specific skills and qualifications needed

**Rules:**
1. All currency amounts MUST be in INR (₹). Never use USD ($) or any other currency.
2. Write "requirements" as a plain newline-separated list (e.g. "Proficiency in React.js\\nStrong understanding of REST APIs\\nGood communication skills"). Do NOT use bullet characters or markdown.
3. Keep "description" professional and specific to DGEN Technologies' domain (Smart Cities, IoT, sustainability).
4. If the brief mentions a salary or fee, use that amount in INR in the "amount" field. Otherwise, leave "amount" and "amountSpan" out.
5. Output ONLY a valid JSON object. No markdown. No extra text.
`,
    config: { temperature: 0.5 },
  });

  if (!text) {
    throw new Error('The AI returned an empty response. Please try again.');
  }

  try {
    const cleanJson = extractJson(text);
    const parsed = JSON.parse(cleanJson) as CareerListingOutput;
    if (!parsed.position || !parsed.category || !parsed.description) {
      throw new Error('Incomplete AI response.');
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse AI career listing output:', text, e);
    throw new Error('The AI returned an invalid format. Please try again.');
  }
}
