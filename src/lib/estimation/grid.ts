/**
 * Zip code to eGRID subregion mapping and grid intensity adjustments.
 *
 * Uses EPA eGRID data to look up the electricity emissions intensity
 * for a given zip code and adjust home emissions accordingly.
 */

import gridRegions from '@/data/emissions/grid-regions.json';
import gridIntensity from '@/data/emissions/grid-intensity.json';

// ---------- Types ----------

const regions = gridRegions as Record<string, string>;
const intensity = gridIntensity as Record<string, number>;

// ---------- Constants ----------

/**
 * National average grid intensity (lbs CO2 per MWh).
 * Used as the baseline when comparing regional intensity.
 * Based on EPA eGRID national average.
 */
const NATIONAL_AVERAGE_INTENSITY = 857;

// ---------- Public API ----------

/**
 * Look up the eGRID subregion for a given zip code.
 *
 * Uses the first 3 digits of the zip code to find the subregion.
 *
 * @param zipCode - A US zip code (5-digit string)
 * @returns The eGRID subregion code (e.g., "CAMX", "ERCT"), or null if not found
 */
export function getGridRegion(zipCode: string): string | null {
  const prefix = zipCode.substring(0, 3);
  return regions[prefix] ?? null;
}

/**
 * Get the grid emissions intensity for a given zip code.
 *
 * @param zipCode - A US zip code (5-digit string)
 * @returns Emissions intensity in lbs CO2 per MWh, or the national average if not found
 */
export function getGridIntensity(zipCode: string): number {
  const region = getGridRegion(zipCode);
  if (!region) return NATIONAL_AVERAGE_INTENSITY;
  return intensity[region] ?? NATIONAL_AVERAGE_INTENSITY;
}

/**
 * Adjust home emissions based on local grid intensity relative to the national average.
 *
 * If the user's local grid is cleaner than average, their home emissions decrease.
 * If dirtier, emissions increase. The adjustment is proportional:
 *
 *   adjustedEmissions = baseEmissions * (localIntensity / nationalAverage)
 *
 * @param baseEmissions - Base home emissions in tons CO2e/year
 * @param zipCode       - A US zip code (5-digit string)
 * @returns Adjusted home emissions in tons CO2e/year (rounded to 2 decimal places)
 */
export function adjustHomeEmissions(baseEmissions: number, zipCode: string): number {
  const localIntensity = getGridIntensity(zipCode);
  const ratio = localIntensity / NATIONAL_AVERAGE_INTENSITY;
  return Math.round(baseEmissions * ratio * 100) / 100;
}
