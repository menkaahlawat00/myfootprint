/**
 * Percentile ranking calculation against national and regional benchmarks.
 *
 * Uses EPA/Census-derived distributions to rank a user's total annual
 * emissions against the broader population. Supports both national
 * and regional (zip-code-derived) comparisons.
 */

import benchmarksData from '@/data/emissions/benchmarks.json';

// ---------- Types ----------

export type Region = 'northeast' | 'west' | 'south' | 'midwest';

interface PercentileDistribution {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

const benchmarks = benchmarksData as Record<string, PercentileDistribution>;

// ---------- Zip prefix to region mapping ----------

/**
 * Maps 3-digit zip prefixes to US census regions.
 *
 * Northeast: New England + Mid-Atlantic (CT, ME, MA, NH, NJ, NY, PA, RI, VT)
 * South: South Atlantic + East/West South Central (AL, AR, DE, FL, GA, KY, LA, MD, MS, NC, OK, SC, TN, TX, VA, WV, DC)
 * Midwest: East/West North Central (IL, IN, IA, KS, MI, MN, MO, NE, ND, OH, SD, WI)
 * West: Mountain + Pacific (AK, AZ, CA, CO, HI, ID, MT, NV, NM, OR, UT, WA, WY)
 */
function getRegionFromPrefix(prefix: string): Region {
  const num = parseInt(prefix, 10);

  // Northeast: 010-069 (New England), 100-196 (NY/NJ/PA mid-Atlantic)
  if ((num >= 10 && num <= 69) || (num >= 100 && num <= 196)) {
    return 'northeast';
  }

  // South: 200-297 (DC/MD/VA/WV/NC/SC), 300-399 (GA/FL/AL/TN/MS), 700-799 (LA/AR/OK/TX)
  if (
    (num >= 200 && num <= 297) ||
    (num >= 300 && num <= 399) ||
    (num >= 700 && num <= 799)
  ) {
    return 'south';
  }

  // Midwest: 400-499 (KY/OH/IN/MI), 500-599 (IA/MN/WI/SD/ND/MT/NE), 600-693 (IL/MO/KS)
  if (
    (num >= 400 && num <= 499) ||
    (num >= 500 && num <= 599) ||
    (num >= 600 && num <= 693)
  ) {
    return 'midwest';
  }

  // West: 800-999 (CO/WY/UT/ID/NV/AZ/NM/CA/OR/WA/AK/HI)
  if (num >= 800 && num <= 999) {
    return 'west';
  }

  // Fallback: use national benchmarks (no specific region)
  return 'south';
}

// ---------- Public API ----------

/**
 * Determine the US census region from a zip code.
 *
 * @param zipCode - A US zip code (5-digit string)
 * @returns The region name
 */
export function getRegionFromZip(zipCode: string): Region {
  const prefix = zipCode.substring(0, 3);
  return getRegionFromPrefix(prefix);
}

/**
 * Calculate a percentile rank (0-100) for a given annual emissions total.
 *
 * Uses linear interpolation between the known percentile thresholds (p10, p25, p50, p75, p90)
 * to estimate where the user falls in the distribution.
 *
 * A lower percentile means lower emissions (better). A percentile of 50 means
 * the user produces as much CO2 as the median person in their region.
 *
 * @param totalTons - Total annual emissions in tons CO2e
 * @param zipCode   - Optional zip code for regional comparison; uses national if omitted
 * @returns Percentile rank from 0 to 100
 */
export function calculatePercentile(totalTons: number, zipCode?: string): number {
  // Determine which distribution to use
  let distribution: PercentileDistribution;
  if (zipCode) {
    const region = getRegionFromZip(zipCode);
    distribution = benchmarks[region] ?? benchmarks['national'];
  } else {
    distribution = benchmarks['national'];
  }

  const { p10, p25, p50, p75, p90 } = distribution;

  // Build the interpolation points: [percentile, tons]
  const points: [number, number][] = [
    [0, 0],
    [10, p10],
    [25, p25],
    [50, p50],
    [75, p75],
    [90, p90],
    [100, p90 * 1.4], // extrapolate the top end
  ];

  // If below the lowest threshold
  if (totalTons <= 0) return 0;

  // Linear interpolation between the two surrounding points
  for (let i = 1; i < points.length; i++) {
    const [prevPercentile, prevTons] = points[i - 1];
    const [currPercentile, currTons] = points[i];

    if (totalTons <= currTons) {
      const fraction = (totalTons - prevTons) / (currTons - prevTons);
      const percentile = prevPercentile + fraction * (currPercentile - prevPercentile);
      return Math.round(Math.min(100, Math.max(0, percentile)));
    }
  }

  // Above the highest extrapolated threshold
  return 100;
}
