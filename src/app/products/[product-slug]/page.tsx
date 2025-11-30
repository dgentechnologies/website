
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { products, Product, SubProduct, EcosystemDetail } from '@/lib/products-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
    TableHeader,
    TableHead
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function generateStaticParams() {
  return products.map((product) => ({
    'product-slug': product.slug,
  }));
}

function Section({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-headline font-bold">{title}</h2>
        {description && <p className="mt-4 text-foreground/80 md:text-lg">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function EcosystemDetailCard({ detail }: { detail: EcosystemDetail }) {
    return (
        <div className="flex items-start gap-4">
            <detail.icon className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-lg">{detail.title}</h4>
                <p className="text-foreground/70">{detail.description}</p>
            </div>
        </div>
    );
}

function ProductDetailView({ product }: { product: Product }) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
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
  );
}

function EcosystemProductView({ product }: { product: Product }) {
  const { ecosystem, subProducts, qna } = product;
  const architectureDiagram = PlaceHolderImages.find(img => img.id === 'auralis-architecture-diagram');
  if (!ecosystem || !subProducts) return null;

  return (
    <div className="space-y-24">
      {/* Ecosystem Intro */}
      <p className="text-foreground/80 leading-relaxed max-w-4xl mx-auto text-center md:text-lg">{product.longDescription}</p>
      
      {/* Architecture */}
      <Section title={ecosystem.architecture.title} description={ecosystem.architecture.description}>
        <div className="space-y-8">
          {architectureDiagram && (
            <Card className="max-w-5xl mx-auto overflow-hidden">
              <Image
                src={architectureDiagram.imageUrl}
                alt={architectureDiagram.description}
                width={1200}
                height={675}
                className="w-full"
              />
            </Card>
          )}
          <Card className="max-w-4xl mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 font-bold text-foreground">Feature</TableHead>
                  <TableHead className="font-bold text-foreground">Auralis Core (Worker)</TableHead>
                  <TableHead className="font-bold text-foreground">Auralis Pro (Gateway)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ecosystem.architecture.comparison.map((spec, index) => {
                    const [coreValue, proValue] = spec.value.split(' vs. ');
                    return (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{spec.key}</TableCell>
                            <TableCell>{coreValue}</TableCell>
                            <TableCell>{proValue}</TableCell>
                        </TableRow>
                    );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </Section>
      
      {/* Shared Hardware */}
      <Section title={ecosystem.sharedHardware.title} description={ecosystem.sharedHardware.description}>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {ecosystem.sharedHardware.details.map((detail) => (
                <EcosystemDetailCard key={detail.title} detail={detail} />
            ))}
        </div>
      </Section>
      
      {/* Gateway Hardware */}
      <Section title={ecosystem.gatewayHardware.title} description={ecosystem.gatewayHardware.description}>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {ecosystem.gatewayHardware.details.map((detail) => (
                <EcosystemDetailCard key={detail.title} detail={detail} />
            ))}
        </div>
      </Section>
      
      {/* Workflow */}
      <Section title={ecosystem.workflow.title} description={ecosystem.workflow.description}>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {ecosystem.workflow.details.map((detail) => (
                <EcosystemDetailCard key={detail.title} detail={detail} />
            ))}
        </div>
      </Section>

      {/* Sub-Product Section */}
      <Section title="Auralis Product Versions" description="Choose the Auralis version that best fits your needs.">
          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
            {subProducts.map((sub, index) => (
              <Card key={index} className="flex flex-col bg-card/50 border-2 border-transparent hover:border-primary/50 hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{sub.title}</CardTitle>
                  <CardDescription>{sub.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-grow">
                  <div>
                    <h4 className="font-semibold mb-4 text-foreground">Key Features:</h4>
                    <ul className="space-y-4">
                      {sub.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <feature.icon className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium">{feature.title}:</span>
                            <span className="text-foreground/80 ml-1">{feature.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </Section>
      
      {/* Call to Action Section */}
      <Section title="Ready to upgrade your infrastructure?">
          <div className="pt-2 space-y-4 max-w-md mx-auto">
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
      </Section>

       {/* FAQ Section */}
       <Section title="Frequently Asked Questions">
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
            {qna.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-headline text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-foreground/80">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </Section>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ 'product-slug': string }> }) {
  const resolvedParams = await params;
  const product = products.find((p) => p.slug === resolvedParams['product-slug']);

  if (!product) {
    notFound();
  }

  const isEcosystemProduct = !!product.ecosystem;

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
        <div className="container max-w-screen-xl px-4 md:px-6">
          {isEcosystemProduct ? <EcosystemProductView product={product} /> : <ProductDetailView product={product} />}
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
