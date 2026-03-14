import { BottomNav } from '@/components/layout/bottom-nav';
import { LazyMotionProvider } from '@/components/motion/lazy-motion-provider';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotionProvider>
      <div className="min-h-screen bg-[var(--color-base)] pb-20">
        <main className="mx-auto max-w-[640px] px-6 py-8">
          {children}
        </main>
        <BottomNav />
      </div>
    </LazyMotionProvider>
  );
}
