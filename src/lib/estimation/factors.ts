/**
 * EPA emissions factor data loading and querying.
 *
 * Reads the bundled JSON factors file and provides lookup functions
 * for base annual emissions by category and lifestyle choice.
 */

import factorsData from '@/data/emissions/factors.json';
import { estimateFood, estimateVehicle, estimateFlight, estimateShopping } from '@/lib/climatiq/client';

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

// ---------- Climatiq activity ID mappings ----------

const FOOD_ACTIVITY: Record<DietType, { activityId: string; annualKg: number }> = {
  meat_heavy: { activityId: 'consumer_goods-type_meat_products_nec', annualKg: 120 },
  flexitarian: { activityId: 'consumer_goods-type_meat_products_nec', annualKg: 60 },
  vegetarian: { activityId: 'consumer_goods-type_fruit_and_vegetables', annualKg: 250 },
  vegan: { activityId: 'consumer_goods-type_fruit_and_vegetables', annualKg: 280 },
};

const TRANSIT_ANNUAL_KM: Record<TransitMode, number> = {
  car: 19300, // US average ~12,000 mi
  mix: 9650,
  transit: 4800,
  bike: 0,
  walk: 0,
};

const FLIGHT_ANNUAL_KM: Record<FlightsPerYear, number> = {
  none: 0,
  one_to_two: 4800, // ~2 domestic round trips
  three_plus: 16000, // ~4 trips incl. 1 long-haul
};

const SHOPPING_ANNUAL_USD: Record<ShoppingFrequency, { activityId: string; spend: number }> = {
  frequent: { activityId: 'consumer_goods-type_clothing_and_footwear', spend: 4000 },
  moderate: { activityId: 'consumer_goods-type_clothing_and_footwear', spend: 2000 },
  minimal: { activityId: 'consumer_goods-type_clothing_and_footwear', spend: 800 },
};

/**
 * Async version of getAllCategoryEmissions that tries Climatiq first,
 * falling back to static factors per category.
 */
export async function getAllCategoryEmissionsAsync(
  profile: EmissionProfile,
): Promise<{ breakdown: CategoryBreakdown; source: 'climatiq' | 'static' | 'mixed' }> {
  const staticBreakdown = getAllCategoryEmissions(profile);
  let climatiqCount = 0;
  let totalAttempts = 0;

  // Food
  const foodConfig = FOOD_ACTIVITY[profile.dietType];
  const foodResult = await estimateFood(foodConfig.activityId, foodConfig.annualKg);
  totalAttempts++;
  const food = foodResult ?? staticBreakdown.food;
  if (foodResult !== null) climatiqCount++;

  // Transit (only for car/mix — bike/walk are ~0)
  let transit = staticBreakdown.transit;
  const transitKm = TRANSIT_ANNUAL_KM[profile.transitMode];
  if (transitKm > 0) {
    const transitResult = await estimateVehicle(transitKm);
    totalAttempts++;
    if (transitResult !== null) {
      transit = transitResult;
      climatiqCount++;
    }
  }

  // Shopping
  const shopConfig = SHOPPING_ANNUAL_USD[profile.shoppingFrequency];
  const shopResult = await estimateShopping(shopConfig.activityId, shopConfig.spend);
  totalAttempts++;
  const shopping = shopResult ?? staticBreakdown.shopping;
  if (shopResult !== null) climatiqCount++;

  // Travel (flights)
  let travel = staticBreakdown.travel;
  const flightKm = FLIGHT_ANNUAL_KM[profile.flightsPerYear];
  if (flightKm > 0) {
    const flightResult = await estimateFlight(flightKm);
    totalAttempts++;
    if (flightResult !== null) {
      travel = flightResult;
      climatiqCount++;
    }
  }

  const source =
    climatiqCount === 0 ? 'static' : climatiqCount === totalAttempts ? 'climatiq' : 'mixed';

  return {
    breakdown: {
      food,
      transit,
      home: staticBreakdown.home, // home adjusted separately via grid.ts
      shopping,
      travel,
    },
    source,
  };
}
