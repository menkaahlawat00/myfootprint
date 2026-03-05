import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = await getArticleBySlug(slug);
    return {
      title: `${meta.title} | My FootPrint`,
      description: meta.description,
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: 'article',
        publishedTime: meta.publishedAt,
      },
    };
  } catch {
    return { title: 'Article Not Found | My FootPrint' };
  }
}

const categoryColorMap: Record<string, string> = {
  basics: 'var(--color-primary)',
  home: 'var(--color-cat-home)',
  food: 'var(--color-cat-food)',
  transport: 'var(--color-cat-transit)',
  shopping: 'var(--color-cat-shopping)',
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content } = article;
  const categoryColor = categoryColorMap[meta.category] ?? 'var(--color-primary)';

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        <span aria-hidden="true">&larr;</span>
        Back to articles
      </Link>

      {/* Article header */}
      <header className="space-y-3">
        {/* Category badge + read time */}
        <div className="flex items-center gap-3">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {meta.category}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {meta.readTime} read
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
          {meta.title}
        </h1>

        {/* Description */}
        <p className="text-[15px] leading-relaxed text-[var(--color-text-muted)]">
          {meta.description}
        </p>

        {/* Color accent bar */}
        <div
          className="h-1 w-16 rounded-full"
          style={{ backgroundColor: meta.coverColor }}
        />
      </header>

      {/* MDX content with typography prose styling */}
      <article className="prose prose-stone max-w-none prose-headings:font-display prose-headings:text-[var(--color-primary)] prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-[var(--color-text)] prose-p:leading-relaxed prose-strong:text-[var(--color-primary)] prose-ul:text-[var(--color-text)] prose-li:marker:text-[var(--color-accent)] prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
