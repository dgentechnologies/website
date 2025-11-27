
'use server';
/**
 * @fileOverview An AI flow to suggest new, trending blog post topics tailored to an author's persona.
 *
 * - suggestBlogTopic - A function that suggests blog topics.
 * - SuggestBlogTopicInput - The input type for the suggestBlogTopic function.
 * - SuggestBlogTopicOutput - The return type for the suggestBlogTopic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestBlogTopicInputSchema = z.object({
  author: z.string().describe("The author for whom to suggest topics. The topics should match this person's role and expertise."),
  existingTitles: z.array(z.string()).describe('A list of existing blog post titles to avoid duplication.'),
  suggestionHistory: z.array(z.string()).optional().describe('A list of topics already suggested in this session.'),
});
export type SuggestBlogTopicInput = z.infer<typeof SuggestBlogTopicInputSchema>;

const SuggestBlogTopicOutputSchema = z.object({
    topics: z.array(z.string()).describe('An array of 3 new, trending blog post topics related to smart cities or IoT, tailored to the author\'s persona.'),
});
export type SuggestBlogTopicOutput = z.infer<typeof SuggestBlogTopicOutputSchema>;

// Function to extract JSON from a string that might contain markdown fences
function extractJson(text: string): string {
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        return match[1];
    }
    return text; // Return original text if no JSON block is found
}

export async function suggestBlogTopic(input: SuggestBlogTopicInput): Promise<SuggestBlogTopicOutput> {
  const { text } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `
You are a senior content strategist for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions.

Your task is to generate exactly 3 concise, trending, and distinct blog post topics that are perfectly suited for the following author: **${input.author}**.

The topics must be related to Smart Cities, IoT, Urban Technology, or the business/marketing/finance side of the tech industry.

Consider the author's role and persona when generating the topics.

Do NOT suggest topics that are too similar to these existing titles:
${input.existingTitles.map(t => `- "${t}"`).join('\n')}

Do NOT suggest topics that are too similar to these previously suggested topics:
${input.suggestionHistory?.map(t => `- "${t}"`).join('\n') || '(none)'}

Output ONLY a single, valid JSON object with a "topics" key, which is an array of 3 strings.
Example format:
{
  "topics": [
    "First Suggested Topic",
    "Second Suggested Topic",
    "Third Suggested Topic"
  ]
}
`,
    output: {
      format: 'json',
      schema: SuggestBlogTopicOutputSchema,
    },
  });

  if (!text) {
    throw new Error('Failed to generate a blog topic suggestion.');
  }

  try {
    const cleanJson = extractJson(text);
    const parsed = JSON.parse(cleanJson) as SuggestBlogTopicOutput;
    // Basic validation
    if (parsed.topics && Array.isArray(parsed.topics) && parsed.topics.length > 0) {
        return parsed;
    }
    throw new Error('Invalid format for suggested topics.');
  } catch (e) {
    console.error("Failed to parse AI output for topic suggestion:", text);
    throw new Error("The AI returned an invalid format for topic suggestions.");
  }
}
