/**
 * Zustand store for the anonymous onboarding flow.
 *
 * Persists to localStorage under 'mfp-onboarding' so users can
 * return to the questionnaire without losing progress. The store
 * tracks the current step (0-7), user answers for each question,
 * and the calculated footprint result.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FootprintResult } from '@/lib/estimation/engine';

// ---------- Types ----------

export interface OnboardingAnswers {
  zipCode?: string;
  housingType?: 'apartment' | 'small-house' | 'large-house';
  householdSize?: number;
  commuteMode?: 'car-solo' | 'car-pool' | 'public-transit' | 'bike-walk' | 'remote';
  dietStyle?: 'meat-heavy' | 'balanced' | 'vegetarian' | 'vegan';
  shoppingHabit?: 'minimal' | 'moderate' | 'frequent';
}

export interface OnboardingState {
  /** Current step: 0=landing, 1-6=questions, 7=results */
  step: number;
  /** Answers collected from each question step */
  answers: OnboardingAnswers;
  /** Calculated footprint result (populated at step 7) */
  result: FootprintResult | null;
  /** Set the current step */
  setStep: (step: number) => void;
  /** Set a single answer by key */
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  /** Store the calculated result */
  setResult: (result: FootprintResult) => void;
  /** Reset the store to initial state */
  reset: () => void;
}

// ---------- Initial state ----------

const initialState = {
  step: 0,
  answers: {},
  result: null,
};

// ---------- Store ----------

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step: number) => set({ step }),

      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),

      setResult: (result: FootprintResult) => set({ result }),

      reset: () => set(initialState),
    }),
    {
      name: 'mfp-onboarding',
    },
  ),
);
