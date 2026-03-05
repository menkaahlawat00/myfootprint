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

type DietStyle = NonNullable<OnboardingAnswers['dietStyle']>;

interface DietOption {
  value: DietStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const options: DietOption[] = [
  {
    value: 'meat-heavy',
    label: 'Meat Heavy',
    description: 'Meat with most meals',
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
        <path d="M15.5 2.5c2 0 4.5 2.5 4.5 6.5 0 5-4 9.5-8 13-4-3.5-8-8-8-13 0-4 2.5-6.5 4.5-6.5 1.5 0 2.5 1 3.5 2.5 1-1.5 2-2.5 3.5-2.5z" />
      </svg>
    ),
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Mix of meat and plant-based',
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
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <path d="M12 2v10h10" />
      </svg>
    ),
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'No meat, some dairy/eggs',
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
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5 8.5-9 7.5-15-5 .5-9.5 4-10.5 10" />
        <path d="M8.5 14c-1-1.5-1.5-4-.5-7" />
        <path d="M12 20v-5" />
      </svg>
    ),
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: '100% plant-based',
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
        <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
];

function QuestionDiet() {
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const setStep = useOnboardingStore((s) => s.setStep);

  const handleSelect = (value: DietStyle) => {
    setAnswer('dietStyle', value);
    setTimeout(() => setStep(6), 300);
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
          Question 5 of 6
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight text-primary">
          How would you describe your diet?
        </h2>
        <p className="mt-2 text-base text-text-muted">
          Food production accounts for roughly 25% of global greenhouse gas emissions.
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
                answers.dietStyle === option.value
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
              aria-pressed={answers.dietStyle === option.value}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg',
                    answers.dietStyle === option.value
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

export { QuestionDiet };
