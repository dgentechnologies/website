'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 max-w-screen-2xl items-center px-4 md:px-6">
        <Link href="/" className="mr-4 sm:mr-6 flex items-center space-x-2">
          <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={120} height={40} className="h-8 sm:h-10 w-auto" />
        </Link>

        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4 ml-4 sm:ml-6">
             <div className="hidden md:flex">
               <Button asChild size="sm">
                  <Link href="/contact">
                      Get a Quote
                  </Link>
              </Button>
             </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] pr-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation links for DGEN Technologies website</SheetDescription>
                <div className="flex items-center justify-between pr-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image src="/images/logo.png" alt="DGEN Technologies Logo" width={100} height={30} className="h-8 w-auto"/>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-10 w-10 p-0" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                  >
                    <X className="h-6 w-6"/>
                  </Button>
                </div>
                <nav className="my-6 h-[calc(100vh-8rem)] pb-10 pl-2" aria-label="Mobile navigation">
                  <div className="flex flex-col space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg py-3 px-4 rounded-md hover:bg-accent transition-colors active:bg-accent/80"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-4 px-4">
                      <Button asChild className="w-full">
                          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                              Get a Quote
                          </Link>
                      </Button>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
