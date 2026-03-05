'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface PublicChallenge {
  id: string;
  name: string;
  description: string;
  category: string;
  tonsSaved: number;
  durationDays: number;
  participants: number;
}

interface PublicChallengeCardProps {
  challenge: PublicChallenge;
  onJoin?: (challengeId: string) => void;
}

const categoryIcons: Record<string, string> = {
  food: '\uD83C\uDF3D',
  transport: '\uD83D\uDE8C',
  home: '\uD83C\uDFE0',
  shopping: '\uD83D\uDECD\uFE0F',
};

const categoryColorMap: Record<string, string> = {
  food: 'var(--color-cat-food)',
  transport: 'var(--color-cat-transit)',
  home: 'var(--color-cat-home)',
  shopping: 'var(--color-cat-shopping)',
};

function formatParticipants(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

function PublicChallengeCard({ challenge, onJoin }: PublicChallengeCardProps) {
  const icon = categoryIcons[challenge.category] ?? '\uD83C\uDF31';
  const catColor = categoryColorMap[challenge.category] ?? 'var(--color-primary)';

  return (
    <Card hoverable className="p-5">
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl"
          style={{ backgroundColor: `color-mix(in srgb, ${catColor} 15%, transparent)` }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          {/* Challenge name */}
          <h3 className="font-display text-base font-semibold text-[var(--color-primary)]">
            {challenge.name}
          </h3>

          {/* Description */}
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
            {challenge.description}
          </p>

          {/* Stats row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {/* Impact badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-glow)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
              <span className="text-[var(--color-accent)]" aria-hidden="true">
                &#x25CF;
              </span>
              Saves {challenge.tonsSaved} tons CO&#x2082;
            </span>

            {/* Duration */}
            <span className="text-xs text-[var(--color-text-muted)]">
              {challenge.durationDays} days
            </span>

            {/* Participants */}
            <span className="text-xs text-[var(--color-text-muted)]">
              {formatParticipants(challenge.participants)} joined
            </span>
          </div>

          {/* Join button */}
          <div className="mt-4">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onJoin?.(challenge.id)}
            >
              Join Challenge
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export { PublicChallengeCard, type PublicChallengeCardProps };
