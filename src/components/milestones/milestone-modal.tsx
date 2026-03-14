'use client';

import { m, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

export type MilestoneType =
  | 'first_checkin'
  | 'four_week_streak'
  | 'first_challenge_complete'
  | 'one_ton_saved';

interface MilestoneConfig {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const MILESTONES: Record<MilestoneType, MilestoneConfig> = {
  first_checkin: {
    icon: '\u2705',
    title: 'First Check-In Complete!',
    description:
      'You just completed your very first weekly check-in. The journey to a smaller footprint starts with a single step.',
    color: 'var(--color-accent)',
  },
  four_week_streak: {
    icon: '\uD83D\uDD25',
    title: '4-Week Streak!',
    description:
      'Four weeks of consistent check-ins! You are building real habits that make a difference for the planet.',
    color: 'var(--color-celebrate)',
  },
  first_challenge_complete: {
    icon: '\uD83C\uDFC6',
    title: 'Challenge Completed!',
    description:
      'You finished your first challenge. Every challenge completed is a meaningful step toward sustainability.',
    color: 'var(--color-secondary)',
  },
  one_ton_saved: {
    icon: '\uD83C\uDF0D',
    title: '1 Ton CO\u2082 Saved!',
    description:
      'You have offset an entire ton of carbon dioxide. That is the equivalent of planting 16 trees!',
    color: 'var(--color-accent)',
  },
};

interface MilestoneModalProps {
  /** Which milestone to celebrate */
  type: MilestoneType;
  /** Whether to show the modal */
  open: boolean;
  /** Callback to close */
  onClose: () => void;
  /** Optional share action */
  onShare?: () => void;
}

function MilestoneModal({ type, open, onClose, onShare }: MilestoneModalProps) {
  const config = MILESTONES[type];

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] p-6"
          onClick={onClose}
        >
          <m.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative w-full max-w-[360px] rounded-xl bg-[var(--color-base)] p-8 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-10"
              style={{
                background: `radial-gradient(circle at center, ${config.color} 0%, transparent 70%)`,
              }}
            />

            {/* Celebration particles */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <m.div
                  key={i}
                  initial={{
                    opacity: 1,
                    scale: 0,
                    x: '50%',
                    y: '30%',
                  }}
                  animate={{
                    opacity: 0,
                    scale: 1.5,
                    x: `${50 + Math.cos((i / 16) * Math.PI * 2) * 45}%`,
                    y: `${30 + Math.sin((i / 16) * Math.PI * 2) * 35}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.2 + i * 0.05,
                    ease: 'easeOut',
                  }}
                  className="absolute h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      i % 4 === 0
                        ? 'var(--color-accent)'
                        : i % 4 === 1
                          ? 'var(--color-celebrate)'
                          : i % 4 === 2
                            ? 'var(--color-secondary)'
                            : 'var(--color-primary)',
                  }}
                />
              ))}
            </div>

            {/* Icon */}
            <m.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.15,
              }}
              className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-5xl"
              style={{
                backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
              }}
            >
              {config.icon}
            </m.div>

            {/* Title */}
            <m.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="relative font-display text-xl font-bold text-[var(--color-primary)]"
            >
              {config.title}
            </m.h2>

            {/* Description */}
            <m.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="relative mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]"
            >
              {config.description}
            </m.p>

            {/* Actions */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.3 }}
              className="relative mt-6 flex flex-col gap-2"
            >
              {onShare && (
                <Button variant="primary" size="md" className="w-full" onClick={onShare}>
                  Share Achievement
                </Button>
              )}
              <Button variant="ghost" size="md" className="w-full" onClick={onClose}>
                {onShare ? 'Maybe later' : 'Awesome!'}
              </Button>
            </m.div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export { MilestoneModal, type MilestoneModalProps };
