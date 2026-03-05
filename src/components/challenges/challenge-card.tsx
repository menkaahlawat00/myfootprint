'use client';

import { m } from 'motion/react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';

export interface ChallengeData {
  id: string;
  category: string;
  title: string;
  description: string;
  impactTons: string;
  status: string;
  startedAt: string;
  completedAt?: string | null;
}

interface ChallengeCardProps {
  challenge: ChallengeData;
  index?: number;
}

const categoryIcons: Record<string, string> = {
  food: '\uD83C\uDF3D',
  transport: '\uD83D\uDE8C',
  home: '\uD83C\uDFE0',
  shopping: '\uD83D\uDECD\uFE0F',
  services: '\uD83D\uDCBB',
};

const categoryColorMap: Record<string, string> = {
  food: 'var(--color-cat-food)',
  transport: 'var(--color-cat-transit)',
  home: 'var(--color-cat-home)',
  shopping: 'var(--color-cat-shopping)',
  services: 'var(--color-cat-work)',
};

function getDaysRemaining(startedAt: string, durationDays: number = 30): number {
  const start = new Date(startedAt);
  const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getProgressPercent(startedAt: string, durationDays: number = 30): number {
  const start = new Date(startedAt);
  const now = new Date();
  const elapsed = now.getTime() - start.getTime();
  const totalDuration = durationDays * 24 * 60 * 60 * 1000;
  return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
}

function ChallengeCard({ challenge, index = 0 }: ChallengeCardProps) {
  const icon = categoryIcons[challenge.category] ?? '\uD83C\uDF31';
  const catColor = categoryColorMap[challenge.category] ?? 'var(--color-primary)';
  const isCompleted = challenge.status === 'completed';
  const daysRemaining = getDaysRemaining(challenge.startedAt);
  const progress = isCompleted ? 100 : getProgressPercent(challenge.startedAt);
  const impactTons = parseFloat(challenge.impactTons);

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <Card hoverable className="relative overflow-hidden p-5">
        {/* Category accent stripe */}
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
          style={{ backgroundColor: catColor }}
        />

        <div className="flex items-start gap-4 pl-2">
          {/* Category icon */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl"
            style={{ backgroundColor: `color-mix(in srgb, ${catColor} 15%, transparent)` }}
            aria-hidden="true"
          >
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[var(--color-primary)]">
                {challenge.title}
              </h3>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-glow)] px-2 py-0.5 text-xs font-semibold text-[var(--color-accent)]">
                  Done
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
              {challenge.description}
            </p>

            {/* Progress section */}
            <div className="mt-3">
              {!isCompleted ? (
                <>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{progress}% complete</span>
                    <span>{daysRemaining} days left</span>
                  </div>
                  <ProgressBar value={progress} color={catColor} />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-glow)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
                    <span className="text-[var(--color-accent)]" aria-hidden="true">
                      &#x25CF;
                    </span>
                    {impactTons.toFixed(1)} tons CO&#x2082; saved
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            {!isCompleted && (
              <div className="mt-3">
                <Link href="/check-in">
                  <Button size="sm" variant="primary">
                    Check In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Card>
    </m.div>
  );
}

export { ChallengeCard, type ChallengeCardProps };
