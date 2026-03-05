import { describe, it, expect } from 'vitest';
import { calculateFootprint, type FootprintInput } from '@/lib/estimation/engine';

/**
 * Helper: builds a complete valid FootprintInput for reuse across tests.
 */
function makeInput(overrides: Partial<FootprintInput> = {}): FootprintInput {
  return {
    dietType: 'flexitarian',
    transitMode: 'car',
    homeType: 'small_house',
    shoppingFrequency: 'moderate',
    flightsPerYear: 'one_to_two',
    ...overrides,
  };
}

describe('calculateFootprint', () => {
  // ---- Result shape ----

  it('returns a result with all expected fields', () => {
    const result = calculateFootprint(makeInput());

    expect(result).toHaveProperty('totalTons');
    expect(result).toHaveProperty('earthEquivalents');
    expect(result).toHaveProperty('percentileRank');
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('topSwap');

    // breakdown sub-fields
    expect(result.breakdown).toHaveProperty('food');
    expect(result.breakdown).toHaveProperty('transit');
    expect(result.breakdown).toHaveProperty('home');
    expect(result.breakdown).toHaveProperty('shopping');
    expect(result.breakdown).toHaveProperty('travel');

    // topSwap sub-fields
    expect(result.topSwap).toHaveProperty('category');
    expect(result.topSwap).toHaveProperty('title');
    expect(result.topSwap).toHaveProperty('description');
    expect(result.topSwap).toHaveProperty('impactTons');
  });

  it('returns numeric values for all fields', () => {
    const result = calculateFootprint(makeInput());

    expect(typeof result.totalTons).toBe('number');
    expect(typeof result.earthEquivalents).toBe('number');
    expect(typeof result.percentileRank).toBe('number');
    expect(typeof result.breakdown.food).toBe('number');
    expect(typeof result.breakdown.transit).toBe('number');
    expect(typeof result.breakdown.home).toBe('number');
    expect(typeof result.breakdown.shopping).toBe('number');
    expect(typeof result.breakdown.travel).toBe('number');
  });

  it('totalTons equals the sum of all breakdown categories', () => {
    const result = calculateFootprint(makeInput());
    const sum =
      result.breakdown.food +
      result.breakdown.transit +
      result.breakdown.home +
      result.breakdown.shopping +
      result.breakdown.travel;

    // Both are rounded to 1 decimal place, so compare with tolerance
    expect(result.totalTons).toBeCloseTo(sum, 1);
  });

  // ---- Housing types ----

  it('produces higher emissions for a large house than an apartment', () => {
    const large = calculateFootprint(makeInput({ homeType: 'large_house' }));
    const apt = calculateFootprint(makeInput({ homeType: 'apartment' }));

    expect(large.breakdown.home).toBeGreaterThan(apt.breakdown.home);
    expect(large.totalTons).toBeGreaterThan(apt.totalTons);
  });

  it('produces different emissions for different housing types', () => {
    const apartment = calculateFootprint(makeInput({ homeType: 'apartment' }));
    const smallHouse = calculateFootprint(makeInput({ homeType: 'small_house' }));
    const largeHouse = calculateFootprint(makeInput({ homeType: 'large_house' }));

    expect(apartment.breakdown.home).not.toBe(smallHouse.breakdown.home);
    expect(smallHouse.breakdown.home).not.toBe(largeHouse.breakdown.home);
    expect(apartment.breakdown.home).toBeLessThan(smallHouse.breakdown.home);
    expect(smallHouse.breakdown.home).toBeLessThan(largeHouse.breakdown.home);
  });

  // ---- Diet styles ----

  it('produces lower food emissions for vegan than meat_heavy', () => {
    const vegan = calculateFootprint(makeInput({ dietType: 'vegan' }));
    const meatHeavy = calculateFootprint(makeInput({ dietType: 'meat_heavy' }));

    expect(vegan.breakdown.food).toBeLessThan(meatHeavy.breakdown.food);
  });

  it('orders diet emissions: vegan < vegetarian < flexitarian < meat_heavy', () => {
    const vegan = calculateFootprint(makeInput({ dietType: 'vegan' }));
    const vegetarian = calculateFootprint(makeInput({ dietType: 'vegetarian' }));
    const flexitarian = calculateFootprint(makeInput({ dietType: 'flexitarian' }));
    const meatHeavy = calculateFootprint(makeInput({ dietType: 'meat_heavy' }));

    expect(vegan.breakdown.food).toBeLessThan(vegetarian.breakdown.food);
    expect(vegetarian.breakdown.food).toBeLessThan(flexitarian.breakdown.food);
    expect(flexitarian.breakdown.food).toBeLessThan(meatHeavy.breakdown.food);
  });

  // ---- Commute modes ----

  it('produces lower transit emissions for walk than car', () => {
    const walk = calculateFootprint(makeInput({ transitMode: 'walk' }));
    const car = calculateFootprint(makeInput({ transitMode: 'car' }));

    expect(walk.breakdown.transit).toBeLessThan(car.breakdown.transit);
  });

  it('produces lower transit emissions for bike than car', () => {
    const bike = calculateFootprint(makeInput({ transitMode: 'bike' }));
    const car = calculateFootprint(makeInput({ transitMode: 'car' }));

    expect(bike.breakdown.transit).toBeLessThan(car.breakdown.transit);
  });

  // ---- Zip code / grid intensity ----

  it('adjusts home emissions when a zip code is provided', () => {
    const withZip = calculateFootprint(makeInput({ zipCode: '90210' })); // California (CAMX, low intensity)
    const withoutZip = calculateFootprint(makeInput());

    // Home emissions should differ when zipCode is provided vs not
    expect(withZip.breakdown.home).not.toBe(withoutZip.breakdown.home);
  });

  it('California zip (clean grid) produces lower home emissions than Texas zip (dirtier grid)', () => {
    const california = calculateFootprint(makeInput({ zipCode: '90210' })); // CAMX = 531
    const texas = calculateFootprint(makeInput({ zipCode: '75001' })); // ERCT = 882

    expect(california.breakdown.home).toBeLessThan(texas.breakdown.home);
  });

  // ---- Earth equivalents ----

  it('calculates earthEquivalents > 1 for typical US emissions', () => {
    const result = calculateFootprint(makeInput());

    // Typical US person produces well above the 1.73 ton sustainable threshold
    expect(result.earthEquivalents).toBeGreaterThan(1);
  });

  // ---- Percentile rank ----

  it('percentileRank is between 0 and 100', () => {
    const result = calculateFootprint(makeInput());

    expect(result.percentileRank).toBeGreaterThanOrEqual(0);
    expect(result.percentileRank).toBeLessThanOrEqual(100);
  });

  // ---- Top swap ----

  it('always provides a topSwap recommendation', () => {
    const result = calculateFootprint(makeInput());

    expect(result.topSwap).toBeDefined();
    expect(result.topSwap.title).toBeTruthy();
    expect(result.topSwap.impactTons).toBeGreaterThan(0);
  });

  // ---- Custom overrides ----

  it('applies custom overrides to the breakdown', () => {
    const result = calculateFootprint(
      makeInput({ customOverrides: { food: 10 } }),
    );

    expect(result.breakdown.food).toBe(10);
  });

  it('ignores custom override keys that are not valid category names', () => {
    const withBogus = calculateFootprint(
      makeInput({ customOverrides: { bogus: 999 } }),
    );
    const without = calculateFootprint(makeInput());

    expect(withBogus.totalTons).toBe(without.totalTons);
  });

  // ---- Edge cases ----

  it('handles a minimal-footprint profile (lowest options)', () => {
    const result = calculateFootprint({
      dietType: 'vegan',
      transitMode: 'walk',
      homeType: 'apartment',
      shoppingFrequency: 'minimal',
      flightsPerYear: 'none',
    });

    expect(result.totalTons).toBeGreaterThanOrEqual(0);
    expect(result.earthEquivalents).toBeGreaterThanOrEqual(0);
  });

  it('handles a maximum-footprint profile (highest options)', () => {
    const result = calculateFootprint({
      dietType: 'meat_heavy',
      transitMode: 'car',
      homeType: 'large_house',
      shoppingFrequency: 'frequent',
      flightsPerYear: 'three_plus',
    });

    expect(result.totalTons).toBeGreaterThan(10);
  });
});
