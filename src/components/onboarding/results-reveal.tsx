'use client';

import { useEffect, useState, useCallback } from 'react';
import { m, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { FootprintResult } from '@/lib/estimation/engine';

// ---------- Mapping helpers ----------

/**
 * Map onboarding answer values to the engine's expected input values.
 * The onboarding uses kebab-case labels while the engine uses snake_case enums.
 */
function mapAnswersToInput(answers: ReturnType<typeof useOnboardingStore.getState>['answers']) {
  const dietMap: Record<string, string> = {
    'meat-heavy': 'meat_heavy',
    balanced: 'flexitarian',
    vegetarian: 'vegetarian',
    vegan: 'vegan',
  };

  const transitMap: Record<string, string> = {
    'car-solo': 'car',
    'car-pool': 'mix',
    'public-transit': 'transit',
    'bike-walk': 'bike',
    remote: 'walk',
  };

  const homeMap: Record<string, string> = {
    apartment: 'apartment',
    'small-house': 'small_house',
    'large-house': 'large_house',
  };

  const shoppingMap: Record<string, string> = {
    minimal: 'minimal',
    moderate: 'moderate',
    frequent: 'frequent',
  };

  return {
    zipCode: answers.zipCode,
    dietType: dietMap[answers.dietStyle ?? 'balanced'] ?? 'flexitarian',
    transitMode: transitMap[answers.commuteMode ?? 'car-solo'] ?? 'car',
    homeType: homeMap[answers.housingType ?? 'small-house'] ?? 'small_house',
    shoppingFrequency: shoppingMap[answers.shoppingHabit ?? 'moderate'] ?? 'moderate',
    flightsPerYear: 'one_to_two', // default since we don't ask about flights
  };
}

// ---------- Character/persona logic ----------

interface FootprintCharacter {
  name: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
}

function getCharacter(totalTons: number): FootprintCharacter {
  if (totalTons <= 8) {
    return {
      name: 'Eco Warrior',
      description: 'You are already living lighter than most Americans. Keep leading the way!',
      gradient: 'from-[#22C55E] to-[#16A34A]',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
    };
  }
  if (totalTons <= 14) {
    return {
      name: 'Conscious Consumer',
      description: 'You are close to the national average. A few swaps could make a big difference.',
      gradient: 'from-[#F59E0B] to-[#D97706]',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    };
  }
  if (totalTons <= 20) {
    return {
      name: 'Carbon Cruiser',
      description: 'Your footprint is above average, but there is plenty of room for impactful changes.',
      gradient: 'from-[#FC5F2B] to-[#EA580C]',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      ),
    };
  }
  return {
    name: 'Heavy Footprint',
    description: 'Your footprint is well above average, but even small steps can lead to meaningful reductions.',
    gradient: 'from-[#EF4444] to-[#DC2626]',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  };
}

// ---------- Category colors ----------

const categoryColors: Record<string, string> = {
  food: 'var(--color-cat-food)',
  transit: 'var(--color-cat-transit)',
  home: 'var(--color-cat-home)',
  shopping: 'var(--color-cat-shopping)',
  travel: 'var(--color-cat-travel)',
};

const categoryLabels: Record<string, string> = {
  food: 'Food',
  transit: 'Transport',
  home: 'Home',
  shopping: 'Shopping',
  travel: 'Services',
};

// ---------- Animated counter ----------

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      setDisplay(current);

      if (progress < 1) {
        start = requestAnimationFrame(animate);
      }
    }

    start = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(start);
  }, [value, duration]);

  return <>{display.toFixed(1)}</>;
}

// ---------- Donut chart ----------

function DonutChart({ breakdown }: { breakdown: FootprintResult['breakdown'] }) {
  const entries = Object.entries(breakdown).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  let cumulative = 0;
  const segments = entries.map(([key, value]) => {
    const percentage = (value / total) * 100;
    const startAngle = (cumulative / 100) * 360;
    cumulative += percentage;
    const endAngle = (cumulative / 100) * 360;

    return { key, value, percentage, startAngle, endAngle };
  });

  // SVG donut using stroke-dasharray
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  let dashOffset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {segments.map((seg) => {
            const dashLength = (seg.percentage / 100) * circumference;
            const offset = dashOffset;
            dashOffset += dashLength;

            return (
              <circle
                key={seg.key}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={categoryColors[seg.key] ?? 'var(--color-text-muted)'}
                strokeWidth="20"
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
                className="transition-all duration-700"
              />
            );
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: categoryColors[seg.key] }}
            />
            <span className="text-sm text-text-muted">
              {categoryLabels[seg.key] ?? seg.key}
            </span>
            <span className="ml-auto font-mono text-sm font-medium text-primary">
              {seg.value.toFixed(1)}t
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Main component ----------

type RevealPhase = 'loading' | 'score' | 'character' | 'breakdown' | 'impact' | 'percentile' | 'cta';

const phaseOrder: RevealPhase[] = ['loading', 'score', 'character', 'breakdown', 'impact', 'percentile', 'cta'];

function ResultsReveal() {
  const answers = useOnboardingStore((s) => s.answers);
  const result = useOnboardingStore((s) => s.result);
  const setResult = useOnboardingStore((s) => s.setResult);
  const [phase, setPhase] = useState<RevealPhase>(result ? 'score' : 'loading');
  const [error, setError] = useState<string | null>(null);

  // Fetch the score from the API
  const fetchScore = useCallback(async () => {
    try {
      const input = mapAnswersToInput(answers);
      const response = await fetch('/api/score/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate score');
      }

      const data: FootprintResult = await response.json();
      setResult(data);

      // Transition to score reveal after a brief loading
      setTimeout(() => setPhase('score'), 1500);
    } catch (err) {
      console.error('Score calculation error:', err);
      setError('Something went wrong. Please try again.');
    }
  }, [answers, setResult]);

  useEffect(() => {
    if (!result && phase === 'loading') {
      fetchScore();
    }
  }, [result, phase, fetchScore]);

  // Auto-advance phases
  const advancePhase = () => {
    const currentIndex = phaseOrder.indexOf(phase);
    if (currentIndex < phaseOrder.length - 1) {
      setPhase(phaseOrder[currentIndex + 1]);
    }
  };

  if (error) {
    return (
      <m.div
        className="flex flex-1 flex-col items-center justify-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="mb-4 text-lg text-negative">{error}</p>
        <Button onClick={() => { setError(null); setPhase('loading'); fetchScore(); }}>
          Try Again
        </Button>
      </m.div>
    );
  }

  // Loading phase
  if (phase === 'loading') {
    return (
      <m.div
        className="flex flex-1 flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated pulse ring */}
        <div className="relative mb-8">
          <m.div
            className="h-24 w-24 rounded-full border-4 border-accent"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <m.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </m.div>
        </div>
        <m.p
          className="font-display text-xl font-semibold text-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Calculating your footprint...
        </m.p>
        <p className="mt-2 text-sm text-text-muted">Analyzing your lifestyle choices</p>
      </m.div>
    );
  }

  if (!result) return null;

  const character = getCharacter(result.totalTons);

  return (
    <m.div
      className="flex flex-1 flex-col gap-6 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {/* Card 1: Total Score */}
        {phaseOrder.indexOf(phase) >= phaseOrder.indexOf('score') && (
          <m.div
            key="score"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="relative overflow-hidden p-8 text-center">
              {/* Gradient glow background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, var(--color-accent) 0%, transparent 60%)`,
                  opacity: 0.04,
                }}
              />
              <p className="relative mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
                Your Annual Carbon Footprint
              </p>
              <p className="relative font-mono text-7xl font-bold leading-none text-primary">
                <AnimatedNumber value={result.totalTons} />
              </p>
              <p className="relative mt-2 text-lg text-text-muted">
                tons CO&#x2082; per year
              </p>
              <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span className="text-sm text-text-muted">
                  That&apos;s <span className="font-semibold text-primary">{result.earthEquivalents}</span> Earths
                </span>
              </div>

              {phase === 'score' && (
                <m.div className="relative mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  <button
                    onClick={advancePhase}
                    className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    See what this means &darr;
                  </button>
                </m.div>
              )}
            </Card>
          </m.div>
        )}

        {/* Card 2: Character */}
        {phaseOrder.indexOf(phase) >= phaseOrder.indexOf('character') && (
          <m.div
            key="character"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className={`relative overflow-hidden p-6`}>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%)`,
                }}
              />
              <div className="relative flex items-center gap-4">
                <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${character.gradient} text-white`}>
                  {character.icon}
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
                    Your Persona
                  </p>
                  <p className="font-display text-2xl font-bold text-primary">
                    {character.name}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">{character.description}</p>
                </div>
              </div>
              {phase === 'character' && (
                <m.div className="relative mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <button
                    onClick={advancePhase}
                    className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    See the breakdown &darr;
                  </button>
                </m.div>
              )}
            </Card>
          </m.div>
        )}

        {/* Card 3: Category Breakdown */}
        {phaseOrder.indexOf(phase) >= phaseOrder.indexOf('breakdown') && (
          <m.div
            key="breakdown"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="p-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-wider text-text-muted">
                Where Your Emissions Come From
              </p>
              <DonutChart breakdown={result.breakdown} />
              {phase === 'breakdown' && (
                <m.div className="mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <button
                    onClick={advancePhase}
                    className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    What can you do? &darr;
                  </button>
                </m.div>
              )}
            </Card>
          </m.div>
        )}

        {/* Card 4: Impact Potential (Top Swap) */}
        {phaseOrder.indexOf(phase) >= phaseOrder.indexOf('impact') && (
          <m.div
            key="impact"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="relative overflow-hidden border-2 border-accent/20 p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 100% 100%, var(--color-accent) 0%, transparent 60%)',
                  opacity: 0.04,
                }}
              />
              <p className="relative mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
                Your Biggest Impact
              </p>
              <p className="relative font-display text-xl font-bold text-primary">
                {result.topSwap.title}
              </p>
              <p className="relative mt-1 text-sm text-text-muted">
                {result.topSwap.description}
              </p>
              <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
                <span className="font-mono text-lg font-bold text-accent">
                  -{result.topSwap.impactTons.toFixed(1)}
                </span>
                <span className="text-sm text-text-muted">tons CO&#x2082;/year</span>
              </div>
              {phase === 'impact' && (
                <m.div className="relative mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <button
                    onClick={advancePhase}
                    className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    How do you compare? &darr;
                  </button>
                </m.div>
              )}
            </Card>
          </m.div>
        )}

        {/* Card 5: Percentile */}
        {phaseOrder.indexOf(phase) >= phaseOrder.indexOf('percentile') && (
          <m.div
            key="percentile"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="p-6 text-center">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
                Compared to Americans
              </p>
              <div className="relative mx-auto my-4 h-4 w-full max-w-[280px] overflow-hidden rounded-full bg-surface">
                <m.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-accent), var(--color-celebrate))',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - result.percentileRank}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
                {/* Position marker */}
                <m.div
                  className="absolute top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full bg-primary"
                  initial={{ left: 0 }}
                  animate={{ left: `${100 - result.percentileRank}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <p className="text-lg text-text-muted">
                You&apos;re doing better than{' '}
                <span className="font-display text-2xl font-bold text-accent">
                  {100 - result.percentileRank}%
                </span>{' '}
                of Americans
              </p>
              {phase === 'percentile' && (
                <m.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <button
                    onClick={advancePhase}
                    className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                  >
                    Ready to take action? &darr;
                  </button>
                </m.div>
              )}
            </Card>
          </m.div>
        )}

        {/* Card 6: CTA */}
        {phaseOrder.indexOf(phase) >= phaseOrder.indexOf('cta') && (
          <m.div
            key="cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="relative overflow-hidden p-8 text-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
                  opacity: 0.06,
                }}
              />
              <p className="relative font-display text-2xl font-bold text-primary">
                Ready to reduce your footprint?
              </p>
              <p className="relative mt-2 text-text-muted">
                Track your progress, take on challenges, and see your impact over time.
              </p>
              <div className="relative mt-6">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full rounded-lg text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </Card>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export { ResultsReveal };
