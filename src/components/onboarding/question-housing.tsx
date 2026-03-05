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

type HousingType = NonNullable<OnboardingAnswers['housingType']>;

interface HousingOption {
  value: HousingType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const options: HousingOption[] = [
  {
    value: 'apartment',
    label: 'Apartment',
    description: 'Condo, flat, or studio',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </svg>
    ),
  },
  {
    value: 'small-house',
    label: 'Small House',
    description: 'Under 1,500 sq ft',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    value: 'large-house',
    label: 'Large House',
    description: 'Over 1,500 sq ft',
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
        <path d="M2 20h20" />
        <path d="M18 8v2" />
      </svg>
    ),
  },
];

function QuestionHousing() {
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const setStep = useOnboardingStore((s) => s.setStep);

  const handleSelect = (value: HousingType) => {
    setAnswer('housingType', value);
    setTimeout(() => setStep(3), 300);
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
          Question 2 of 6
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight text-primary">
          What type of home do you live in?
        </h2>
        <p className="mt-2 text-base text-text-muted">
          Housing size affects energy use for heating, cooling, and electricity.
        </p>
      </div>

      {/* Option cards */}
      <div className="flex flex-col gap-3">
        {options.map((option, index) => (
          <m.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
          >
            <Card
              hoverable
              className={cn(
                'cursor-pointer p-4 transition-all',
                answers.housingType === option.value
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
              aria-pressed={answers.housingType === option.value}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-16 w-16 shrink-0 items-center justify-center rounded-lg',
                    answers.housingType === option.value
                      ? 'bg-accent/20 text-accent'
                      : 'bg-surface text-primary',
                  )}
                >
                  {option.icon}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-primary">{option.label}</p>
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

export { QuestionHousing };
