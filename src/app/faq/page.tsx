
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from 'next';

const faqs = [
    {
        question: "How do you spell your company name? Is it D-Gen, Degin, or Deegen?",
        answer: "You've come to the right place! Our official name is DGEN Technologies. While we are sometimes referred to by common misspellings like D-Gen Technologies, Degin Tech, or even Deegen, we are India's pioneering smart city and IoT solutions provider. We are committed to powering India's future, one smart device at a time."
    },
    {
        question: "What is the meaning of a Smart City?",
        answer: "A smart city uses IoT (Internet of Things) technology to collect data. This data provides insights that are used to manage assets, resources, and services efficiently. The primary goal is to improve the quality of life for citizens by enhancing urban services like transportation, energy, and public safety."
    },
    {
        question: "Which are some of India's smart cities?",
        answer: "Under the Smart Cities Mission India, cities like Bhubaneswar, Pune, Ahmedabad, Chennai, and Indore have made significant progress in implementing smart solutions, setting a benchmark for other cities."
    },
    {
        question: "What is the Smart Cities Mission launch date and ministry?",
        answer: "The Smart Cities Mission was launched on June 25, 2015, by the Ministry of Housing and Urban Affairs (MoHUA), Government of India. Its objective is to promote sustainable and inclusive cities that provide core infrastructure and give a decent quality of life to its citizens."
    },
    {
        question: "How does Auralis help build a #smartcity?",
        answer: "Auralis is more than just a street light. It's a powerful IoT platform with AI-driven fault detection, energy monitoring, and environmental sensing capabilities. By creating a connected and intelligent lighting grid, Auralis provides city administrators with the data and control needed to improve efficiency, reduce costs, and enhance public safety, which are core goals of any smart city project."
    },
    {
        question: "What is Auralis?",
        answer: "Auralis is DGEN Technologies' brand for our suite of smart city solutions. It starts with our flagship smart street lighting system and is designed to be a scalable platform for a wide range of smart city applications."
    },
    {
        question: "How does Auralis's predictive maintenance work?",
        answer: "Our AI-powered platform analyzes real-time operational data from each Auralis device. By identifying patterns that precede a failure, the system can issue a maintenance alert, allowing teams to fix problems proactively before an outage occurs."
    },
    {
        question: "Is Auralis compatible with existing city infrastructure?",
        answer: "Yes. Auralis is designed for seamless integration. Our smart street lights can replace existing fixtures with minimal retrofitting, and the platform can integrate with other city management systems via standard APIs."
    }
];

export const metadata: Metadata = {
  title: 'FAQ | DGEN Technologies',
  description: 'Frequently Asked Questions about DGEN Technologies. Find answers about smart cities, our products, and common misspellings like D-Gen, Degin Tech, and Deegen.',
  keywords: ['DGEN Technologies FAQ', 'D-Gen Tech', 'Degin Technology', 'Deegen', 'smart city questions', 'Auralis FAQ'],
};


export default function FaqPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="w-full py-20 md:py-32 bg-card">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Help Center</Badge>
                        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
                            Frequently Asked Questions
                        </h1>
                        <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                            Find answers to common questions about our company, products, and the smart city landscape.
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
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
