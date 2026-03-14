'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const daysOfWeek = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
] as const;

const answerLabels: Record<string, string> = {
  'meat-heavy': 'Meat Heavy',
  balanced: 'Balanced',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'car-solo': 'Car (Solo)',
  'car-pool': 'Carpool',
  'public-transit': 'Public Transit',
  'bike-walk': 'Bike / Walk',
  remote: 'Remote',
  apartment: 'Apartment',
  'small-house': 'Small House',
  'large-house': 'Large House',
  minimal: 'Minimal',
  moderate: 'Moderate',
  frequent: 'Frequent',
};

export default function ProfilePage() {
  const [notificationDay, setNotificationDay] = useState<string>('monday');
  const result = useOnboardingStore((s) => s.result);
  const answers = useOnboardingStore((s) => s.answers);
  const reset = useOnboardingStore((s) => s.reset);

  const character = result
    ? result.totalTons <= 8
      ? 'Eco Warrior'
      : result.totalTons <= 14
        ? 'Conscious Consumer'
        : result.totalTons <= 20
          ? 'Carbon Cruiser'
          : 'Heavy Footprint'
    : null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
        Your Profile
      </h1>

      {/* User info */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-glow)] text-xl">
            🌳
          </div>
          <div>
            <p className="font-display text-base font-semibold text-[var(--color-primary)]">
              {character ?? 'My FootPrint User'}
            </p>
            {result && (
              <p className="text-[13px] text-[var(--color-text-muted)]">
                {result.totalTons.toFixed(1)} tons CO&#x2082;/year
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Lifestyle summary */}
      {answers.dietStyle && (
        <Card className="p-5">
          <h2 className="mb-3 font-display text-base font-semibold text-[var(--color-primary)]">
            Your Lifestyle
          </h2>
          <div className="space-y-2 text-sm">
            {answers.dietStyle && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Diet</span>
                <span className="font-medium text-[var(--color-primary)]">{answerLabels[answers.dietStyle]}</span>
              </div>
            )}
            {answers.commuteMode && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Commute</span>
                <span className="font-medium text-[var(--color-primary)]">{answerLabels[answers.commuteMode]}</span>
              </div>
            )}
            {answers.housingType && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Housing</span>
                <span className="font-medium text-[var(--color-primary)]">{answerLabels[answers.housingType]}</span>
              </div>
            )}
            {answers.shoppingHabit && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Shopping</span>
                <span className="font-medium text-[var(--color-primary)]">{answerLabels[answers.shoppingHabit]}</span>
              </div>
            )}
            {answers.zipCode && (
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Zip Code</span>
                <span className="font-medium text-[var(--color-primary)]">{answers.zipCode}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notification day selector */}
      <Card className="p-5">
        <h2 className="mb-1 font-display text-base font-semibold text-[var(--color-primary)]">
          Check-in Reminder
        </h2>
        <p className="mb-4 text-[13px] text-[var(--color-text-muted)]">
          Choose which day you get your weekly check-in reminder.
        </p>
        <div className="flex gap-1.5">
          {daysOfWeek.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => setNotificationDay(day.key)}
              className={cn(
                'flex-1 rounded-md px-1 py-2 text-xs font-medium',
                'transition-all duration-[var(--duration-snap)] ease-[var(--ease-snap)]',
                'active:scale-[0.96] motion-reduce:active:scale-100',
                'cursor-pointer',
                notificationDay === day.key
                  ? 'bg-[var(--color-accent)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/80',
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Retake quiz */}
      <Link href="/onboarding">
        <Button variant="secondary" className="w-full" onClick={() => reset()}>
          Retake Quiz
        </Button>
      </Link>
    </div>
  );
}
