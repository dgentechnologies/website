
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Compass, ArrowLeft } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function NotFound() {
  const notFoundImage = PlaceHolderImages.find(img => img.id === 'not-found');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">
      {notFoundImage && (
        <Image
          src={notFoundImage.imageUrl}
          alt="Abstract background representing a lost connection"
          fill
          className="object-cover"
          data-ai-hint={notFoundImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center space-y-8 p-4">
        <Compass className="h-24 w-24 text-primary" />
        <div className="space-y-4">
            <h1 className="text-8xl font-black font-headline text-gradient animate-pulse">404</h1>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Oops! Page Not Found.
            </h2>
            <p className="max-w-md text-foreground/70">
              It seems you've taken a wrong turn. The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>
        </div>
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
