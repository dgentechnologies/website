'use client';

import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Script from 'next/script';

// NLP-friendly FAQ structure with bold direct answers + technical justification
const faqs = [
    {
        question: "How do you spell your company name? Is it D-Gen, Degin, or Deegen?",
        answer: "**Our official name is Dgen Technologies Private Limited.** While we are sometimes referred to by common misspellings like D-Gen Technologies, Degin Tech, or even Deegen, we are a technology company based in Kolkata, India that creates smart, advanced hardware and software solutions to help society. We are committed to powering India's future through innovative technologies including our Auralis Ecosystem smart city solutions."
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
    },
    {
        question: "ADAM kya hai bhai? Dating app hai kya?",
        answer: "**Arre nahin yaar, not a dating app!** But we're not revealing everything just yet. Let's just say it's hardware that sits on your desk... and it's nothing like what you've seen before. Made in Kolkata. Coming soon. Want the full story? Follow us on Instagram and LinkedIn for updates."
    },
    {
        question: "So it's like Alexa but Made in India?",
        answer: "**Nice guess, but no.** Think different. Think hardware. Think AI. Think... well, we can't tell you everything yet. But if you've seen what we did with Auralis (wiring entire cities), you know we don't do ordinary. Stay tuned on our socials for the reveal."
    },
    {
        question: "Can ADAM order biryani for me?",
        answer: "**Maybe. Maybe not. We're not spoiling it.** What we can say: it's built by the team that connected 50 street lights with one gateway and cut costs by 98%. So yeah, we know how to build things that work. For everything else? Wait for launch day. Follow us for updates!"
    },
    {
        question: "Is ADAM going to judge my late-night work habits?",
        answer: "**We'll tell you when we launch.** All we can say right now: it's an AI companion. Built from scratch. Hardware-first approach. Born in Kolkata. What it does exactly? That's the surprise. Join our waitlist and follow us on social media for first-hand updates."
    },
    {
        question: "Will ADAM work with my existing smart home gadgets?",
        answer: "**Here's what we CAN say:** We connected 50 street lights with one gateway. We cut city costs by 98%. We know mesh networks inside out. Can ADAM integrate with your gadgets? We're keeping that under wraps. But we've done harder things. Details dropping soon on Instagram and LinkedIn!"
    },
    {
        question: "When can I actually buy this thing?",
        answer: "**ADAM is coming soon™ (really).** We've spent two years making cities smarter. Now we're bringing that same engineering to your desk. Launch date? Not announced yet. But if you want to be first in line and get exclusive updates, sign up for the waitlist below and follow us on Instagram (@dgentechnologies) and LinkedIn (Dgen Technologies)!"
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


export default function FaqPage() {
    return (
        <div className="flex flex-col">
            {/* FAQ Schema for SEO */}
            <Script
              id="faq-schema"
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            
            {/* Hero Section */}
            <section className="w-full py-16 sm:py-20 md:py-32 bg-card">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
                        <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Help Center</Badge>
                        <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient px-2">
                            Frequently Asked Questions
                        </h1>
                        <p className="mx-auto max-w-[700px] text-foreground/80 text-sm sm:text-base md:text-xl px-4">
                            Find answers to common questions about Dgen Technologies, the Auralis Ecosystem, and our advanced technology solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-12 md:py-16 lg:py-24">
                <div className="container max-w-screen-lg px-4 md:px-6">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-base sm:text-lg font-headline text-left py-4">{item.question}</AccordionTrigger>
                                <AccordionContent className="text-sm sm:text-base text-foreground/80 pb-4">
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
