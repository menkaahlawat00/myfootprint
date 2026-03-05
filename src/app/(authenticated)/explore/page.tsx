'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WatercolorBg, type Category } from '@/components/layout/watercolor-bg';

// TODO: Replace with real API data
const mockBreakdown: Record<Category, number> = {
  food: 4.2,
  transit: 3.8,
  home: 3.1,
  shopping: 1.8,
  travel: 1.3,
  work: 0.0,
};

// TODO: Replace with real API data
const mockTotalTons = 14.2;

const categoryLabels: Record<Category, string> = {
  food: 'Food',
  transit: 'Transit',
  home: 'Home',
  shopping: 'Shopping',
  travel: 'Travel',
  work: 'Work',
};

const categoryDescriptions: Record<Category, string> = {
  food: 'Diet, groceries, dining out',
  transit: 'Commuting, car usage, public transport',
  home: 'Energy, heating, housing',
  shopping: 'Clothing, electronics, goods',
  travel: 'Flights, vacations, long trips',
  work: 'Office, remote work, commute',
};

export default function ExplorePage() {
  const categories = Object.entries(mockBreakdown) as [Category, number][];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
          Explore
        </h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          Dive into each category to see your breakdown and discover swaps.
        </p>
      </div>

      {/* Total score summary */}
      <Card className="p-5">
        <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          Total Footprint
        </p>
        <p className="mt-1 font-mono text-[36px] font-medium leading-none text-[var(--color-primary)]">
          {mockTotalTons.toFixed(1)}
        </p>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          tons CO&#x2082;/year
        </p>
      </Card>

      {/* Category cards */}
      <div className="space-y-3">
        {categories.map(([category, tons]) => {
          const percentage =
            mockTotalTons > 0
              ? Math.round((tons / mockTotalTons) * 100)
              : 0;

          return (
            <Link key={category} href={`/explore/${category}`}>
              <Card hoverable className="relative overflow-hidden p-5">
                <WatercolorBg category={category} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="font-display text-base font-semibold text-[var(--color-primary)]">
                      {categoryLabels[category]}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--color-text-muted)]">
                      {categoryDescriptions[category]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl font-medium text-[var(--color-primary)]">
                      {tons.toFixed(1)}
                    </p>
                    <p className="text-[13px] text-[var(--color-text-muted)]">
                      {percentage}%
                    </p>
                  </div>
                </div>
                <ProgressBar value={percentage} className="relative mt-3" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
