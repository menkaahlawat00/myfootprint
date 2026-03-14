'use client';

import { m } from 'motion/react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { cn } from '@/lib/utils';

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const sizeOptions = [1, 2, 3, 4, 5, 6] as const;

function QuestionHousehold() {
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const setStep = useOnboardingStore((s) => s.setStep);

  const handleSelect = (size: number) => {
    setAnswer('householdSize', size);
    setTimeout(() => setStep(4), 300);
  };

  return (
    <m.div
      className="flex flex-1 flex-col"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Question header */}
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
          Question 3 of 6
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight text-primary">
          How many people live in your household?
        </h2>
        <p className="mt-2 text-base text-text-muted">
          Shared living reduces per-person energy consumption.
        </p>
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-3">
        {sizeOptions.map((size, index) => (
          <m.button
            key={size}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => handleSelect(size)}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg border-2 py-6 transition-all',
              'hover:shadow-md active:scale-[0.96]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              answers.householdSize === size
                ? 'border-accent bg-accent-glow shadow-glow'
                : 'border-transparent bg-surface hover:border-border',
            )}
            aria-pressed={answers.householdSize === size}
          >
            <span
              className={cn(
                'font-display text-3xl font-bold',
                answers.householdSize === size ? 'text-accent' : 'text-primary',
              )}
            >
              {size === 6 ? '6+' : size}
            </span>
            <span className="mt-1 text-xs text-text-muted">
              {size === 1 ? 'Just me' : size === 6 ? 'Six or more' : `${size} people`}
            </span>
          </m.button>
        ))}
      </div>
    </m.div>
  );
}

export { QuestionHousehold };
