'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckInSuccess } from '@/components/check-in/check-in-success';

// --- Quick action definitions per category ---

interface QuickAction {
  id: string;
  label: string;
}

interface CategorySection {
  key: string;
  name: string;
  icon: string;
  color: string;
  actions: QuickAction[];
}

const CATEGORIES: CategorySection[] = [
  {
    key: 'home',
    name: 'Home',
    icon: '\uD83C\uDFE0',
    color: 'var(--color-cat-home)',
    actions: [
      { id: 'home_reduced_ac', label: 'Reduced AC/heating' },
      { id: 'home_unplugged', label: 'Unplugged unused devices' },
      { id: 'home_cold_wash', label: 'Used cold water wash' },
    ],
  },
  {
    key: 'transport',
    name: 'Transport',
    icon: '\uD83D\uDE8C',
    color: 'var(--color-cat-transit)',
    actions: [
      { id: 'transport_transit', label: 'Took public transit' },
      { id: 'transport_bike_walk', label: 'Biked/walked' },
      { id: 'transport_carpool', label: 'Carpooled' },
    ],
  },
  {
    key: 'food',
    name: 'Food',
    icon: '\uD83C\uDF3D',
    color: 'var(--color-cat-food)',
    actions: [
      { id: 'food_meatless', label: 'Had meatless days' },
      { id: 'food_waste', label: 'Reduced food waste' },
      { id: 'food_local', label: 'Bought local' },
    ],
  },
  {
    key: 'shopping',
    name: 'Shopping',
    icon: '\uD83D\uDECD\uFE0F',
    color: 'var(--color-cat-shopping)',
    actions: [
      { id: 'shopping_secondhand', label: 'Bought secondhand' },
      { id: 'shopping_repaired', label: 'Repaired instead of replaced' },
      { id: 'shopping_skipped', label: 'Skipped unnecessary purchase' },
    ],
  },
  {
    key: 'services',
    name: 'Services',
    icon: '\uD83D\uDCBB',
    color: 'var(--color-cat-work)',
    actions: [
      { id: 'services_streaming', label: 'Reduced streaming' },
      { id: 'services_offset', label: 'Offset a purchase' },
      { id: 'services_digital', label: 'Used digital over print' },
    ],
  },
];

// Estimate impact per action (tons CO2 saved per week)
const ACTION_IMPACT: Record<string, number> = {
  home_reduced_ac: 0.012,
  home_unplugged: 0.003,
  home_cold_wash: 0.005,
  transport_transit: 0.025,
  transport_bike_walk: 0.03,
  transport_carpool: 0.015,
  food_meatless: 0.02,
  food_waste: 0.01,
  food_local: 0.008,
  shopping_secondhand: 0.015,
  shopping_repaired: 0.01,
  shopping_skipped: 0.012,
  services_streaming: 0.002,
  services_offset: 0.02,
  services_digital: 0.003,
};

export default function CheckInPage() {
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [existingSummary, setExistingSummary] = useState<Record<string, 'thumbs_up' | 'thumbs_down'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [streakWeeks, setStreakWeeks] = useState(1);

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  // Check if user already checked in this week
  const checkExisting = useCallback(async () => {
    try {
      const res = await fetch('/api/check-ins');
      if (res.ok) {
        const data = await res.json();
        if (data.checkIns && data.checkIns.length > 0) {
          setAlreadyCheckedIn(true);
          setExistingSummary(data.checkIns[0].challengeProgress);
        }
        // Use totalCheckIns as a rough streak estimate
        setStreakWeeks(Math.max(1, data.totalCheckIns ?? 1));
      }
    } catch (err) {
      console.error('Failed to check existing check-ins:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkExisting();
  }, [checkExisting]);

  const handleToggle = (actionId: string) => {
    setToggled((prev) => ({ ...prev, [actionId]: !prev[actionId] }));
  };

  const handleNoteChange = (categoryKey: string, value: string) => {
    setNotes((prev) => ({ ...prev, [categoryKey]: value }));
  };

  const activeActionCount = Object.values(toggled).filter(Boolean).length;

  const impactEstimate = Object.entries(toggled)
    .filter(([, on]) => on)
    .reduce((sum, [id]) => sum + (ACTION_IMPACT[id] ?? 0), 0);

  const handleSubmit = async () => {
    if (submitting || activeActionCount === 0) return;
    setSubmitting(true);

    // Build challengeProgress from toggled actions
    const challengeProgress: Record<string, 'thumbs_up' | 'thumbs_down'> = {};
    for (const [actionId, on] of Object.entries(toggled)) {
      challengeProgress[actionId] = on ? 'thumbs_up' : 'thumbs_down';
    }

    // Build additionalNotes from non-empty notes
    const additionalNotes: Record<string, string> = {};
    for (const [key, value] of Object.entries(notes)) {
      if (value.trim()) {
        additionalNotes[key] = value.trim();
      }
    }

    try {
      const res = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeProgress,
          additionalNotes: Object.keys(additionalNotes).length > 0 ? additionalNotes : undefined,
        }),
      });

      if (res.ok || res.status === 409) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error('Failed to submit check-in:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Already checked in summary view ---
  if (!loading && alreadyCheckedIn && !showSuccess) {
    const checkedActions = existingSummary
      ? Object.entries(existingSummary)
          .filter(([, v]) => v === 'thumbs_up')
          .map(([id]) => {
            for (const cat of CATEGORIES) {
              const action = cat.actions.find((a) => a.id === id);
              if (action) return action.label;
            }
            return id;
          })
      : [];

    return (
      <div>
        <m.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
            Weekly Check-In
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{weekRange}</p>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-6"
        >
          <Card className="p-6 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-3xl"
              aria-hidden="true"
            >
              <svg
                className="h-10 w-10 text-[var(--color-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-primary)]">
              Already checked in this week!
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              You logged {checkedActions.length} green actions this week.
            </p>

            {checkedActions.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {checkedActions.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full bg-[var(--color-accent-glow)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </m.div>
      </div>
    );
  }

  // --- Success view ---
  if (showSuccess) {
    return (
      <div className="relative">
        <CheckInSuccess
          actionCount={activeActionCount}
          streakWeeks={streakWeeks}
          impactEstimate={impactEstimate}
          onDismiss={() => {
            setShowSuccess(false);
            setAlreadyCheckedIn(true);
            setExistingSummary(
              Object.fromEntries(
                Object.entries(toggled).map(([id, on]) => [id, on ? 'thumbs_up' : 'thumbs_down']),
              ) as Record<string, 'thumbs_up' | 'thumbs_down'>,
            );
          }}
        />
      </div>
    );
  }

  // --- Loading state ---
  if (loading) {
    return (
      <div>
        <Skeleton variant="text" className="mb-2 h-8 w-48" />
        <Skeleton variant="text" className="mb-6 h-4 w-32" />
        <div className="space-y-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  // --- Main check-in form ---
  return (
    <div>
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
          Weekly Check-In
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{weekRange}</p>
      </m.div>

      {/* Intro */}
      <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]"
      >
        Toggle the green actions you took this week. Every small step counts!
      </m.p>

      {/* Category sections */}
      <div className="mt-5 space-y-4">
        {CATEGORIES.map((category, catIndex) => (
          <m.div
            key={category.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.1 + catIndex * 0.08,
            }}
          >
            <Card className="overflow-hidden p-4">
              {/* Category header */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${category.color} 15%, transparent)`,
                  }}
                  aria-hidden="true"
                >
                  {category.icon}
                </div>
                <h2
                  className="font-display text-base font-semibold"
                  style={{ color: category.color }}
                >
                  {category.name}
                </h2>
              </div>

              {/* Action toggles */}
              <div className="mt-3 space-y-2">
                {category.actions.map((action) => {
                  const isOn = toggled[action.id] ?? false;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleToggle(action.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-[var(--duration-snap)] ease-[var(--ease-snap)] ${
                        isOn
                          ? 'bg-[var(--color-accent-glow)]'
                          : 'bg-transparent hover:bg-[var(--color-surface)]/60'
                      }`}
                    >
                      {/* Toggle indicator */}
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-[var(--duration-snap)] ${
                          isOn
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                            : 'border-[var(--color-border)]'
                        }`}
                      >
                        {isOn && (
                          <svg
                            className="h-3.5 w-3.5 text-[var(--color-primary)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>

                      <span
                        className={`text-sm ${
                          isOn
                            ? 'font-medium text-[var(--color-primary)]'
                            : 'text-[var(--color-text-muted)]'
                        }`}
                      >
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Optional notes */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder={`Notes about ${category.name.toLowerCase()}...`}
                  value={notes[category.key] ?? ''}
                  onChange={(e) => handleNoteChange(category.key, e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </Card>
          </m.div>
        ))}
      </div>

      {/* Impact preview */}
      <AnimatePresence>
        {activeActionCount > 0 && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 overflow-hidden"
          >
            <Card className="p-4 text-center">
              <p className="text-sm text-[var(--color-text-muted)]">
                Estimated weekly impact
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-[var(--color-accent)]">
                -{impactEstimate.toFixed(3)}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                tons CO&#x2082; from {activeActionCount} action{activeActionCount !== 1 ? 's' : ''}
              </p>
            </Card>
          </m.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="mt-6 pb-4"
      >
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={activeActionCount === 0 || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Submitting...' : 'Submit Check-In'}
        </Button>
        {activeActionCount === 0 && (
          <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
            Toggle at least one action to check in.
          </p>
        )}
      </m.div>
    </div>
  );
}
