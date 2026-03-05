'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function CheckInPrompt() {
  return (
    <Card hoverable className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-base font-semibold text-[var(--color-primary)]">
            Time for your weekly check-in!
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Track your progress and update your score.
          </p>
        </div>
        <Link href="/check-in">
          <Button size="sm">Check in</Button>
        </Link>
      </div>
    </Card>
  );
}

export { CheckInPrompt };
