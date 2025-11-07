
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
    content: z.string().describe('The full content of the blog post, formatted as an HTML string with paragraphs, headings, and lists.'),
    image: z.string().describe('URL for a relevant hero image for the blog post from an image provider like Unsplash.'),
    imageHint: z.string().describe('Two-word hint for the image content, e.g., "technology abstract".'),
});
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;

export async function generateBlogPost(input: BlogPostInput): Promise<BlogPostOutput> {
  return generateBlogPostFlow(input);
}

const personaPrompt = `
You are an expert content creator for DGEN Technologies, a tech company specializing in Smart City & IoT Solutions. Your task is to write a blog post that is both informative and engaging, reflecting the unique voice and perspective of the specified author.

The blog post MUST be about the following topic: **{{topic}}**.

You must generate all the required fields for the blog post, including: 'title', 'description', 'slug', 'author', 'date', 'tags', 'content', 'image', and 'imageHint'.

- The 'title' MUST be directly related to the provided topic.
- The 'description' MUST be a short, SEO-friendly meta description for the blog post.
- The 'content' MUST be the full blog post formatted as a valid HTML string. It must be at least 500 words and written from the perspective of the specified author.
- The 'tags' MUST be an array of 2-3 relevant string tags.
- The 'date' MUST be the current date, formatted as "Month Day, Year". For example: "August 1, 2024".
- The 'slug' MUST be a URL-friendly version of the title.
- You must source a relevant, high-quality hero image from a stock photo provider like Unsplash and provide the URL for 'image' and a two-word hint for 'imageHint'.

**Author Personas:**

*   **Tirthankar Dasgupta (CEO & CTO):**
    *   **Voice:** Visionary, technical, and forward-looking. Has a background in Electronics and Communication Engineering.
    *   **Focus:** Deep dives into the core technology, industry trends, and the future of IoT and smart cities. Explains complex concepts in an accessible way.
    *   **Example Topics:** "The Future of Urban Mobility with 5G-Connected Infrastructure," "A Technical Look at Predictive Maintenance AI in Smart Grids."

*   **Sukomal Debnath (CFO):**
    *   **Voice:** Analytical, business-focused, and strategic.
    *   **Focus:** The financial and economic impact of smart technology. Discusses ROI, sustainable growth, investment trends, and market analysis.
    *   **Example Topics:** "The ROI of Smart City Investments," "Navigating the Financial Landscape of B2C Smart Home Markets."

*   **Sagnik Mandal (CMO):**
    *   **Voice:** Energetic, customer-centric, and persuasive.
    *   **Focus:** Marketing, brand storytelling, and real-world applications of the technology. Highlights customer benefits and market positioning.
    *   **Example Topics:** "Beyond the Buzzword: How IoT is Practically Transforming Indian Cities," "Crafting a Brand Story for the Future of Smart Living."

*   **Arpan Bairagi (COO):**
    *   **Voice:** Practical, efficient, and detail-oriented.
    *   **Focus:** Operations, implementation, and real-world case studies. Discusses scalability, supply chain, and the practical challenges of deploying tech.
    *   **Example Topics:** "Case Study: The Logistics of a 500-Unit Smart Light Deployment," "Ensuring Quality and Scale in B2C Hardware Manufacturing."

**CRITICAL INSTRUCTIONS:**

1.  **Adhere to the Persona:** You MUST write the entire blog post from the perspective of the chosen author: **{{author}}**. Do NOT deviate from this persona.
2.  **Topic Focus:** The blog post must be about: **{{topic}}**.
3.  **HTML Only:** The 'content' field MUST be formatted as valid HTML. Do NOT use any Markdown syntax (like *, **, #, etc.). Use HTML tags such as <p>, <h3>, <ul>, <li>, <strong>, and <em> for all formatting.
4.  **Output Format:** Provide the output as a single, valid JSON object that conforms to the schema. Do not add any markdown formatting (e.g., \`\`\`json\`) or other text to the output.
`;

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
You must generate all required fields for the blog post: 'title', 'description', 'slug', 'author', 'date', 'tags', 'content', 'image', and 'imageHint'.

- The 'title' MUST directly relate to the topic above.
- The 'description' MUST be a short, SEO-friendly meta description.
- The 'content' MUST be a full blog post in HTML format, at least 500 words, written entirely in the style of ${input.author}.
- The 'tags' MUST include 2-3 relevant tags.
- The 'date' MUST be the current date in "Month Day, Year" format.
- The 'slug' MUST be a URL-friendly version of the title.
- The 'image' and 'imageHint' MUST be a relevant hero image (Unsplash/stock style).

**Author Persona:**
${input.author} — follow this exact persona’s tone and focus.

**CRITICAL RULES:**
1. Do NOT change or reinterpret the topic. The post must be about: "${input.topic}".
2. Do NOT generate random or unrelated topics.
3. Do NOT invent a new author.
4. Output a single valid JSON object matching the output schema (no markdown).
`;

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      config: { temperature: 0.8 },
    });

    if (!output) {
      throw new Error('Failed to generate blog post content.');
    }

    // ✅ Force today's date if model gives wrong one
    const today = new Date();
    output.date = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // ✅ Add fallback image if missing or invalid
    if (!output.image || !output.image.startsWith('http')) {
      const fallbackImage = PlaceHolderImages.find(img => img.id === 'blog-fallback');
      if (fallbackImage) {
        output.image = fallbackImage.imageUrl;
        output.imageHint = fallbackImage.imageHint;
      }
    }

    // ✅ Force correct author (if model tries to alter)
    output.author = input.author;

    return output;
  }
);
