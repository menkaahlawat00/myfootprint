'use client';

import Link from 'next/link';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { type Category } from '@/components/layout/watercolor-bg';

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
  const result = useOnboardingStore((s) => s.result);

  if (!result) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
          Explore
        </h1>
        <Card className="p-8 text-center">
          <p className="font-display text-xl font-semibold text-[var(--color-primary)]">
            No data yet
          </p>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Complete the quiz to explore your carbon breakdown by category.
          </p>
          <Link href="/onboarding" className="mt-4 inline-block">
            <Button>Take the Quiz</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const breakdown: Record<Category, number> = {
    ...result.breakdown,
    work: 0.0,
  };
  const totalTons = result.totalTons;
  const categories = Object.entries(breakdown) as [Category, number][];

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
          {totalTons.toFixed(1)}
        </p>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          tons CO&#x2082;/year
        </p>
      </Card>

      {/* Category cards */}
      <div className="space-y-3">
        {categories.map(([category, tons]) => {
          const percentage =
            totalTons > 0
              ? Math.round((tons / totalTons) * 100)
              : 0;

          return (
            <Link key={category} href={`/explore/${category}`}>
              <Card hoverable className="relative overflow-hidden p-5">
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
