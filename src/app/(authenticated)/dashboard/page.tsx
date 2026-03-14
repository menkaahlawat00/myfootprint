'use client';

import Link from 'next/link';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { ScoreHero } from '@/components/dashboard/score-hero';
import { CheckInPrompt } from '@/components/dashboard/check-in-prompt';
import { CategoryGrid } from '@/components/dashboard/category-grid';
import { ArticleTeaser } from '@/components/dashboard/article-teaser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const defaultArticle = {
  title: 'Understanding Your Carbon Footprint',
  slug: 'understanding-carbon-footprint',
  category: 'Learn',
};

export default function DashboardPage() {
  const result = useOnboardingStore((s) => s.result);

  if (!result) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
          Dashboard
        </h1>
        <Card className="p-8 text-center">
          <p className="font-display text-xl font-semibold text-[var(--color-primary)]">
            No footprint data yet
          </p>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Complete the onboarding quiz to see your carbon footprint breakdown.
          </p>
          <Link href="/onboarding" className="mt-4 inline-block">
            <Button>Take the Quiz</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const breakdown = {
    ...result.breakdown,
    work: 0.0,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
        Dashboard
      </h1>

      {/* Score hero */}
      <ScoreHero
        totalTons={result.totalTons}
        trendDirection="flat"
      />

      {/* Weekly check-in CTA */}
      <CheckInPrompt />

      {/* Category breakdown */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-[var(--color-primary)]">
          Your Breakdown
        </h2>
        <CategoryGrid
          breakdown={breakdown}
          totalTons={result.totalTons}
        />
      </section>

      {/* Latest article teaser */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-[var(--color-primary)]">
          Latest Article
        </h2>
        <ArticleTeaser
          title={defaultArticle.title}
          slug={defaultArticle.slug}
          category={defaultArticle.category}
        />
      </section>
    </div>
  );
}
