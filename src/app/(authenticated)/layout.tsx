import { redirect } from 'next/navigation';
import { BottomNav } from '@/components/layout/bottom-nav';
import { LazyMotionProvider } from '@/components/motion/lazy-motion-provider';

const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('dummy') &&
  !process.env.CLERK_SECRET_KEY.startsWith('dummy');

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (clerkEnabled) {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) {
      redirect('/sign-in');
    }
  }

  return (
    <LazyMotionProvider>
      <div className="min-h-screen bg-[var(--color-base)] pb-20">
        <main className="mx-auto max-w-[480px] px-6 py-8">
          {children}
        </main>
        <BottomNav />
      </div>
    </LazyMotionProvider>
  );
}
