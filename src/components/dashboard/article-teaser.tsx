import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface ArticleTeaserProps {
  title: string;
  slug: string;
  category: string;
}

function ArticleTeaser({ title, slug, category }: ArticleTeaserProps) {
  return (
    <Link href={`/learn/${slug}`}>
      <Card hoverable className="p-5">
        <p className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
          {category}
        </p>
        <p className="mt-1 font-display text-base font-semibold text-[var(--color-primary)]">
          {title}
        </p>
        <p className="mt-2 font-medium text-[var(--color-accent)]">
          Read &rarr;
        </p>
      </Card>
    </Link>
  );
}

export { ArticleTeaser, type ArticleTeaserProps };
