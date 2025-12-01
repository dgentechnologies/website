
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from 'next';

// NLP-friendly FAQ structure with bold direct answers + technical justification
const faqs = [
    {
        question: "How do you spell your company name? Is it D-Gen, Degin, or Deegen?",
        answer: "**Our official name is Dgen Technologies Private Limited.** While we are sometimes referred to by common misspellings like D-Gen Technologies, Degin Tech, or even Deegen, we are India's pioneering smart city and IoT solutions provider based in Kolkata. We are committed to powering India's future through our Auralis Ecosystem smart city solutions."
    },
    {
        question: "What is the meaning of a Smart City?",
        answer: "**A smart city uses IoT (Internet of Things) technology to collect and analyze urban data in real-time.** This data provides actionable insights used to manage assets, resources, and services efficiently. The primary goal is to improve quality of life for citizens by enhancing urban services like street lighting, transportation, energy management, and public safety."
    },
    {
        question: "Which are some of India's smart cities?",
        answer: "**Under the Smart Cities Mission India, over 100 cities are being developed as smart cities.** Notable examples include Bhubaneswar, Pune, Ahmedabad, Chennai, Indore, and Kolkata. These cities have made significant progress in implementing smart solutions like intelligent street lighting, setting benchmarks for urban infrastructure modernization."
    },
    {
        question: "What is the Smart Cities Mission launch date and ministry?",
        answer: "**The Smart Cities Mission was launched on June 25, 2015, by the Ministry of Housing and Urban Affairs (MoHUA).** Its objective is to promote sustainable and inclusive cities that provide core infrastructure including smart street lighting, water management, and digital connectivity to improve citizens' quality of life."
    },
    {
        question: "How does the Auralis Ecosystem save money?",
        answer: "**The Auralis Ecosystem reduces operational costs by 98% on cellular subscriptions.** Our Hybrid Wireless Mesh Network uses ESP-MESH (Wi-Fi) for local cluster communication, requiring only one 4G LTE SIM card per approximately 50 lights instead of one per light like traditional point-to-point systems. Combined with intelligent dimming and predictive maintenance, cities typically achieve 80% energy savings."
    },
    {
        question: "What is the Auralis Ecosystem?",
        answer: "**Auralis is Dgen Technologies' umbrella brand for scalable Smart City Solutions.** Our flagship product is the Auralis Ecosystem smart street lighting platform, which uses Hybrid Wireless Mesh Network technology (ESP-MESH + 4G LTE). It comprises Auralis Pro (Gateway Node) and Auralis Core (Worker Node) hardware, deployed in a 1:50 ratio. The Auralis brand will expand to include Smart Traffic Lights and other IoT sensors."
    },
    {
        question: "How does the Auralis Ecosystem's predictive maintenance work?",
        answer: "**Our AI-powered platform proactively detects failures before they occur.** It continuously analyzes real-time operational data from each Auralis device via MQTT/JSON packet communication. By identifying patterns that precede equipment failure, the system issues maintenance alerts allowing teams to fix problems proactively, reducing downtime and maintenance costs."
    },
    {
        question: "Is the Auralis Ecosystem compatible with existing city infrastructure?",
        answer: "**Yes, the Auralis Ecosystem is designed for seamless retrofit integration.** Our smart street light controllers can be installed on existing fixtures with minimal modifications. The ESP-MESH network self-heals automatically when nodes are added or removed, and the platform integrates with other city management systems via standard APIs."
    },
    {
        question: "What network technology does Auralis use?",
        answer: "**Auralis uses a Hybrid Wireless Mesh Network with ESP-MESH (Wi-Fi) for local clusters and 4G LTE for cloud connectivity.** This is NOT LoRaWAN. Our Cluster Head architecture deploys one Auralis Pro (Gateway) per approximately 50 Auralis Core (Worker) nodes, communicating via MQTT protocol with JSON packets. This dramatically reduces infrastructure costs while ensuring reliable, low-latency data transmission."
    },
    {
        question: "Where is Dgen Technologies located and where are products manufactured?",
        answer: "**Dgen Technologies is headquartered in Kolkata, India, and all products are proudly Made in India.** We design and manufacture our Auralis Ecosystem hardware locally, supporting the Smart Cities Mission and contributing to India's self-reliance in IoT technology. Our products are engineered for Indian climate and power conditions."
    }
];

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer.replace(/\*\*/g, '')
        }
    }))
};

export const metadata: Metadata = {
  title: 'FAQ | Dgen Technologies',
  description: 'Frequently Asked Questions about Dgen Technologies and the Auralis Ecosystem. Learn about our Hybrid Wireless Mesh Network technology, ESP-MESH + 4G LTE connectivity, and Made in India smart city solutions.',
  keywords: ['Dgen Technologies FAQ', 'Auralis Ecosystem FAQ', 'smart city questions', 'ESP-MESH technology', 'Hybrid Wireless Mesh Network', 'Made in India IoT'],
};


export default function FaqPage() {
    return (
        <div className="flex flex-col">
            {/* FAQ Schema for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            
            {/* Hero Section */}
            <section className="w-full py-20 md:py-32 bg-card">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Help Center</Badge>
                        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
                            Frequently Asked Questions
                        </h1>
                        <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                            Find answers to common questions about Dgen Technologies, the Auralis Ecosystem, and our smart city solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-screen-lg px-4 md:px-6">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-headline text-left">{item.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-foreground/80">
                                    <div dangerouslySetInnerHTML={{ 
                                        __html: item.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                    }} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
