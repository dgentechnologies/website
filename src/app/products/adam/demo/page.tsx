'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function CounterBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/adam/waitlist-count')
      .then((r) => r.json())
      .then((d) => setCount(typeof d.count === 'number' ? d.count : null))
      .catch((err) => {
        console.error('Failed to fetch waitlist count:', err);
      });
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/40 bg-primary/10 text-primary font-mono text-sm">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      <span>
        <span className="font-bold text-white text-base">{count.toLocaleString()}</span>
        {' '}
        {count === 1 ? 'person has' : 'people have'} claimed early access
      </span>
    </div>
  );
}

export default function AdamDemoPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* Eyebrow */}
        <p className="text-xs font-mono tracking-[0.25em] uppercase text-primary">
          ADAM — Demo Access
        </p>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-bold text-white leading-tight">
          Still Cooking.
          <br />
          <span className="text-primary">Beautifully.</span>
        </h1>

        {/* Subtext */}
        <div className="space-y-4 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
          <p>
            You found the demo page. Impressive.{' '}
            <span className="text-white/40 italic">
              Slightly premature, but impressive.
            </span>
          </p>
          <p>
            ADAM&apos;s full demo experience — voice, face, real-time memory, and that signature attitude —
            is under development. The kind of development that involves actual robotics, not just vibes.
          </p>
          <p className="text-white/40 text-sm">
            We promise it&apos;ll be worth the wait. ADAM certainly thinks so.
          </p>
        </div>

        {/* Counter */}
        <CounterBadge />

        {/* CTA strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/products/adam#waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-primary/40 transition-all duration-300 text-sm group"
          >
            Join Early Access
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products/adam"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium transition-all duration-300 text-sm group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to ADAM
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-white/20 text-xs tracking-widest uppercase pt-4">
          Made in India · Built by DGEN Technologies · Kolkata
        </p>
      </div>
    </main>
  );
}
