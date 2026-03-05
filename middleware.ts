import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('dummy') &&
  !process.env.CLERK_SECRET_KEY.startsWith('dummy');

// Dynamic import so Clerk is only loaded when keys are present
const middleware = clerkEnabled
  ? async (request: NextRequest) => {
      const { clerkMiddleware, createRouteMatcher } = await import(
        '@clerk/nextjs/server'
      );
      const isPublicRoute = createRouteMatcher([
        '/',
        '/onboarding(.*)',
        '/sign-in(.*)',
        '/sign-up(.*)',
        '/api/health',
        '/api/score/calculate',
        '/api/articles(.*)',
        '/api/public-challenges',
        '/api/benchmarks(.*)',
        '/api/og',
      ]);
      return clerkMiddleware(async (auth, req) => {
        if (!isPublicRoute(req)) {
          await auth.protect();
        }
      })(request, {} as any);
    }
  : (_request: NextRequest) => NextResponse.next();

export default middleware;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
