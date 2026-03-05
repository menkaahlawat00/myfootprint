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

type CommuteMode = NonNullable<OnboardingAnswers['commuteMode']>;

interface CommuteOption {
  value: CommuteMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const options: CommuteOption[] = [
  {
    value: 'car-solo',
    label: 'Drive Solo',
    description: 'Single-occupancy car',
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
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10H8s-2.7.6-4.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
        <path d="M5 10l1.5-4.5A2 2 0 0 1 8.4 4h7.2a2 2 0 0 1 1.9 1.5L19 10" />
      </svg>
    ),
  },
  {
    value: 'car-pool',
    label: 'Carpool',
    description: 'Shared rides',
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
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10H8s-2.7.6-4.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
        <path d="M14 7a2 2 0 1 0-4 0" />
        <path d="M10 7h4" />
      </svg>
    ),
  },
  {
    value: 'public-transit',
    label: 'Public Transit',
    description: 'Bus, train, subway',
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
        <rect x="4" y="3" width="16" height="16" rx="2" />
        <path d="M4 11h16" />
        <path d="M12 3v8" />
        <path d="M8 19l-2 3" />
        <path d="M18 22l-2-3" />
        <circle cx="8" cy="15" r="1" />
        <circle cx="16" cy="15" r="1" />
      </svg>
    ),
  },
  {
    value: 'bike-walk',
    label: 'Bike / Walk',
    description: 'Human-powered commute',
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
        <circle cx="18.5" cy="17.5" r="3.5" />
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="15" cy="5" r="1" />
        <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
      </svg>
    ),
  },
  {
    value: 'remote',
    label: 'Work from Home',
    description: 'Fully remote',
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
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

function QuestionCommute() {
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const setStep = useOnboardingStore((s) => s.setStep);

  const handleSelect = (value: CommuteMode) => {
    setAnswer('commuteMode', value);
    setTimeout(() => setStep(5), 300);
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
          Question 4 of 6
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight text-primary">
          How do you get to work?
        </h2>
        <p className="mt-2 text-base text-text-muted">
          Transportation is one of the biggest contributors to personal carbon emissions.
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
                answers.commuteMode === option.value
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
              aria-pressed={answers.commuteMode === option.value}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg',
                    answers.commuteMode === option.value
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

export { QuestionCommute };
