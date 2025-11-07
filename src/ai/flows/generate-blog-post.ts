
'use server';
/**
 * @fileOverview An AI flow to generate blog posts.
 *
 * - generateBlogPost - A function that generates a blog post based on an author and a topic.
 * - BlogPostInput - The input type for the generateBlogPost function.
 * - BlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const BlogPostInputSchema = z.object({
  author: z.enum(['Tirthankar Dasgupta', 'Sukomal Debnath', 'Sagnik Mandal', 'Arpan Bairagi'])
    .describe('The author of the blog post. The writing style will be adapted to this author\'s persona.'),
  topic: z.string().describe('The topic of the blog post.'),
});
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

const BlogPostOutputSchema = z.object({
    title: z.string().describe('The title of the blog post.'),
    description: z.string().describe('A short meta description for the blog post, optimized for SEO.'),
    slug: z.string().describe('The URL-friendly slug for the blog post.'),
    author: z.string().describe('The name of the author.'),
    date: z.string().describe('The publication date in "Month Day, Year" format.'),
    tags: z.array(z.string()).describe('An array of 2-3 relevant tags for the blog post.'),
    content: z.string().describe('The full content of the blog post, formatted as an HTML string with paragraphs, headings, and lists. Do not use Markdown.'),
    image: z.string().describe('URL for a relevant hero image for the blog post from an image provider like Unsplash.'),
    imageHint: z.string().describe('Two-word hint for the image content, e.g., "technology abstract".'),
});
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;

export async function generateBlogPost(input: BlogPostInput): Promise<BlogPostOutput> {
  return generateBlogPostFlow(input);
}

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: BlogPostInputSchema,
    outputSchema: BlogPostOutputSchema,
  },
  async (input) => {
    const prompt = `
You are an expert content creator for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions. Your task is to write a blog post that is both informative and engaging, reflecting the unique voice and perspective of the specified author.

The blog post MUST be about the following topic: **${input.topic}**.
You must generate all required fields for the blog post: 'title', 'description', 'slug', 'author', 'date', 'tags', 'content', and 'imageHint'.

- The 'title' MUST directly relate to the topic above.
- The 'description' MUST be a short, SEO-friendly meta description.
- The 'content' MUST be a full blog post in HTML format, at least 500 words, written entirely in the style of ${input.author}. Do NOT use any markdown characters like '*' or '#'. Use HTML tags like '<h3>' or '<p>'.
- The 'tags' MUST include 2-3 relevant tags.
- The 'date' MUST be the current date in "Month Day, Year" format.
- The 'slug' MUST be a URL-friendly version of the title.
- The 'image' field should be IGNORED.
- The 'imageHint' MUST be a two-word hint for the image content (e.g., "technology abstract").

**Author Persona:**
${input.author} — follow this exact persona’s tone and focus.

**CRITICAL RULES:**
1. Do NOT change or reinterpret the topic. The post must be about: "${input.topic}".
2. Do NOT generate random or unrelated topics.
3. Do NOT invent a new author. The author must be ${input.author}.
4. Do NOT generate an 'image' URL. You will only generate an 'imageHint'.
5. Output a single valid JSON object matching the output schema (no markdown).
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      config: { temperature: 0.8 },
    });

    if (!output) {
      throw new Error('Failed to generate blog post content.');
    }
    
    console.log('Raw AI Output:', JSON.stringify(output, null, 2));

    const finalOutput = output as any;

    // Handle potential inconsistencies in property naming
    if (finalOutput.body && !finalOutput.content) {
      finalOutput.content = finalOutput.body;
    }

    // ✅ Force today's date if model gives wrong one
    const today = new Date();
    finalOutput.date = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // ✅ Robust Image Handling: Use hint to find a local placeholder, or use a fallback.
    let selectedImage = PlaceHolderImages.find(img => img.id === 'blog-fallback'); // Default fallback

    if (finalOutput.imageHint) {
        const hintWords = finalOutput.imageHint.toLowerCase().split(' ');
        // Try to find a more relevant image from our pre-approved list
        const foundImage = PlaceHolderImages.find(p_img => 
            hintWords.some(h_word => p_img.imageHint.toLowerCase().includes(h_word)) && p_img.id !== 'blog-fallback'
        );
        if (foundImage) {
            selectedImage = foundImage;
        }
    }

    if (selectedImage) {
        finalOutput.image = selectedImage.imageUrl;
        finalOutput.imageHint = selectedImage.imageHint;
    } else {
        // This case should ideally not be hit if blog-fallback exists, but it's a safeguard.
        finalOutput.image = 'https://picsum.photos/seed/dgen/1200/800';
        finalOutput.imageHint = 'technology abstract';
    }
    
    // ✅ Force correct author (if model tries to alter)
    finalOutput.author = input.author;

    return finalOutput as BlogPostOutput;
  }
);
