
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from './contact-form';

export default function ContactPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="w-full py-16 sm:py-20 md:py-32 bg-card">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
                        <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Get In Touch</Badge>
                        <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tighter md:text-5xl lg:text-6xl text-gradient px-2">
                            Contact Us
                        </h1>
                        <p className="mx-auto max-w-[700px] text-foreground/80 text-sm sm:text-base md:text-xl px-4">
                            Have a project in mind or just want to say hello? We'd love to hear from you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="w-full py-12 md:py-16 lg:py-24">
                <div className="container max-w-screen-xl px-4 md:px-6 grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <div className="space-y-6 md:space-y-8">
                        <h2 className="text-2xl sm:text-3xl font-headline font-bold">Direct Contact</h2>
                        <p className="text-foreground/70 text-sm sm:text-base">
                            For direct inquiries, you can reach us through the following channels. We typically respond within one business day.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 rounded-full bg-primary/10 flex-shrink-0">
                                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base">Our Office</h3>
                                    <p className="text-foreground/70 text-sm sm:text-base">123 Tech Road, Kolkata, West Bengal 700001, India</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 rounded-full bg-primary/10 flex-shrink-0">
                                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base">Phone</h3>
                                    <p className="text-foreground/70 text-sm sm:text-base">+91 90646 06348</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 rounded-full bg-primary/10 flex-shrink-0">
                                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base">Email</h3>
                                    <p className="text-foreground/70 text-sm sm:text-base">contact@dgentechnologies.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Card className="p-4 sm:p-6 lg:p-8">
                        <ContactForm />
                    </Card>
                </div>
            </section>
        </div>
    );
}
