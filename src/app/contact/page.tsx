import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from './contact-form';

export default function ContactPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="w-full py-20 md:py-32 bg-card">
                <div className="container max-w-screen-xl px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Get In Touch</Badge>
                        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
                            Contact Us
                        </h1>
                        <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                            Have a project in mind or just want to say hello? We'd love to hear from you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-screen-xl px-4 md:px-6 grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-headline font-bold">Direct Contact</h2>
                        <p className="text-foreground/70">
                            For direct inquiries, you can reach us through the following channels. We typically respond within one business day.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Our Office</h3>
                                    <p className="text-foreground/70">123 Tech Avenue, Silicon Valley, CA 94043</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Phone className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Phone</h3>
                                    <p className="text-foreground/70">(123) 456-7890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Email</h3>
                                    <p className="text-foreground/70">contact@dgen.tech</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Card className="p-8">
                        <ContactForm />
                    </Card>
                </div>
            </section>
        </div>
    );
}
