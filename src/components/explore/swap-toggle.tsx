'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';

interface SwapToggleProps {
  title: string;
  description: string;
  impactTons: number;
}

function SwapToggle({ title, description, impactTons }: SwapToggleProps) {
  const [enabled, setEnabled] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-display text-sm font-semibold text-[var(--color-primary)]">
            {title}
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            {description}
          </p>
          {enabled && (
            <p className="mt-2 font-mono text-sm font-medium text-[var(--color-accent)]">
              -{impactTons.toFixed(1)} tons/year
            </p>
          )}
        </div>
        <Toggle
          checked={enabled}
          onChange={setEnabled}
          label={`Toggle ${title}`}
        />
      </div>
    </Card>
  );
}

export { SwapToggle, type SwapToggleProps };
