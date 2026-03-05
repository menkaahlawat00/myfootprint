'use client';

import { ScoreHero } from '@/components/dashboard/score-hero';
import { CheckInPrompt } from '@/components/dashboard/check-in-prompt';
import { CategoryGrid } from '@/components/dashboard/category-grid';
import { ArticleTeaser } from '@/components/dashboard/article-teaser';

// TODO: Replace with real API data
const mockScore = {
  totalTons: 14.2,
  earthEquivalents: 1.7,
  percentileRank: 55,
  breakdown: {
    food: 4.2,
    transit: 3.8,
    home: 3.1,
    shopping: 1.8,
    travel: 1.3,
    work: 0.0,
  },
};

// TODO: Replace with real API data
const mockTrend = {
  direction: 'down' as const,
  amount: 0.4,
};

// TODO: Replace with real API data
const mockArticle = {
  title: 'The Hidden Carbon Cost of Fast Fashion',
  slug: 'hidden-carbon-cost-of-fast-fashion',
  category: 'Shopping',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
        Dashboard
      </h1>

      {/* Score hero */}
      <ScoreHero
        totalTons={mockScore.totalTons}
        trendDirection={mockTrend.direction}
        trendAmount={mockTrend.amount}
      />

      {/* Weekly check-in CTA */}
      <CheckInPrompt />

      {/* Category breakdown */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-[var(--color-primary)]">
          Your Breakdown
        </h2>
        <CategoryGrid
          breakdown={mockScore.breakdown}
          totalTons={mockScore.totalTons}
        />
      </section>

      {/* Latest article teaser */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-[var(--color-primary)]">
          Latest Article
        </h2>
        <ArticleTeaser
          title={mockArticle.title}
          slug={mockArticle.slug}
          category={mockArticle.category}
        />
      </section>
    </div>
  );
}
