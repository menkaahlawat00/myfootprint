/**
 * Zip code to eGRID subregion mapping and grid intensity adjustments.
 *
 * Uses EPA eGRID data to look up the electricity emissions intensity
 * for a given zip code and adjust home emissions accordingly.
 */

import gridRegions from '@/data/emissions/grid-regions.json';
import gridIntensity from '@/data/emissions/grid-intensity.json';
import { estimateElectricity } from '@/lib/climatiq/client';

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

// ---------- Climatiq-enhanced ----------

/** Average annual electricity consumption by home type (kWh). */
const HOME_KWH: Record<string, number> = {
  large_house: 14000,
  small_house: 10500,
  apartment: 6500,
};

/** Map zip code prefix to Climatiq region code (US state). */
const ZIP_TO_STATE: Record<string, string> = {
  '100': 'US-NY', '900': 'US-CA', '941': 'US-CA', '606': 'US-IL',
  '770': 'US-TX', '331': 'US-FL', '981': 'US-WA', '021': 'US-MA',
  '191': 'US-PA', '303': 'US-GA', '481': 'US-MI', '852': 'US-AZ',
};

function zipToClimatiqRegion(zipCode: string): string {
  const prefix3 = zipCode.substring(0, 3);
  return ZIP_TO_STATE[prefix3] ?? 'US';
}

/**
 * Async version that tries Climatiq electricity data first,
 * falling back to static eGRID adjustments.
 *
 * @returns Adjusted home emissions in tons CO2e/year
 */
export async function adjustHomeEmissionsAsync(
  baseEmissions: number,
  zipCode: string,
  homeType: string,
): Promise<{ value: number; fromClimatiq: boolean }> {
  const region = zipToClimatiqRegion(zipCode);
  const annualKwh = HOME_KWH[homeType] ?? HOME_KWH['small_house'];

  const result = await estimateElectricity(region, annualKwh);
  if (result !== null) {
    return { value: Math.round(result * 100) / 100, fromClimatiq: true };
  }

  return { value: adjustHomeEmissions(baseEmissions, zipCode), fromClimatiq: false };
}
