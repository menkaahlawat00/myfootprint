import { describe, it, expect } from 'vitest';
import { calculatePercentile, getRegionFromZip } from '@/lib/estimation/benchmarks';

describe('calculatePercentile', () => {
  it('returns a number between 0 and 100', () => {
    const result = calculatePercentile(14);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('returns 0 for 0 tons', () => {
    expect(calculatePercentile(0)).toBe(0);
  });

  it('returns 0 for negative tons', () => {
    expect(calculatePercentile(-5)).toBe(0);
  });

  it('returns a high percentile for very high emissions', () => {
    // 40 tons is far above p90 (27 national)
    const result = calculatePercentile(40);
    expect(result).toBeGreaterThanOrEqual(90);
  });

  it('returns 100 for extremely high emissions', () => {
    // Way above the extrapolated top end
    const result = calculatePercentile(100);
    expect(result).toBe(100);
  });

  it('returns a low percentile for very low emissions', () => {
    // 2 tons is below p10 (8.0 national)
    const result = calculatePercentile(2);
    expect(result).toBeLessThan(10);
  });

  it('returns approximately 50 for median national emissions (16 tons)', () => {
    const result = calculatePercentile(16);
    expect(result).toBe(50);
  });

  it('uses regional distribution when zip code is provided', () => {
    const national = calculatePercentile(14);
    // 10001 is northeast, which has different distribution
    const regional = calculatePercentile(14, '10001');

    // They should differ because northeast has different percentile thresholds
    expect(national).not.toBe(regional);
  });

  it('returns higher percentile for same tons in a cleaner region', () => {
    // 14 tons: in northeast (p50=14.5) should have a lower percentile
    // than in south (p50=17.5)
    const northeast = calculatePercentile(14, '10001');
    const south = calculatePercentile(14, '30301');

    // In the south, 14 tons is below median, so lower percentile
    // In the northeast, 14 tons is near median, so higher percentile
    expect(northeast).toBeGreaterThan(south);
  });
});

describe('getRegionFromZip', () => {
  it('returns northeast for a New York zip (10001)', () => {
    expect(getRegionFromZip('10001')).toBe('northeast');
  });

  it('returns northeast for a Boston zip (02101)', () => {
    expect(getRegionFromZip('02101')).toBe('northeast');
  });

  it('returns south for an Atlanta zip (30301)', () => {
    expect(getRegionFromZip('30301')).toBe('south');
  });

  it('returns south for a Texas zip (75001)', () => {
    expect(getRegionFromZip('75001')).toBe('south');
  });

  it('returns midwest for a Chicago zip (60601)', () => {
    expect(getRegionFromZip('60601')).toBe('midwest');
  });

  it('returns midwest for an Ohio zip (43001)', () => {
    expect(getRegionFromZip('43001')).toBe('midwest');
  });

  it('returns west for a California zip (90210)', () => {
    expect(getRegionFromZip('90210')).toBe('west');
  });

  it('returns west for a Colorado zip (80201)', () => {
    expect(getRegionFromZip('80201')).toBe('west');
  });

  it('returns south for a DC zip (20001)', () => {
    expect(getRegionFromZip('20001')).toBe('south');
  });
});
