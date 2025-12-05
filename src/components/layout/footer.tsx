import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container max-w-screen-2xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 py-10 md:py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={125} height={250} className="w-24 sm:w-32" />
            </Link>
            <p className="text-sm text-foreground/60">
              Innovate. Integrate. Inspire.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-md font-medium">Company</h3>
            <ul className="mt-4 space-y-1 text-sm">
              <li><Link href="/about" className="text-foreground/60 hover:text-foreground touch-target inline-block">About Us</Link></li>
              <li><Link href="/services" className="text-foreground/60 hover:text-foreground touch-target inline-block">Services</Link></li>
              <li><Link href="/products" className="text-foreground/60 hover:text-foreground touch-target inline-block">Products</Link></li>
              <li><Link href="/blog" className="text-foreground/60 hover:text-foreground touch-target inline-block">Blog</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-foreground touch-target inline-block">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-md font-medium">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="text-foreground/60 hover:text-foreground touch-target inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-foreground/60 hover:text-foreground touch-target inline-block">Terms of Service</Link></li>
              <li><Link href="/faq" className="text-foreground/60 hover:text-foreground touch-target inline-block">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-md font-medium">Connect</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="https://www.linkedin.com/company/dgentechnologies" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/60 hover:text-foreground touch-target"><Linkedin size={16}/> LinkedIn</a></li>
              <li><a href="https://x.com/dgen_tec" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/60 hover:text-foreground touch-target"><Twitter size={16}/> Twitter</a></li>
              <li><a href="https://www.instagram.com/dgen_technologies/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/60 hover:text-foreground touch-target"><Instagram size={16}/> Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="py-6 text-center text-xs sm:text-sm text-foreground/60">
          © {new Date().getFullYear()} DGEN Technologies Pvt. Ltd. All rights reserved. Made in India.
        </div>
      </div>
    </footer>
  );
}
