'use client';

import { m } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CheckInSuccessProps {
  /** Number of actions the user toggled on this week */
  actionCount: number;
  /** Consecutive weeks checked in */
  streakWeeks: number;
  /** Estimated CO2 savings for the week in tons */
  impactEstimate: number;
  /** Callback to dismiss */
  onDismiss?: () => void;
}

function CheckInSuccess({
  actionCount,
  streakWeeks,
  impactEstimate,
  onDismiss,
}: CheckInSuccessProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center text-center"
    >
      {/* Big animated checkmark */}
      <m.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-accent)]"
      >
        <svg
          className="h-14 w-14 text-[var(--color-primary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <m.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </m.div>

      {/* Celebration particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <m.div
            key={i}
            initial={{
              opacity: 1,
              scale: 0,
              x: '50%',
              y: '40%',
            }}
            animate={{
              opacity: 0,
              scale: 1,
              x: `${50 + (Math.cos((i / 12) * Math.PI * 2) * 40)}%`,
              y: `${40 + (Math.sin((i / 12) * Math.PI * 2) * 30)}%`,
            }}
            transition={{
              duration: 0.8,
              delay: 0.3 + i * 0.04,
              ease: 'easeOut',
            }}
            className="absolute h-2 w-2 rounded-full"
            style={{
              backgroundColor: i % 3 === 0
                ? 'var(--color-accent)'
                : i % 3 === 1
                  ? 'var(--color-celebrate)'
                  : 'var(--color-secondary)',
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <m.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="font-display text-2xl font-bold text-[var(--color-primary)]"
      >
        Great job!
      </m.h2>

      <m.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="mt-2 text-sm text-[var(--color-text-muted)]"
      >
        Your weekly check-in has been recorded.
      </m.p>

      {/* Stats cards */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.35 }}
        className="mt-6 grid w-full grid-cols-3 gap-3"
      >
        <Card className="p-3 text-center">
          <p className="font-mono text-xl font-bold text-[var(--color-primary)]">
            {actionCount}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
            Actions
          </p>
        </Card>

        <Card className="p-3 text-center">
          <p className="font-mono text-xl font-bold text-[var(--color-accent)]">
            {streakWeeks}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
            Week streak
          </p>
        </Card>

        <Card className="p-3 text-center">
          <p className="font-mono text-xl font-bold text-[var(--color-primary)]">
            {impactEstimate.toFixed(2)}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
            tons saved
          </p>
        </Card>
      </m.div>

      {/* Actions */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
        className="mt-6 flex w-full flex-col gap-3"
      >
        <Link href="/trends" className="w-full">
          <Button variant="primary" size="md" className="w-full">
            View your trends
          </Button>
        </Link>

        {onDismiss && (
          <Button variant="ghost" size="md" className="w-full" onClick={onDismiss}>
            Back to dashboard
          </Button>
        )}
      </m.div>
    </m.div>
  );
}

export { CheckInSuccess, type CheckInSuccessProps };
