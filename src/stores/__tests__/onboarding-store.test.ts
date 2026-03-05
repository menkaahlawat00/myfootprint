import { describe, it, expect, beforeEach } from 'vitest';
import { useOnboardingStore } from '@/stores/onboarding-store';
import type { FootprintResult } from '@/lib/estimation/engine';

describe('useOnboardingStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useOnboardingStore.getState().reset();
  });

  it('has the correct initial state', () => {
    const state = useOnboardingStore.getState();

    expect(state.step).toBe(0);
    expect(state.answers).toEqual({});
    expect(state.result).toBeNull();
  });

  it('setStep updates the current step', () => {
    useOnboardingStore.getState().setStep(3);

    expect(useOnboardingStore.getState().step).toBe(3);
  });

  it('setStep can go to any step', () => {
    useOnboardingStore.getState().setStep(7);
    expect(useOnboardingStore.getState().step).toBe(7);

    useOnboardingStore.getState().setStep(0);
    expect(useOnboardingStore.getState().step).toBe(0);
  });

  it('setAnswer updates a specific answer key', () => {
    useOnboardingStore.getState().setAnswer('zipCode', '90210');

    expect(useOnboardingStore.getState().answers.zipCode).toBe('90210');
  });

  it('setAnswer preserves other answer keys', () => {
    useOnboardingStore.getState().setAnswer('zipCode', '90210');
    useOnboardingStore.getState().setAnswer('housingType', 'apartment');

    const { answers } = useOnboardingStore.getState();
    expect(answers.zipCode).toBe('90210');
    expect(answers.housingType).toBe('apartment');
  });

  it('setAnswer updates all supported answer keys', () => {
    useOnboardingStore.getState().setAnswer('zipCode', '10001');
    useOnboardingStore.getState().setAnswer('housingType', 'large-house');
    useOnboardingStore.getState().setAnswer('householdSize', 4);
    useOnboardingStore.getState().setAnswer('commuteMode', 'bike-walk');
    useOnboardingStore.getState().setAnswer('dietStyle', 'vegan');
    useOnboardingStore.getState().setAnswer('shoppingHabit', 'minimal');

    const { answers } = useOnboardingStore.getState();
    expect(answers.zipCode).toBe('10001');
    expect(answers.housingType).toBe('large-house');
    expect(answers.householdSize).toBe(4);
    expect(answers.commuteMode).toBe('bike-walk');
    expect(answers.dietStyle).toBe('vegan');
    expect(answers.shoppingHabit).toBe('minimal');
  });

  it('setResult stores the footprint result', () => {
    const mockResult: FootprintResult = {
      totalTons: 14.2,
      earthEquivalents: 8.2,
      percentileRank: 50,
      breakdown: {
        food: 2.5,
        transit: 4.6,
        home: 3.8,
        shopping: 1.5,
        travel: 1.8,
      },
      topSwap: {
        category: 'transit',
        title: 'Carpool to work',
        description: 'Share rides with coworkers',
        impactTons: 1.5,
      },
    };

    useOnboardingStore.getState().setResult(mockResult);

    expect(useOnboardingStore.getState().result).toEqual(mockResult);
  });

  it('reset clears all state back to initial values', () => {
    // Mutate the store
    useOnboardingStore.getState().setStep(5);
    useOnboardingStore.getState().setAnswer('zipCode', '90210');
    useOnboardingStore.getState().setResult({
      totalTons: 14.2,
      earthEquivalents: 8.2,
      percentileRank: 50,
      breakdown: { food: 2.5, transit: 4.6, home: 3.8, shopping: 1.5, travel: 1.8 },
      topSwap: {
        category: 'food',
        title: 'Test',
        description: 'Test desc',
        impactTons: 0.5,
      },
    });

    // Verify state was changed
    expect(useOnboardingStore.getState().step).toBe(5);

    // Reset
    useOnboardingStore.getState().reset();

    // Verify back to initial
    const state = useOnboardingStore.getState();
    expect(state.step).toBe(0);
    expect(state.answers).toEqual({});
    expect(state.result).toBeNull();
  });
});
