/**
 * Carbon footprint estimation engine.
 *
 * Main entry point for calculating a user's annual carbon footprint
 * from their lifestyle profile inputs. Combines EPA emissions factors,
 * regional grid intensity data, national benchmarks, and swap
 * recommendations into a single calculation result.
 */

import { getAllCategoryEmissions, getAllCategoryEmissionsAsync, type EmissionProfile, type CategoryBreakdown } from './factors';
import { adjustHomeEmissions, adjustHomeEmissionsAsync } from './grid';
import { calculatePercentile } from './benchmarks';
import { getTopSwap } from './swaps';

// ---------- Types ----------

export interface FootprintInput {
  zipCode?: string;
  dietType: 'meat_heavy' | 'flexitarian' | 'vegetarian' | 'vegan';
  transitMode: 'car' | 'transit' | 'bike' | 'walk' | 'mix';
  homeType: 'apartment' | 'small_house' | 'large_house';
  shoppingFrequency: 'frequent' | 'moderate' | 'minimal';
  flightsPerYear: 'none' | 'one_to_two' | 'three_plus';
  customOverrides?: Record<string, number>;
}

export interface FootprintResult {
  totalTons: number;
  earthEquivalents: number;
  percentileRank: number;
  breakdown: {
    food: number;
    transit: number;
    home: number;
    shopping: number;
    travel: number;
  };
  topSwap: {
    category: string;
    title: string;
    description: string;
    impactTons: number;
  };
  dataSource?: 'static' | 'climatiq' | 'mixed';
}

// ---------- Constants ----------

/**
 * Global sustainable average per person (tons CO2e/year).
 * Based on the IPCC target of keeping warming below 1.5 degrees C.
 * Global carbon budget divided by world population.
 */
const GLOBAL_SUSTAINABLE_AVG = 1.73;

// ---------- Public API ----------

/**
 * Calculate a complete carbon footprint from user inputs.
 *
 * Steps:
 * 1. Look up base emissions for each category from EPA factors
 * 2. Adjust home emissions if a zip code is provided (regional grid intensity)
 * 3. Apply any custom overrides (manual refinements by the user)
 * 4. Sum all categories to get total annual tons
 * 5. Calculate Earth equivalents (how many Earths needed at this consumption level)
 * 6. Calculate percentile rank against national/regional benchmarks
 * 7. Find the best single swap recommendation
 *
 * @param input - User's lifestyle profile and optional zip code
 * @returns Complete footprint result with score, breakdown, ranking, and recommendation
 */
export function calculateFootprint(input: FootprintInput): FootprintResult {
  // Build the profile for factor lookup
  const profile: EmissionProfile = {
    dietType: input.dietType,
    transitMode: input.transitMode,
    homeType: input.homeType,
    shoppingFrequency: input.shoppingFrequency,
    flightsPerYear: input.flightsPerYear,
  };

  // Step 1: Get base emissions per category
  const baseBreakdown = getAllCategoryEmissions(profile);

  // Step 2: Adjust home emissions by regional grid intensity
  const breakdown: CategoryBreakdown = { ...baseBreakdown };
  if (input.zipCode) {
    breakdown.home = adjustHomeEmissions(baseBreakdown.home, input.zipCode);
  }

  // Step 3: Apply custom overrides
  if (input.customOverrides) {
    for (const [key, value] of Object.entries(input.customOverrides)) {
      if (key in breakdown) {
        breakdown[key as keyof CategoryBreakdown] = value;
      }
    }
  }

  // Round individual category values to 1 decimal place
  const roundedBreakdown = {
    food: Math.round(breakdown.food * 10) / 10,
    transit: Math.round(breakdown.transit * 10) / 10,
    home: Math.round(breakdown.home * 10) / 10,
    shopping: Math.round(breakdown.shopping * 10) / 10,
    travel: Math.round(breakdown.travel * 10) / 10,
  };

  // Step 4: Sum for total
  const totalTons =
    Math.round(
      (roundedBreakdown.food +
        roundedBreakdown.transit +
        roundedBreakdown.home +
        roundedBreakdown.shopping +
        roundedBreakdown.travel) *
        10,
    ) / 10;

  // Step 5: Earth equivalents
  const earthEquivalents = Math.round((totalTons / GLOBAL_SUSTAINABLE_AVG) * 10) / 10;

  // Step 6: Percentile rank
  const percentileRank = calculatePercentile(totalTons, input.zipCode);

  // Step 7: Top swap recommendation
  const topSwapResult = getTopSwap(profile, roundedBreakdown);
  const topSwap = topSwapResult
    ? {
        category: topSwapResult.category,
        title: topSwapResult.title,
        description: topSwapResult.description,
        impactTons: topSwapResult.impactTons,
      }
    : {
        category: 'food',
        title: 'Reduce food waste',
        description: 'Plan meals and use leftovers to waste less food',
        impactTons: 0.3,
      };

  return {
    totalTons,
    earthEquivalents,
    percentileRank,
    breakdown: roundedBreakdown,
    topSwap,
    dataSource: 'static' as const,
  };
}

/**
 * Async version that uses Climatiq API for live emission factors,
 * falling back to static data per category if API calls fail.
 */
export async function calculateFootprintAsync(input: FootprintInput): Promise<FootprintResult> {
  const profile: EmissionProfile = {
    dietType: input.dietType,
    transitMode: input.transitMode,
    homeType: input.homeType,
    shoppingFrequency: input.shoppingFrequency,
    flightsPerYear: input.flightsPerYear,
  };

  // Step 1: Get emissions from Climatiq (with static fallback per category)
  const { breakdown: baseBreakdown, source: factorsSource } =
    await getAllCategoryEmissionsAsync(profile);

  const breakdown: CategoryBreakdown = { ...baseBreakdown };
  let homeFromClimatiq = false;

  // Step 2: Adjust home emissions via Climatiq electricity data
  if (input.zipCode) {
    const homeResult = await adjustHomeEmissionsAsync(
      baseBreakdown.home,
      input.zipCode,
      input.homeType,
    );
    breakdown.home = homeResult.value;
    homeFromClimatiq = homeResult.fromClimatiq;
  }

  // Step 3: Apply custom overrides
  if (input.customOverrides) {
    for (const [key, value] of Object.entries(input.customOverrides)) {
      if (key in breakdown) {
        breakdown[key as keyof CategoryBreakdown] = value;
      }
    }
  }

  // Round
  const roundedBreakdown = {
    food: Math.round(breakdown.food * 10) / 10,
    transit: Math.round(breakdown.transit * 10) / 10,
    home: Math.round(breakdown.home * 10) / 10,
    shopping: Math.round(breakdown.shopping * 10) / 10,
    travel: Math.round(breakdown.travel * 10) / 10,
  };

  const totalTons =
    Math.round(
      (roundedBreakdown.food +
        roundedBreakdown.transit +
        roundedBreakdown.home +
        roundedBreakdown.shopping +
        roundedBreakdown.travel) *
        10,
    ) / 10;

  const earthEquivalents = Math.round((totalTons / GLOBAL_SUSTAINABLE_AVG) * 10) / 10;
  const percentileRank = calculatePercentile(totalTons, input.zipCode);

  const topSwapResult = getTopSwap(profile, roundedBreakdown);
  const topSwap = topSwapResult
    ? {
        category: topSwapResult.category,
        title: topSwapResult.title,
        description: topSwapResult.description,
        impactTons: topSwapResult.impactTons,
      }
    : {
        category: 'food',
        title: 'Reduce food waste',
        description: 'Plan meals and use leftovers to waste less food',
        impactTons: 0.3,
      };

  // Determine overall data source
  let dataSource: 'static' | 'climatiq' | 'mixed';
  if (factorsSource === 'climatiq' && (!input.zipCode || homeFromClimatiq)) {
    dataSource = 'climatiq';
  } else if (factorsSource === 'static' && !homeFromClimatiq) {
    dataSource = 'static';
  } else {
    dataSource = 'mixed';
  }

  return {
    totalTons,
    earthEquivalents,
    percentileRank,
    breakdown: roundedBreakdown,
    topSwap,
    dataSource,
  };
}
