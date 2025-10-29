
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, UserCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export const blogPosts = [
  {
    slug: 'future-is-bright-smart-street-lights',
    title: 'The Future is Bright: How Smart Street Lights are Transforming Our Cities',
    description: 'Dive deep into the technology behind smart street lights like Auralis. Discover how they reduce energy consumption, enhance public safety, and create a connected infrastructure for the cities of tomorrow.',
    author: 'Tirthankar Dasgupta',
    date: 'October 26, 2025',
    image: PlaceHolderImages.find(img => img.id === 'auralis-features'),
    tags: ['Smart Cities', 'IoT', 'Auralis'],
    content: `
      <p>Smart street lights are rapidly becoming the backbone of modern smart cities. Unlike their traditional counterparts, these intelligent lighting systems, such as our flagship product "Auralis," do more than just illuminate our streets. They form a connected network that can gather data, save energy, and improve public safety in ways we're only beginning to explore.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">Intelligent Energy Consumption</h3>
      <p>One of the most significant advantages of smart street lights is their ability to dramatically reduce energy consumption. Using advanced LED technology combined with adaptive lighting controls, Auralis can dim lights during off-peak hours and brighten them when motion is detected. This not only cuts electricity costs for municipalities by up to 60% but also significantly reduces the city's carbon footprint.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">A Network for a Safer City</h3>
      <p>Beyond lighting, Auralis acts as a hub for various public safety applications. Integrated sensors can detect everything from traffic flow to unusual noises, providing real-time data to city operators. In the event of an emergency, the lights can be programmed to flash in specific patterns, guiding first responders to the scene more efficiently. This creates a safer, more responsive urban environment for everyone.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">The Foundation for Future Growth</h3>
      <p>Perhaps the most exciting aspect of smart street lights is their role as a platform for future innovation. With built-in connectivity (LoRaWAN, 4G/5G), these poles can host a wide array of IoT devices, from environmental sensors and public Wi-Fi hotspots to electric vehicle charging stations. This turns simple street infrastructure into a dynamic, data-driven ecosystem that can adapt to the evolving needs of the city.</p>
    `
  },
  {
    slug: 'beyond-connectivity-iot-impact',
    title: 'Beyond Connectivity: The Real-World Impact of IoT in Urban India',
    description: 'The Internet of Things (IoT) is more than just a buzzword. We explore how connected devices are solving practical problems in Indian cities, from waste management to real-time traffic monitoring.',
    author: 'Sagnik Mandal',
    date: 'October 20, 2025',
    image: PlaceHolderImages.find(img => img.id === 'hero-home'),
    tags: ['IoT', 'Urban Development', 'Technology'],
    content: `
      <p>The Internet of Things (IoT) is fundamentally reshaping urban life in India. Far from being a futuristic concept, IoT is providing practical, on-the-ground solutions to some of our most pressing urban challenges. It's about creating a city that is more efficient, responsive, and livable for its citizens.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">Smarter Waste Management</h3>
      <p>Consider the daily challenge of waste collection. With IoT-enabled smart bins, sanitation departments can get real-time alerts when bins are full. This allows for optimized collection routes, preventing overflowing garbage cans and reducing unnecessary trips. The result is cleaner streets, lower fuel consumption for collection trucks, and more efficient use of municipal resources.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">Real-Time Traffic Monitoring</h3>
      <p>Traffic congestion is a major issue in every large Indian city. IoT sensors embedded in roads and integrated with traffic signals can dynamically adjust signal timings based on real-time traffic flow. This helps to reduce bottlenecks, decrease travel times, and lower vehicle emissions. Data collected from this network can also be used for long-term urban planning to build more efficient transportation infrastructure.</p>
    `
  },
  {
    slug: 'case-study-auralis-kolkata',
    title: 'Case Study: Predictive Fault Detection with Auralis in Kolkata',
    description: 'A look at the successful pilot program of our Auralis system. This case study examines how our AI-powered predictive maintenance saved the city thousands in operational costs and improved lighting uptime by over 40%.',
    author: 'Arpan Bairagi',
    date: 'October 15, 2025',
    image: PlaceHolderImages.find(img => img.id === 'auralis-hero'),
    tags: ['Case Study', 'AI', 'Maintenance'],
    content: `
      <p>Reactive maintenance—fixing things only after they break—is inefficient and costly. This is especially true for critical infrastructure like street lighting. Our recent pilot program for the Auralis system in Kolkata demonstrates the power of a predictive, AI-driven approach.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">The Challenge: Unplanned Outages</h3>
      <p>The city's maintenance crews were constantly stretched thin, responding to citizen complaints about outages. This reactive model led to significant downtime, increased public safety concerns, and high overtime costs for repair crews. They needed a way to get ahead of the problem.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">The Solution: AI-Powered Predictions</h3>
      <p>We deployed 500 Auralis units across a key district. The system's AI continuously monitors the electrical parameters of each light. By analyzing subtle fluctuations and performance degradation over time, the AI can predict a component failure with over 95% accuracy, often weeks before it happens. An automated alert is then sent to the maintenance dashboard, complete with the location and the specific component likely to fail.</p>
      <h3 class="text-2xl font-headline font-bold mt-8 mb-4">The Results: A Game Changer</h3>
      <p>The results from the six-month pilot were transformative. The city saw a 40% reduction in maintenance calls and a massive increase in lighting uptime to over 99%. By scheduling repairs proactively during regular working hours, overtime costs were nearly eliminated. This case study proves that predictive maintenance isn't just a feature; it's a fundamental shift in how cities can manage their infrastructure efficiently and cost-effectively.</p>
    `
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Insights</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
              DGEN Technologies Blog
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Exploring the future of smart cities, IoT, and sustainable technology.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.title} className="flex flex-col overflow-hidden bg-card/50 hover:bg-card hover:shadow-primary/10 hover:shadow-lg transition-all transform hover:-translate-y-2">
                {post.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.image.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      data-ai-hint={post.image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                  <CardTitle className="font-headline text-xl h-20">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{post.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  <div className="flex items-center text-sm text-foreground/70 space-x-4">
                      <div className="flex items-center gap-2">
                          <UserCircle className="h-4 w-4" />
                          <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                      </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
