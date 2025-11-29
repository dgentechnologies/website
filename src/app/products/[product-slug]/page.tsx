
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products, Product } from '@/lib/products-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';

export function generateStaticParams() {
  return products.map((product) => ({
    'product-slug': product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ 'product-slug': string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams['product-slug']);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">{product.category}</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
              {product.title}
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              {product.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-6 grid md:grid-cols-2 gap-12 items-start">
          {/* Image Carousel */}
          <div className="sticky top-24">
             <Carousel className="w-full">
                <CarouselContent>
                    {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                        <Card className="overflow-hidden">
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.hint}
                                />
                            </div>
                        </Card>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-14" />
                <CarouselNext className="mr-14" />
            </Carousel>
          </div>

          {/* Product Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-4">Overview</h2>
              <p className="text-foreground/80 leading-relaxed">{product.longDescription}</p>
            </div>

            <div>
              <h2 className="text-3xl font-headline font-bold mb-6">Key Features</h2>
              <div className="space-y-6">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <feature.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg">{feature.title}</h3>
                      <p className="text-foreground/70">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
                <h2 className="text-3xl font-headline font-bold mb-4">Specifications</h2>
                <Card>
                    <Table>
                        <TableBody>
                            {product.specifications.map((spec, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium w-1/3">{spec.key}</TableCell>
                                    <TableCell>{spec.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <div>
              <h2 className="text-3xl font-headline font-bold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {product.qna.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-headline text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-foreground/80">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </div>

             <div className="pt-8 space-y-4">
                <Button asChild size="lg" className="w-full">
                    <Link href={`/contact?subject=Inquiry+about+${product.title}`}>Request a Quote</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Products
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ 'product-slug': string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams['product-slug']);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} | DGEN Technologies`,
    description: product.shortDescription,
  };
}
