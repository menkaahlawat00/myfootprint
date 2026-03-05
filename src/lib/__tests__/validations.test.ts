import { describe, it, expect } from 'vitest';
import {
  footprintInputSchema,
  onboardingCompleteSchema,
  createChallengeSchema,
  checkInSchema,
} from '@/lib/validations';

describe('footprintInputSchema', () => {
  const validInput = {
    dietType: 'flexitarian',
    transitMode: 'car',
    homeType: 'small_house',
    shoppingFrequency: 'moderate',
    flightsPerYear: 'one_to_two',
  };

  it('accepts a valid input with all required fields', () => {
    const result = footprintInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('accepts a valid input with an optional zipCode', () => {
    const result = footprintInputSchema.safeParse({
      ...validInput,
      zipCode: '90210',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid input with optional customOverrides', () => {
    const result = footprintInputSchema.safeParse({
      ...validInput,
      customOverrides: { food: 5.0 },
    });
    expect(result.success).toBe(true);
  });

  it('rejects input with missing required fields', () => {
    const result = footprintInputSchema.safeParse({
      dietType: 'flexitarian',
      // missing transitMode, homeType, shoppingFrequency, flightsPerYear
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid dietType enum value', () => {
    const result = footprintInputSchema.safeParse({
      ...validInput,
      dietType: 'pescatarian',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid transitMode enum value', () => {
    const result = footprintInputSchema.safeParse({
      ...validInput,
      transitMode: 'skateboard',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid homeType enum value', () => {
    const result = footprintInputSchema.safeParse({
      ...validInput,
      homeType: 'mansion',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a zipCode that is not exactly 5 digits', () => {
    const tooShort = footprintInputSchema.safeParse({
      ...validInput,
      zipCode: '9021',
    });
    expect(tooShort.success).toBe(false);

    const tooLong = footprintInputSchema.safeParse({
      ...validInput,
      zipCode: '902100',
    });
    expect(tooLong.success).toBe(false);

    const hasLetters = footprintInputSchema.safeParse({
      ...validInput,
      zipCode: 'abcde',
    });
    expect(hasLetters.success).toBe(false);
  });

  it('accepts all valid enum values for each field', () => {
    const diets = ['meat_heavy', 'flexitarian', 'vegetarian', 'vegan'];
    const transits = ['car', 'transit', 'bike', 'walk', 'mix'];
    const homes = ['apartment', 'small_house', 'large_house'];
    const shops = ['frequent', 'moderate', 'minimal'];
    const flights = ['none', 'one_to_two', 'three_plus'];

    for (const d of diets) {
      const result = footprintInputSchema.safeParse({
        ...validInput,
        dietType: d,
      });
      expect(result.success).toBe(true);
    }

    for (const t of transits) {
      const result = footprintInputSchema.safeParse({
        ...validInput,
        transitMode: t,
      });
      expect(result.success).toBe(true);
    }

    for (const h of homes) {
      const result = footprintInputSchema.safeParse({
        ...validInput,
        homeType: h,
      });
      expect(result.success).toBe(true);
    }

    for (const s of shops) {
      const result = footprintInputSchema.safeParse({
        ...validInput,
        shoppingFrequency: s,
      });
      expect(result.success).toBe(true);
    }

    for (const f of flights) {
      const result = footprintInputSchema.safeParse({
        ...validInput,
        flightsPerYear: f,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe('onboardingCompleteSchema', () => {
  const validOnboarding = {
    profile: {
      dietType: 'flexitarian',
      transitMode: 'car',
      homeType: 'small_house',
      shoppingFrequency: 'moderate',
      flightsPerYear: 'one_to_two',
    },
    score: {
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
    },
    characterType: 'tree',
  };

  it('accepts valid onboarding data', () => {
    const result = onboardingCompleteSchema.safeParse(validOnboarding);
    expect(result.success).toBe(true);
  });

  it('accepts onboarding data with optional fields', () => {
    const result = onboardingCompleteSchema.safeParse({
      ...validOnboarding,
      zipCode: '90210',
      region: 'west',
      firstChallenge: {
        category: 'food',
        title: 'Meatless Monday',
        description: 'Skip meat one day per week',
        impactTons: 0.4,
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects when profile is missing', () => {
    const { profile, ...rest } = validOnboarding;
    const result = onboardingCompleteSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects when score is missing', () => {
    const { score, ...rest } = validOnboarding;
    const result = onboardingCompleteSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid characterType', () => {
    const result = onboardingCompleteSchema.safeParse({
      ...validOnboarding,
      characterType: 'dragon',
    });
    expect(result.success).toBe(false);
  });

  it('rejects percentileRank outside 0-100', () => {
    const result = onboardingCompleteSchema.safeParse({
      ...validOnboarding,
      score: {
        ...validOnboarding.score,
        percentileRank: 150,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('createChallengeSchema', () => {
  it('accepts valid challenge data', () => {
    const result = createChallengeSchema.safeParse({
      category: 'food',
      title: 'Meatless Monday',
      description: 'Skip meat one day per week',
      impactTons: 0.4,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty category string', () => {
    const result = createChallengeSchema.safeParse({
      category: '',
      title: 'Meatless Monday',
      description: 'Skip meat one day per week',
      impactTons: 0.4,
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero or negative impactTons', () => {
    const zero = createChallengeSchema.safeParse({
      category: 'food',
      title: 'Meatless Monday',
      description: 'Skip meat one day per week',
      impactTons: 0,
    });
    expect(zero.success).toBe(false);

    const negative = createChallengeSchema.safeParse({
      category: 'food',
      title: 'Meatless Monday',
      description: 'Skip meat one day per week',
      impactTons: -0.5,
    });
    expect(negative.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = createChallengeSchema.safeParse({
      category: 'food',
    });
    expect(result.success).toBe(false);
  });
});

describe('checkInSchema', () => {
  it('accepts valid check-in data', () => {
    const result = checkInSchema.safeParse({
      challengeProgress: {
        challenge_1: 'thumbs_up',
        challenge_2: 'thumbs_down',
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepts check-in data with optional additionalNotes', () => {
    const result = checkInSchema.safeParse({
      challengeProgress: {
        challenge_1: 'thumbs_up',
      },
      additionalNotes: {
        challenge_1: 'Went really well this week',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid progress values (not thumbs_up or thumbs_down)', () => {
    const result = checkInSchema.safeParse({
      challengeProgress: {
        challenge_1: 'maybe',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing challengeProgress field', () => {
    const result = checkInSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
