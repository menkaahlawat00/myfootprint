'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChallengeCard, type ChallengeData } from '@/components/challenges/challenge-card';
import { PublicChallengeCard, type PublicChallenge } from '@/components/challenges/public-challenge-card';

type Tab = 'active' | 'completed';

export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>('active');
  const [activeChallenges, setActiveChallenges] = useState<ChallengeData[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeData[]>([]);
  const [publicChallenges, setPublicChallenges] = useState<PublicChallenge[]>([]);
  const [showBrowse, setShowBrowse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchChallenges = useCallback(async () => {
    try {
      const res = await fetch('/api/challenges');
      if (res.ok) {
        const data = await res.json();
        setActiveChallenges(data.active ?? []);
        setCompletedChallenges(data.completed ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPublicChallenges = useCallback(async () => {
    try {
      const res = await fetch('/api/public-challenges');
      if (res.ok) {
        const data = await res.json();
        setPublicChallenges(data);
      }
    } catch (err) {
      console.error('Failed to fetch public challenges:', err);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleBrowse = () => {
    if (publicChallenges.length === 0) {
      fetchPublicChallenges();
    }
    setShowBrowse(true);
  };

  const handleJoin = async (challengeId: string) => {
    const challenge = publicChallenges.find((c) => c.id === challengeId);
    if (!challenge || joining) return;

    setJoining(true);
    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: challenge.category,
          title: challenge.name,
          description: challenge.description,
          impactTons: challenge.tonsSaved,
        }),
      });

      if (res.ok) {
        setShowBrowse(false);
        await fetchChallenges();
      }
    } catch (err) {
      console.error('Failed to join challenge:', err);
    } finally {
      setJoining(false);
    }
  };

  const currentList = tab === 'active' ? activeChallenges : completedChallenges;

  return (
    <div>
      {/* Header */}
      <m.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
          Challenges
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Track your commitments and make a lasting impact.
        </p>
      </m.div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {(['active', 'completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-[var(--duration-snap)] ease-[var(--ease-snap)] ${
              tab === t
                ? 'bg-[var(--color-accent)] text-[var(--color-primary)] shadow-sm'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]/80'
            }`}
          >
            {t === 'active' ? 'Active' : 'Completed'}
            {t === 'active' && activeChallenges.length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">
                {activeChallenges.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Challenge list */}
      <div className="mt-5 space-y-3">
        {loading ? (
          <>
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </>
        ) : (
          <AnimatePresence mode="wait">
            <m.div
              key={tab}
              initial={{ opacity: 0, x: tab === 'active' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'active' ? 16 : -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {currentList.length > 0 ? (
                currentList.map((challenge, i) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    index={i}
                  />
                ))
              ) : (
                <m.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 text-center">
                    <div
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-glow)] text-3xl"
                      aria-hidden="true"
                    >
                      {tab === 'active' ? '\uD83C\uDF31' : '\uD83C\uDFC6'}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[var(--color-primary)]">
                      {tab === 'active'
                        ? 'No active challenges yet'
                        : 'No completed challenges'}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      {tab === 'active'
                        ? 'Browse community challenges and start making an impact today.'
                        : 'Complete your first challenge to see it here!'}
                    </p>
                    {tab === 'active' && (
                      <div className="mt-4">
                        <Button variant="primary" size="md" onClick={handleBrowse}>
                          Browse Challenges
                        </Button>
                      </div>
                    )}
                  </Card>
                </m.div>
              )}
            </m.div>
          </AnimatePresence>
        )}
      </div>

      {/* Browse button when there are active challenges */}
      {!loading && tab === 'active' && activeChallenges.length > 0 && !showBrowse && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5"
        >
          <Button variant="secondary" size="md" className="w-full" onClick={handleBrowse}>
            Browse Challenges
          </Button>
        </m.div>
      )}

      {/* Browse public challenges modal */}
      <AnimatePresence>
        {showBrowse && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-overlay)]"
            onClick={() => setShowBrowse(false)}
          >
            <m.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] rounded-t-xl bg-[var(--color-base)] p-6 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--color-surface)]" />

              <h2 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                Browse Challenges
              </h2>
              <p className="mt-1 mb-4 text-sm text-[var(--color-text-muted)]">
                Join a community challenge and track your progress.
              </p>

              <div className="max-h-[60vh] space-y-3 overflow-y-auto">
                {publicChallenges.length > 0 ? (
                  publicChallenges.map((challenge) => (
                    <PublicChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onJoin={handleJoin}
                    />
                  ))
                ) : (
                  <div className="space-y-3">
                    <Skeleton variant="card" />
                    <Skeleton variant="card" />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full"
                  onClick={() => setShowBrowse(false)}
                >
                  Close
                </Button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
