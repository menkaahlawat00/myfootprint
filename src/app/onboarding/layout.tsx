'use client';

import { useRouter } from 'next/navigation';
import { LazyMotionProvider } from '@/components/motion/lazy-motion-provider';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const step = useOnboardingStore((s) => s.step);
  const setStep = useOnboardingStore((s) => s.setStep);

  // Steps 1-6 are questions, step 7 is results
  const totalQuestions = 6;
  const progressValue = step >= 7 ? 100 : Math.round((step / totalQuestions) * 100);
  const showBackButton = step > 1 && step <= 6;

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <LazyMotionProvider>
      <div className="flex min-h-screen flex-col bg-base">
        {/* Top bar with progress */}
        <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[480px] items-center gap-3 px-6 pt-4 pb-2">
            {/* Back button */}
            {showBackButton ? (
              <button
                onClick={handleBack}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface"
                aria-label="Go back"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            ) : (
              <div className="h-10 w-10 shrink-0" />
            )}

            {/* Progress bar */}
            <div className="flex-1">
              {step >= 1 && step <= 6 && (
                <div className="flex items-center gap-3">
                  <ProgressBar value={progressValue} />
                  <span className="shrink-0 font-mono text-xs text-text-muted">
                    {step}/{totalQuestions}
                  </span>
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-primary"
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-6 py-6">
          {children}
        </main>
      </div>
    </LazyMotionProvider>
  );
}
