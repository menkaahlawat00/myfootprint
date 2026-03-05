import { describe, it, expect } from 'vitest';
import {
  getBaseEmissions,
  getAllCategoryEmissions,
  type EmissionProfile,
} from '@/lib/estimation/factors';

describe('getBaseEmissions', () => {
  it('returns a positive number for food/meat_heavy', () => {
    const value = getBaseEmissions('food', 'meat_heavy');
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThan(0);
  });

  it('returns a positive number for transit/car', () => {
    const value = getBaseEmissions('transit', 'car');
    expect(value).toBeGreaterThan(0);
  });

  it('returns a positive number for home/apartment', () => {
    const value = getBaseEmissions('home', 'apartment');
    expect(value).toBeGreaterThan(0);
  });

  it('returns a positive number for shopping/moderate', () => {
    const value = getBaseEmissions('shopping', 'moderate');
    expect(value).toBeGreaterThan(0);
  });

  it('returns a positive number for travel/one_to_two', () => {
    const value = getBaseEmissions('travel', 'one_to_two');
    expect(value).toBeGreaterThan(0);
  });

  it('returns 0 for travel/none', () => {
    const value = getBaseEmissions('travel', 'none');
    expect(value).toBe(0);
  });

  it('returns 0 for transit/walk', () => {
    const value = getBaseEmissions('transit', 'walk');
    expect(value).toBe(0);
  });

  it('returns 0 for an invalid category', () => {
    const value = getBaseEmissions('nonexistent' as any, 'anything');
    expect(value).toBe(0);
  });

  it('returns 0 for a valid category but invalid choice', () => {
    const value = getBaseEmissions('food', 'nonexistent_choice');
    expect(value).toBe(0);
  });
});

describe('getAllCategoryEmissions', () => {
  const profile: EmissionProfile = {
    dietType: 'flexitarian',
    transitMode: 'car',
    homeType: 'small_house',
    shoppingFrequency: 'moderate',
    flightsPerYear: 'one_to_two',
  };

  it('returns an object with all 5 emission categories', () => {
    const result = getAllCategoryEmissions(profile);

    expect(result).toHaveProperty('food');
    expect(result).toHaveProperty('transit');
    expect(result).toHaveProperty('home');
    expect(result).toHaveProperty('shopping');
    expect(result).toHaveProperty('travel');
  });

  it('returns the correct values from the factors data', () => {
    const result = getAllCategoryEmissions(profile);

    // These values come directly from factors.json
    expect(result.food).toBe(2.5);      // flexitarian
    expect(result.transit).toBe(4.6);   // car
    expect(result.home).toBe(3.8);      // small_house
    expect(result.shopping).toBe(1.5);  // moderate
    expect(result.travel).toBe(1.8);    // one_to_two
  });

  it('returns all numeric values', () => {
    const result = getAllCategoryEmissions(profile);

    expect(typeof result.food).toBe('number');
    expect(typeof result.transit).toBe('number');
    expect(typeof result.home).toBe('number');
    expect(typeof result.shopping).toBe('number');
    expect(typeof result.travel).toBe('number');
  });

  it('returns different values for different profiles', () => {
    const veganWalker: EmissionProfile = {
      dietType: 'vegan',
      transitMode: 'walk',
      homeType: 'apartment',
      shoppingFrequency: 'minimal',
      flightsPerYear: 'none',
    };

    const result = getAllCategoryEmissions(veganWalker);

    expect(result.food).toBe(1.5);      // vegan
    expect(result.transit).toBe(0);     // walk
    expect(result.home).toBe(2.4);      // apartment
    expect(result.shopping).toBe(0.7);  // minimal
    expect(result.travel).toBe(0);      // none
  });
});
