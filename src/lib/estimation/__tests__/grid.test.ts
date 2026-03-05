import { describe, it, expect } from 'vitest';
import {
  getGridRegion,
  getGridIntensity,
  adjustHomeEmissions,
} from '@/lib/estimation/grid';

describe('getGridRegion', () => {
  it('returns CAMX for a California zip code (900xx)', () => {
    expect(getGridRegion('90210')).toBe('CAMX');
  });

  it('returns ERCT for a Texas zip code (750xx)', () => {
    expect(getGridRegion('75001')).toBe('ERCT');
  });

  it('returns NYCW for a New York City zip code (100xx)', () => {
    expect(getGridRegion('10001')).toBe('NYCW');
  });

  it('returns NEWE for a New England zip code (010xx)', () => {
    expect(getGridRegion('01001')).toBe('NEWE');
  });

  it('returns null for an unknown zip prefix', () => {
    // "001" is not in the grid-regions.json
    expect(getGridRegion('00100')).toBeNull();
  });

  it('uses the first 3 digits of the zip code', () => {
    // 902xx maps to CAMX regardless of the last 2 digits
    expect(getGridRegion('90200')).toBe('CAMX');
    expect(getGridRegion('90299')).toBe('CAMX');
  });
});

describe('getGridIntensity', () => {
  it('returns 531 for a California CAMX zip code', () => {
    // 900xx -> CAMX -> 531
    expect(getGridIntensity('90001')).toBe(531);
  });

  it('returns 882 for a Texas ERCT zip code', () => {
    // 750xx -> ERCT -> 882
    expect(getGridIntensity('75001')).toBe(882);
  });

  it('returns a positive number for any known zip prefix', () => {
    const intensity = getGridIntensity('10001');
    expect(intensity).toBeGreaterThan(0);
  });

  it('returns the national average (857) for an unknown zip code', () => {
    const intensity = getGridIntensity('00100');
    expect(intensity).toBe(857);
  });
});

describe('adjustHomeEmissions', () => {
  const baseEmissions = 3.8; // small_house base

  it('returns a positive number', () => {
    const adjusted = adjustHomeEmissions(baseEmissions, '90210');
    expect(adjusted).toBeGreaterThan(0);
  });

  it('reduces emissions for a clean grid region (California / CAMX)', () => {
    // CAMX intensity (531) is below national average (857)
    const adjusted = adjustHomeEmissions(baseEmissions, '90210');
    expect(adjusted).toBeLessThan(baseEmissions);
  });

  it('increases emissions for a dirty grid region (RFCM / Chicago area)', () => {
    // RFCM intensity (1444) is above national average (857)
    const adjusted = adjustHomeEmissions(baseEmissions, '60601');
    expect(adjusted).toBeGreaterThan(baseEmissions);
  });

  it('returns approximately base emissions for an unknown zip (national average fallback)', () => {
    // Unknown zip -> national average -> ratio = 1.0
    const adjusted = adjustHomeEmissions(baseEmissions, '00100');
    expect(adjusted).toBeCloseTo(baseEmissions, 1);
  });

  it('rounds to 2 decimal places', () => {
    const adjusted = adjustHomeEmissions(baseEmissions, '90210');
    const decimalPlaces = adjusted.toString().split('.')[1]?.length ?? 0;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });

  it('handles 0 base emissions', () => {
    const adjusted = adjustHomeEmissions(0, '90210');
    expect(adjusted).toBe(0);
  });
});
