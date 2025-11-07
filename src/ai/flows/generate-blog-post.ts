
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

You must also source a relevant, high-quality hero image from a stock photo provider like Unsplash and provide the URL and a two-word hint for the image.

The 'date' field MUST be the current date, formatted as "Month Day, Year". For example: "August 1, 2024".
The 'slug' field should be a URL-friendly version of the title.

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

**Instructions:**

1.  **Adopt the Persona:** Write the entire blog post from the perspective of the chosen author: **{{author}}**.
2.  **Topic:** The blog post must be about: **{{topic}}**.
3.  **Content:** Generate a comprehensive blog post of at least 500 words. Structure it with a clear introduction, body, and conclusion. Use HTML tags for formatting (e.g., \`<h3>\`, \`<p>\`, \`<ul>\`, \`<li>\`).
4.  **Output Format:** Provide the output as a single, valid JSON object that conforms to the schema. Do not add any markdown formatting (e.g., \`\`\`json\`) or other text to the output.
`;

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: BlogPostInputSchema,
    outputSchema: BlogPostOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        prompt: personaPrompt,
        input,
        model: 'googleai/gemini-2.5-flash',
        config: {
            temperature: 1,
        }
    });

    if (!output) {
        throw new Error('Failed to generate blog post content.');
    }
    
    // Ensure date is current if not correctly generated by the model
    const generatedDate = new Date(output.date);
    const today = new Date();

    if (isNaN(generatedDate.getTime()) || generatedDate.getFullYear() !== today.getFullYear() || generatedDate.getMonth() !== today.getMonth() || generatedDate.getDate() !== today.getDate()) {
        output.date = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    return output;
  }
);
