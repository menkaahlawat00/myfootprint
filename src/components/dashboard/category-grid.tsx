'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WatercolorBg, type Category } from '@/components/layout/watercolor-bg';

interface CategoryBreakdown {
  food: number;
  transit: number;
  home: number;
  shopping: number;
  travel: number;
  work: number;
}

interface CategoryGridProps {
  breakdown: CategoryBreakdown;
  totalTons: number;
}

const categoryLabels: Record<Category, string> = {
  food: 'Food',
  transit: 'Transit',
  home: 'Home',
  shopping: 'Shopping',
  travel: 'Travel',
  work: 'Work',
};

const categoryIcons: Record<Category, string> = {
  food: '🍃',
  transit: '🚲',
  home: '🏠',
  shopping: '🛍',
  travel: '✈️',
  work: '💼',
};

function CategoryGrid({ breakdown, totalTons }: CategoryGridProps) {
  const categories = Object.entries(breakdown) as [Category, number][];

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(([category, tons]) => {
        const percentage = totalTons > 0 ? Math.round((tons / totalTons) * 100) : 0;

        return (
          <Link key={category} href={`/explore/${category}`}>
            <Card hoverable className="relative overflow-hidden p-4">
              <WatercolorBg category={category} />
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">
                    {categoryIcons[category]}
                  </span>
                  <span className="font-display text-sm font-semibold text-[var(--color-primary)]">
                    {categoryLabels[category]}
                  </span>
                </div>
                <p className="font-mono text-xl font-medium text-[var(--color-primary)]">
                  {tons.toFixed(1)}
                  <span className="ml-1 text-xs text-[var(--color-text-muted)]">tons</span>
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--color-text-muted)]">
                  {percentage}% of total
                </p>
                <ProgressBar value={percentage} className="mt-2" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export { CategoryGrid, type CategoryGridProps, type CategoryBreakdown };
