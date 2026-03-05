/**
 * GET /api/articles
 *
 * Public endpoint that returns article metadata (no content body).
 * Supports optional ?category= query param to filter by category.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles, getArticlesByCategory } from '@/lib/articles';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const articles = category
      ? await getArticlesByCategory(category)
      : await getAllArticles();

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error('[GET /api/articles] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
