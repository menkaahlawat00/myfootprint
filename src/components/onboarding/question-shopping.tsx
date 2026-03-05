'use client';

import { m } from 'motion/react';
import { useOnboardingStore, type OnboardingAnswers } from '@/stores/onboarding-store';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

type ShoppingHabit = NonNullable<OnboardingAnswers['shoppingHabit']>;

interface ShoppingOption {
  value: ShoppingHabit;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const options: ShoppingOption[] = [
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Buy only what I need, repair and reuse',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Average shopping habits',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
  {
    value: 'frequent',
    label: 'Frequent',
    description: 'Love shopping, buy new things often',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

function QuestionShopping() {
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const setStep = useOnboardingStore((s) => s.setStep);

  const handleSelect = (value: ShoppingHabit) => {
    setAnswer('shoppingHabit', value);
    setTimeout(() => setStep(7), 300);
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
          Question 6 of 6
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight text-primary">
          How would you describe your shopping habits?
        </h2>
        <p className="mt-2 text-base text-text-muted">
          Manufacturing and shipping goods contributes significantly to carbon emissions.
        </p>
      </div>

      {/* Option cards */}
      <div className="flex flex-col gap-3">
        {options.map((option, index) => (
          <m.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
          >
            <Card
              hoverable
              className={cn(
                'cursor-pointer p-4 transition-all',
                answers.shoppingHabit === option.value
                  ? 'border-2 border-accent bg-accent-glow shadow-glow'
                  : 'border-2 border-transparent hover:border-border',
              )}
              onClick={() => handleSelect(option.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option.value);
                }
              }}
              aria-pressed={answers.shoppingHabit === option.value}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg',
                    answers.shoppingHabit === option.value
                      ? 'bg-accent/20 text-accent'
                      : 'bg-base text-primary',
                  )}
                >
                  {option.icon}
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-primary">
                    {option.label}
                  </p>
                  <p className="text-sm text-text-muted">{option.description}</p>
                </div>
              </div>
            </Card>
          </m.div>
        ))}
      </div>
    </m.div>
  );
}

export { QuestionShopping };
