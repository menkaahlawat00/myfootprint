'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  coverColor: string;
}

const categories = [
  { key: 'all', label: 'All' },
  { key: 'basics', label: 'Basics' },
  { key: 'home', label: 'Home' },
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'shopping', label: 'Shopping' },
];

const categoryColorMap: Record<string, string> = {
  basics: 'var(--color-primary)',
  home: 'var(--color-cat-home)',
  food: 'var(--color-cat-food)',
  transport: 'var(--color-cat-transit)',
  shopping: 'var(--color-cat-shopping)',
};

export default function LearnPage() {
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const url =
          activeCategory === 'all'
            ? '/api/articles'
            : `/api/articles?category=${activeCategory}`;
        const res = await fetch(url);
        if (res.ok) {
          const data: ArticleMeta[] = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
          Learn
        </h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          Understand your impact and discover practical ways to reduce it.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-[var(--duration-snap)] ease-[var(--ease-snap)] ${
              activeCategory === cat.key
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Article cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse p-5">
              <div className="mb-3 h-3 w-20 rounded bg-[var(--color-surface)]" />
              <div className="mb-2 h-5 w-3/4 rounded bg-[var(--color-surface)]" />
              <div className="h-4 w-full rounded bg-[var(--color-surface)]" />
            </Card>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-[var(--color-text-muted)]">
            No articles found in this category yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => {
            const catColor =
              categoryColorMap[article.category] ?? 'var(--color-primary)';

            return (
              <Link key={article.slug} href={`/learn/${article.slug}`}>
                <Card hoverable className="relative overflow-hidden p-5">
                  {/* Cover color accent bar */}
                  <div
                    className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                    style={{ backgroundColor: article.coverColor }}
                  />

                  <div className="pl-3">
                    {/* Category badge + read time */}
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
                        style={{ backgroundColor: catColor }}
                      >
                        {article.category}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        {article.readTime} read
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-base font-semibold text-[var(--color-primary)]">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                      {article.description}
                    </p>

                    {/* Read link */}
                    <p className="mt-2 text-sm font-medium text-[var(--color-accent)]">
                      Read article &rarr;
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
