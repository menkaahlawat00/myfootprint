'use client';

import { useState, useEffect, type ComponentType, type PropsWithChildren } from 'react';
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

export default function ProfilePage() {
  const [notificationDay, setNotificationDay] = useState<string>('monday');
  const [SignOutBtn, setSignOutBtn] = useState<ComponentType<PropsWithChildren> | null>(null);

  useEffect(() => {
    import('@clerk/nextjs')
      .then((mod) => setSignOutBtn(() => mod.SignOutButton))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
        Your Profile
      </h1>

      {/* User info placeholder */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-glow)] text-xl">
            🌳
          </div>
          <div>
            <p className="font-display text-base font-semibold text-[var(--color-primary)]">
              My FootPrint User
            </p>
            <p className="text-[13px] text-[var(--color-text-muted)]">
              Member since 2026
            </p>
          </div>
        </div>
      </Card>

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

      {/* Sign out */}
      {SignOutBtn ? (
        <SignOutBtn>
          <Button variant="secondary" className="w-full">
            Sign out
          </Button>
        </SignOutBtn>
      ) : (
        <Button variant="secondary" className="w-full" disabled>
          Sign out
        </Button>
      )}
    </div>
  );
}
