
'use server';
/**
 * @fileOverview An AI flow to suggest a new, trending blog post topic.
 *
 * - suggestBlogTopic - A function that suggests a blog topic.
 * - SuggestBlogTopicInput - The input type for the suggestBlogTopic function.
 * - SuggestBlogTopicOutput - The return type for the suggestBlogTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { firestore } from '@/firebase/server';
import { BlogPost } from '@/types/blog';

const SuggestBlogTopicInputSchema = z.object({
    existingTitles: z.array(z.string()).describe('A list of existing blog post titles to avoid duplication.'),
    suggestionHistory: z.array(z.string()).optional().describe('A list of topics already suggested in this session.'),
});
export type SuggestBlogTopicInput = z.infer<typeof SuggestBlogTopicInputSchema>;

const SuggestBlogTopicOutputSchema = z.string().describe('A new, trending blog post topic related to smart cities or IoT.');
export type SuggestBlogTopicOutput = z.infer<typeof SuggestBlogTopicOutputSchema>;

export async function suggestBlogTopic(suggestionHistory: string[] = []): Promise<SuggestBlogTopicOutput> {
    const existingTitles = await getExistingTitles();
    return suggestBlogTopicFlow({ existingTitles, suggestionHistory });
}

async function getExistingTitles(): Promise<string[]> {
    const snapshot = await firestore.collection('blogPosts').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => (doc.data() as BlogPost).title);
}

const prompt = `
You are a senior content strategist for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions in India.

Your task is to generate a compelling, new, and trending blog post topic. The topic should be relevant to smart cities, IoT, urban technology, or related fields.

Crucially, you must **not** suggest a topic that is too similar to any of the following existing blog posts or previously suggested topics:

**Existing Blog Posts:**
{{#if existingTitles}}
{{#each existingTitles}}
- "{{this}}"
{{/each}}
{{else}}
(No existing titles provided)
{{/if}}

**Previously Suggested Topics in this Session:**
{{#if suggestionHistory}}
{{#each suggestionHistory}}
- "{{this}}"
{{/each}}
{{else}}
(No previous suggestions in this session)
{{/if}}


Generate one single, concise, and engaging blog post title. Your entire output should be just the title string itself, without any JSON formatting or markdown.

Example Output:
The Impact of 5G on Smart City Infrastructure in India
`;

const suggestBlogTopicFlow = ai.defineFlow(
  {
    name: 'suggestBlogTopicFlow',
    inputSchema: SuggestBlogTopicInputSchema,
    outputSchema: SuggestBlogTopicOutputSchema,
  },
  async (input) => {

    const { output } = await ai.generate({
        prompt: prompt,
        input,
        model: 'googleai/gemini-2.5-flash',
        config: {
            temperature: 0.9,
        }
    });

    if (!output) {
      throw new Error("Failed to generate a blog topic suggestion.");
    }

    return output;
  }
);
