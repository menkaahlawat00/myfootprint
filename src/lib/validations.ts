/**
 * Zod validation schemas shared between client and server.
 *
 * These schemas validate API request bodies and form inputs.
 * They serve as the single source of truth for input validation
 * across the entire application.
 */

import { z } from 'zod';

// ---------- Enum schemas ----------

export const dietTypeSchema = z.enum(['meat_heavy', 'flexitarian', 'vegetarian', 'vegan']);

export const transitModeSchema = z.enum(['car', 'transit', 'bike', 'walk', 'mix']);

export const homeTypeSchema = z.enum(['apartment', 'small_house', 'large_house']);

export const shoppingFrequencySchema = z.enum(['frequent', 'moderate', 'minimal']);

export const flightsPerYearSchema = z.enum(['none', 'one_to_two', 'three_plus']);

// ---------- Onboarding / score calculation ----------

/**
 * Schema for the POST /api/score/calculate request body.
 * Also used for the onboarding questionnaire input.
 */
export const footprintInputSchema = z.object({
  zipCode: z
    .string()
    .regex(/^\d{5}$/, 'Zip code must be exactly 5 digits')
    .optional(),
  dietType: dietTypeSchema,
  transitMode: transitModeSchema,
  homeType: homeTypeSchema,
  shoppingFrequency: shoppingFrequencySchema,
  flightsPerYear: flightsPerYearSchema,
  customOverrides: z.record(z.string(), z.number()).optional(),
});

export type FootprintInputSchema = z.infer<typeof footprintInputSchema>;

// ---------- Onboarding completion ----------

/**
 * Schema for POST /api/onboarding/complete request body.
 * Sent after the user signs up, containing the Zustand store contents.
 */
export const onboardingCompleteSchema = z.object({
  zipCode: z.string().optional(),
  region: z.string().optional(),
  profile: z.object({
    dietType: dietTypeSchema,
    transitMode: transitModeSchema,
    homeType: homeTypeSchema,
    shoppingFrequency: shoppingFrequencySchema,
    flightsPerYear: flightsPerYearSchema,
  }),
  score: z.object({
    totalTons: z.number(),
    earthEquivalents: z.number(),
    percentileRank: z.number().int().min(0).max(100),
    breakdown: z.object({
      food: z.number(),
      transit: z.number(),
      home: z.number(),
      shopping: z.number(),
      travel: z.number(),
    }),
  }),
  characterType: z.enum(['tree', 'creature', 'planet']),
  firstChallenge: z
    .object({
      category: z.string(),
      title: z.string(),
      description: z.string(),
      impactTons: z.number(),
    })
    .optional(),
});

export type OnboardingCompleteSchema = z.infer<typeof onboardingCompleteSchema>;

// ---------- Profile update ----------

/**
 * Schema for PUT /api/profile request body (partial update).
 */
export const profileUpdateSchema = z.object({
  dietType: dietTypeSchema.optional(),
  transitMode: transitModeSchema.optional(),
  homeType: homeTypeSchema.optional(),
  shoppingFrequency: shoppingFrequencySchema.optional(),
  flightsPerYear: flightsPerYearSchema.optional(),
  customOverrides: z.record(z.string(), z.number()).optional(),
});

export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;

// ---------- Challenge ----------

/**
 * Schema for POST /api/challenges request body.
 */
export const createChallengeSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  impactTons: z.number().positive(),
});

export type CreateChallengeSchema = z.infer<typeof createChallengeSchema>;

// ---------- Check-in ----------

/**
 * Schema for POST /api/check-ins request body.
 */
export const checkInSchema = z.object({
  challengeProgress: z.record(z.string(), z.enum(['thumbs_up', 'thumbs_down'])),
  additionalNotes: z.record(z.string(), z.string()).optional(),
});

export type CheckInSchema = z.infer<typeof checkInSchema>;
