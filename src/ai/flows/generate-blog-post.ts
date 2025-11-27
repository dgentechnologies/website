
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
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

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
const AIModelOutputSchema = BlogPostOutputSchema.omit({ image: true, imageHint: true }).extend({
    imageHints: z.array(z.string()).describe('An array of at least 10 diverse, single-word or two-word keywords for the image content, e.g., ["technology", "abstract", "city skyline", "data network", "innovation", "future", "smart grid", "IoT", "connection", "urban"].'),
});
type AIModelOutput = z.infer<typeof AIModelOutputSchema>;


export async function generateBlogPost(input: BlogPostInput): Promise<BlogPostOutput> {
  return generateBlogPostFlow(input);
}

// Function to extract JSON from a string that might contain markdown fences
function extractJson(text: string): string {
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        return match[1];
    }
    return text; // Return original text if no JSON block is found
}

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: BlogPostInputSchema,
    outputSchema: BlogPostOutputSchema,
  },
  async (input) => {
    // Isolate server-side imports
    const { adminFirestore } = await import('@/firebase/server');
    const fsAdmin = await import('firebase-admin/firestore');

    // Function to get recently used image hints from Firestore
    async function getRecentHints(): Promise<string[]> {
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const hintsCollection = fsAdmin.collection(adminFirestore, 'usedImageHints');
        const q = fsAdmin.query(hintsCollection, fsAdmin.where('createdAt', '>=', sixtyDaysAgo));
        
        try {
            const querySnapshot = await fsAdmin.getDocs(q);
            const hints = querySnapshot.docs.map(doc => doc.data().hint as string);
            return [...new Set(hints)]; // Return unique hints
        } catch (error) {
            console.error("Error fetching recent hints:", error);
            return [];
        }
    }

    const recentHints = await getRecentHints();
    // Manually add 'city skyline' to ensure it's avoided
    if (!recentHints.includes('city skyline')) {
        recentHints.push('city skyline');
    }

    const recentHintsText = recentHints.length > 0 ? `\n\n**RECENTLY USED HINTS (DO NOT USE):**\n${recentHints.map(h => `- ${h}`).join('\n')}` : '';

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

**IMAGE HINTS (CRITICAL):**
Your most important task is generating 'imageHints'. These are search keywords for a photo API. They MUST be photographic and visual.
- **Generate at least 10 UNIQUE keywords.**
- **Each keyword MUST be only ONE or TWO words.** DO NOT generate long phrases.
- **Think like a photo editor.** Instead of abstract concepts, think about what a photo would actually show.
- **GOOD KEYWORDS:** "data network", "glowing circuits", "people collaborating", "urban garden", "solar panels", "modern architecture", "connected devices".
- **BAD KEYWORDS:** "Corporate Innovation", "Citizen Engagement", "Infrastructure Development", "Collaborative Ecosystem". These are abstract and will not find images.
- **Focus on CONCRETE and VISUAL terms** that are directly related to the specific blog topic: "${input.topic}".
${recentHintsText}

**CRITICAL RULES:**
1. Do NOT change or reinterpret the topic. The post must be about: "${input.topic}".
2. Do NOT generate random or unrelated topics.
3. Do NOT invent a new author. The author must be ${input.author}.
4. Do NOT generate an 'image' URL. You will only generate 'imageHints'.
5. Do NOT use any of the "RECENTLY USED HINTS" in your new 'imageHints' array.
6. Output ONLY a single, valid JSON object matching the required structure. Do not include any markdown formatting like \`\`\`json.
`;

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      config: { temperature: 0.8 },
    });
    
    if (!text) {
        throw new Error('Failed to generate blog post content. The AI returned an empty response.');
    }

    let output: AIModelOutput;
    try {
        const cleanJson = extractJson(text);
        output = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse AI output as JSON:", text);
        throw new Error("The AI returned invalid JSON. Please try again.");
    }
    
    console.log('Raw AI Output:', JSON.stringify(output, null, 2));

    const finalOutput: Partial<BlogPostOutput> & { imageHints?: string[] } = output;

    // Handle potential inconsistencies in property naming
    if ((finalOutput as any).body && !finalOutput.content) {
      finalOutput.content = (finalOutput as any).body;
    }

    // ✅ Force today's date if model gives wrong one
    const today = new Date();
    finalOutput.date = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Fetch image from Unsplash API directly
    let imageUrl = '';
    let usedHint = '';
    if (finalOutput.imageHints && Array.isArray(finalOutput.imageHints)) {
      for (const hint of finalOutput.imageHints) {
        try {
          const result = await unsplash.search.getPhotos({
            query: hint,
            page: 1,
            perPage: 1,
            orientation: 'landscape',
          });
          
          if (result.response && result.response.results.length > 0) {
            imageUrl = result.response.results[0].urls.regular;
            usedHint = hint;
            console.log(`Successfully fetched image from Unsplash for hint: "${hint}"`);
            
            // Save the used hint to Firestore
            await fsAdmin.addDoc(fsAdmin.collection(adminFirestore, 'usedImageHints'), {
                hint: usedHint,
                createdAt: fsAdmin.FieldValue.serverTimestamp(),
            });

            // Prioritize two-word hints for more specificity
            if (hint.includes(' ')) {
                break;
            }
          }
        } catch (error) {
          console.error(`Failed to fetch image from Unsplash for hint "${hint}":`, error);
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

    