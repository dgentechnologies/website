
'use server';
/**
 * @fileOverview An AI flow to suggest a new, trending blog post topic.
 *
 * - suggestBlogTopic - A function that suggests a blog topic.
 * - SuggestBlogTopicInput - The input type for the suggestBlogTopic function.
 * - SuggestBlogTopicOutput - The return type for the suggestBlogTopic function.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

// --- Initialize AI client ---
const ai = genkit({
  plugins: [googleAI()],
});


const SuggestBlogTopicInputSchema = z.object({
    existingTitles: z.array(z.string()).describe('A list of existing blog post titles to avoid duplication.'),
    suggestionHistory: z.array(z.string()).optional().describe('A list of topics already suggested in this session.'),
});
export type SuggestBlogTopicInput = z.infer<typeof SuggestBlogTopicInputSchema>;

const SuggestBlogTopicOutputSchema = z.string().describe('A new, trending blog post topic related to smart cities or IoT.');
export type SuggestBlogTopicOutput = z.infer<typeof SuggestBlogTopicOutputSchema>;

export async function suggestBlogTopic(input: SuggestBlogTopicInput): Promise<SuggestBlogTopicOutput> {
  const { text } = await ai.generate({
    model: googleAI.model('gemini-2.5-flash'),
    prompt: `
You are a senior content strategist for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions in India.

Generate a single, concise, and trending blog post topic related to Smart Cities, IoT, or Urban Technology.

Avoid any topics too similar to:
${input.existingTitles.map(t => `- "${t}"`).join('\n')}

Previously suggested topics:
${input.suggestionHistory?.map(t => `- "${t}"`).join('\n') || '(none)'}

Output only the blog title, without any extra text.
    `,
  });

  if (!text) {
    throw new Error('Failed to generate a blog topic suggestion.');
  }

  return text.trim();
}
