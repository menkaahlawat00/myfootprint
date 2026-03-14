'use client';

import Link from 'next/link';
import { m, AnimatePresence } from 'motion/react';
import { LazyMotionProvider } from '@/components/motion/lazy-motion-provider';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <LazyMotionProvider>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base">

        {/* Hero content */}
        <AnimatePresence>
          <m.main
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Leaf icon */}
            <m.div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-glow"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </m.div>

            {/* Headline */}
            <m.h1
              className="font-display text-5xl font-bold leading-tight tracking-tight text-primary sm:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              What&apos;s Your
              <br />
              <span className="text-accent">FootPrint</span>?
            </m.h1>

            {/* Subheading */}
            <m.p
              className="mt-4 max-w-xs text-lg text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Find out in 60 seconds
            </m.p>

            {/* CTA Button */}
            <m.div
              className="mt-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link href="/onboarding">
                <Button size="lg" className="rounded-full px-10 text-lg font-semibold shadow-glow">
                  Get Started
                </Button>
              </Link>
            </m.div>

            {/* Bottom note */}
            <m.p
              className="mt-6 text-sm text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              No account required
            </m.p>
          </m.main>
        </AnimatePresence>
      </div>
    </LazyMotionProvider>
  );
}
