import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Metadata extracted from article MDX frontmatter.
 */
export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  coverColor: string;
}

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

/**
 * Get all articles sorted by publishedAt descending (newest first).
 */
export async function getAllArticles(): Promise<ArticleMeta[]> {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'));

  const articles: ArticleMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(ARTICLES_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);

    return {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      category: data.category ?? '',
      readTime: data.readTime ?? '',
      publishedAt: data.publishedAt ?? '',
      coverColor: data.coverColor ?? '#2D5016',
    };
  });

  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Get a single article by slug, including its raw MDX content body.
 */
export async function getArticleBySlug(
  slug: string,
): Promise<{ meta: ArticleMeta; content: string }> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Article not found: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      category: data.category ?? '',
      readTime: data.readTime ?? '',
      publishedAt: data.publishedAt ?? '',
      coverColor: data.coverColor ?? '#2D5016',
    },
    content,
  };
}

/**
 * Get articles filtered by category, sorted by publishedAt descending.
 */
export async function getArticlesByCategory(
  category: string,
): Promise<ArticleMeta[]> {
  const all = await getAllArticles();
  return all.filter(
    (article) => article.category.toLowerCase() === category.toLowerCase(),
  );
}
