/**
 * EPA emissions factor data loading and querying.
 *
 * Reads the bundled JSON factors file and provides lookup functions
 * for base annual emissions by category and lifestyle choice.
 */

import factorsData from '@/data/emissions/factors.json';

// ---------- Types ----------

/** Categories tracked by the estimation engine. */
export type EmissionCategory = 'food' | 'transit' | 'home' | 'shopping' | 'travel';

/** Valid choices per category. */
export type DietType = 'meat_heavy' | 'flexitarian' | 'vegetarian' | 'vegan';
export type TransitMode = 'car' | 'transit' | 'bike' | 'walk' | 'mix';
export type HomeType = 'apartment' | 'small_house' | 'large_house';
export type ShoppingFrequency = 'frequent' | 'moderate' | 'minimal';
export type FlightsPerYear = 'none' | 'one_to_two' | 'three_plus';

/** A user's lifestyle profile used for emissions calculation. */
export interface EmissionProfile {
  dietType: DietType;
  transitMode: TransitMode;
  homeType: HomeType;
  shoppingFrequency: ShoppingFrequency;
  flightsPerYear: FlightsPerYear;
}

/** Per-category emissions breakdown in tons CO2e/year. */
export interface CategoryBreakdown {
  food: number;
  transit: number;
  home: number;
  shopping: number;
  travel: number;
}

// ---------- Internal data ----------

const factors = factorsData as Record<string, Record<string, number>>;

// ---------- Public API ----------

/**
 * Get the base annual emissions (tons CO2e/year) for a single category + choice.
 *
 * @param category  - The emission category (food, transit, home, shopping, travel)
 * @param choice    - The user's selection within that category
 * @returns Base emissions in tons CO2e/year, or 0 if not found
 */
export function getBaseEmissions(category: EmissionCategory, choice: string): number {
  const categoryFactors = factors[category];
  if (!categoryFactors) return 0;
  return categoryFactors[choice] ?? 0;
}

/**
 * Get emissions for all categories based on a complete user profile.
 *
 * @param profile - The user's lifestyle profile
 * @returns Per-category breakdown in tons CO2e/year
 */
export function getAllCategoryEmissions(profile: EmissionProfile): CategoryBreakdown {
  return {
    food: getBaseEmissions('food', profile.dietType),
    transit: getBaseEmissions('transit', profile.transitMode),
    home: getBaseEmissions('home', profile.homeType),
    shopping: getBaseEmissions('shopping', profile.shoppingFrequency),
    travel: getBaseEmissions('travel', profile.flightsPerYear),
  };
}
