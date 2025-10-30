
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
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import { BlogPost } from '@/types/blog';

const SuggestBlogTopicInputSchema = z.object({
    existingTitles: z.array(z.string()).describe('A list of existing blog post titles to avoid duplication.'),
});
export type SuggestBlogTopicInput = z.infer<typeof SuggestBlogTopicInputSchema>;

const SuggestBlogTopicOutputSchema = z.string().describe('A new, trending blog post topic related to smart cities or IoT.');
export type SuggestBlogTopicOutput = z.infer<typeof SuggestBlogTopicOutputSchema>;

export async function suggestBlogTopic(): Promise<SuggestBlogTopicOutput> {
    const existingTitles = await getExistingTitles();
    return suggestBlogTopicFlow({ existingTitles });
}

async function getExistingTitles(): Promise<string[]> {
    try {
        const querySnapshot = await getDocs(collection(firestore, 'blogPosts'));
        return querySnapshot.docs.map(doc => (doc.data() as BlogPost).title);
    } catch (error) {
        console.error("Error fetching existing blog titles:", error);
        return [];
    }
}


const prompt = `
You are a senior content strategist for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions in India.

Your task is to generate a compelling, new, and trending blog post topic. The topic should be relevant to smart cities, IoT, urban technology, or related fields.

Crucially, you must **not** suggest a topic that is too similar to the following existing blog posts:
{{#each existingTitles}}
- "{{this}}"
{{/each}}

Generate one single, concise, and engaging blog post title.
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
        output: {
            schema: SuggestBlogTopicOutputSchema,
        },
        config: {
            temperature: 0.9,
        }
    });

    // If the model fails to return a topic (e.g., if existingTitles is empty),
    // provide a default topic to prevent a null response.
    if (!output) {
      return "The Impact of 5G on Smart City Infrastructure in India";
    }

    return output;
  }
);
