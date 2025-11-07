import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-8 py-14 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={125} height={250} />
              {/* <span className="font-bold font-headline text-lg inline-block">DGEN Technologies</span> */}
            </Link>
            <p className="text-sm text-foreground/60">
              Innovate. Integrate. Inspire.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="font-headline text-md font-medium">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/about" className="text-foreground/60 hover:text-foreground">About Us</Link></li>
                <li><Link href="/services" className="text-foreground/60 hover:text-foreground">Services</Link></li>
                <li><Link href="/products/auralis" className="text-foreground/60 hover:text-foreground">Products</Link></li>
                <li><Link href="/blog" className="text-foreground/60 hover:text-foreground">Blog</Link></li>
                <li><Link href="/contact" className="text-foreground/60 hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-md font-medium">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="text-foreground/60 hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-foreground/60 hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-md font-medium">Connect</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="https://www.linkedin.com/company/dgentechnologies" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/60 hover:text-foreground"><Linkedin size={16}/> LinkedIn</a></li>
                <li><a href="https://x.com/dgen_tec" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/60 hover:text-foreground"><Twitter size={16}/> Twitter</a></li>
                <li><a href="https://github.com/dgentechnologies" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/60 hover:text-foreground"><Github size={16}/> GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="py-6 text-center text-sm text-foreground/60">
          © {new Date().getFullYear()} DGEN Technologies Pvt. Ltd. All rights reserved. Made in India.
        </div>
      </div>
    </footer>
  );
}
