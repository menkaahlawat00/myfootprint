'use client';

import { Card } from '@/components/ui/card';

interface ScoreHeroProps {
  totalTons: number;
  trendDirection: 'up' | 'down' | 'flat';
  trendAmount?: number;
}

function ScoreHero({ totalTons, trendDirection, trendAmount = 0 }: ScoreHeroProps) {
  return (
    <Card className="relative overflow-hidden p-6">
      {/* Character placeholder */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-[var(--text-subhead,20px)] font-semibold leading-tight text-[var(--color-primary)]">
            YOUR FOOTPRINT
          </p>
        </div>
        {/* Character emoji placeholder */}
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-glow)] text-3xl"
          aria-hidden="true"
        >
          🌳
        </div>
      </div>

      {/* Big score number */}
      <p className="font-mono text-[72px] font-bold leading-none text-[var(--color-primary)]">
        {totalTons.toFixed(1)}
      </p>
      <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-muted)]">
        tons CO&#x2082;/year
      </p>

      {/* Trend arrow */}
      {trendDirection !== 'flat' && trendAmount > 0 && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-glow)] px-3 py-1">
          <span
            className={`font-mono text-sm font-medium ${
              trendDirection === 'down'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-negative)]'
            }`}
          >
            {trendDirection === 'down' ? '▼' : '▲'} {trendAmount.toFixed(1)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            from last week
          </span>
        </div>
      )}
    </Card>
  );
}

export { ScoreHero, type ScoreHeroProps };
