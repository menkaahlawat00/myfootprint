import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges multiple class names into a single string', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles conditional classes (falsy values are excluded)', () => {
    const isActive = false;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base');
  });

  it('includes conditional classes when truthy', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base active');
  });

  it('handles undefined and null inputs gracefully', () => {
    const result = cn('base', undefined, null, 'extra');
    expect(result).toBe('base extra');
  });

  it('deduplicates conflicting Tailwind classes (tailwind-merge)', () => {
    // tailwind-merge should keep only the last conflicting class
    const result = cn('px-4', 'px-6');
    expect(result).toBe('px-6');
  });

  it('deduplicates conflicting Tailwind padding classes', () => {
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });

  it('preserves non-conflicting Tailwind classes', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles array input via clsx', () => {
    const result = cn(['foo', 'bar']);
    expect(result).toBe('foo bar');
  });

  it('handles object input via clsx', () => {
    const result = cn({ active: true, disabled: false });
    expect(result).toBe('active');
  });
});
