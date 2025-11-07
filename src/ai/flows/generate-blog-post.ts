
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

// The final output returned to the client should not contain the hints array.
const BlogPostOutputSchema = z.object({
    title: z.string().describe('The title of the blog post.'),
    description: z.string().describe('A short meta description for the blog post, optimized for SEO.'),
    slug: z.string().describe('The URL-friendly slug for the blog post.'),
    author: z.string().describe('The name of the author.'),
    date: z.string().describe('The publication date in "Month Day, Year" format.'),
    tags: z.array(z.string()).describe('An array of 2-3 relevant tags for the blog post.'),
    content: z.string().describe('The full content of the blog post, formatted as an HTML string with paragraphs, headings, and lists. Do not use Markdown.'),
    image: z.string().describe('URL for a relevant hero image for the blog post.'),
    imageHint: z.string().describe('The two-word hint that was successfully used to find the image.'),
});
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;

// The AI model's output will include the hints.
const AIModelOutputSchema = BlogPostOutputSchema.extend({
    imageHints: z.array(z.string()).describe('An array of 3-4 different two-word hints for the image content, e.g., ["technology abstract", "city skyline", "data network"].'),
});


export async function generateBlogPost(input: BlogPostInput): Promise<BlogPostOutput> {
  return generateBlogPostFlow(input);
}

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: BlogPostInputSchema,
    outputSchema: AIModelOutputSchema,
  },
  async (input) => {
    const prompt = `
You are an expert content creator for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions. Your task is to write a blog post that is both informative and engaging, reflecting the unique voice and perspective of the specified author.

The blog post MUST be about the following topic: **${input.topic}**.
You must generate all required fields for the blog post: 'title', 'description', 'slug', 'author', 'date', 'tags', 'content', and 'imageHints'.

- The 'title' MUST directly relate to the topic above.
- The 'description' MUST be a short, SEO-friendly meta description.
- The 'content' MUST be a full blog post in HTML format, at least 500 words, written entirely in the style of ${input.author}. Do NOT use any markdown characters like '*' or '#'. Use HTML tags like '<h3>' or '<p>'.
- The 'tags' MUST include 2-3 relevant tags.
- The 'date' MUST be the current date in "Month Day, Year" format.
- The 'slug' MUST be a URL-friendly version of the title.
- The 'image' field should be IGNORED.
- The 'imageHints' MUST be an array of 3-4 different two-word hints for the image content (e.g., ["technology abstract", "city data", "urban network"]).

**Author Persona:**
${input.author} — follow this exact persona’s tone and focus.

**CRITICAL RULES:**
1. Do NOT change or reinterpret the topic. The post must be about: "${input.topic}".
2. Do NOT generate random or unrelated topics.
3. Do NOT invent a new author. The author must be ${input.author}.
4. Do NOT generate an 'image' URL. You will only generate 'imageHints'.
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

    // Fetch image from Unsplash API route by iterating through hints
    let imageUrl = '';
    let usedHint = '';
    if (finalOutput.imageHints && Array.isArray(finalOutput.imageHints)) {
        for (const hint of finalOutput.imageHints) {
            try {
                // Use a full URL for server-side fetch
                const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';
                const response = await fetch(`${baseUrl}/api/unsplash?query=${encodeURIComponent(hint)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.url) {
                        imageUrl = data.url;
                        usedHint = hint;
                        console.log(`Successfully fetched image for hint: "${hint}"`);
                        break; // Stop on the first successful fetch
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch image for hint "${hint}":`, error);
            }
        }
    }

    if (imageUrl) {
        finalOutput.image = imageUrl;
        finalOutput.imageHint = usedHint;
    } else {
        // Fallback to a placeholder if all Unsplash hints fail
        console.log('All image hints failed. Using fallback image.');
        const fallbackImage = PlaceHolderImages.find(img => img.id === 'blog-fallback');
        if (fallbackImage) {
            finalOutput.image = fallbackImage.imageUrl;
            finalOutput.imageHint = fallbackImage.imageHint;
        } else {
            // Ultimate fallback
            finalOutput.image = 'https://picsum.photos/seed/dgen/1200/800';
            finalOutput.imageHint = 'technology abstract';
        }
    }
    
    // ✅ Force correct author (if model tries to alter)
    finalOutput.author = input.author;

    // Clean up hints array before returning
    delete finalOutput.imageHints;

    return finalOutput as BlogPostOutput;
  }
);
