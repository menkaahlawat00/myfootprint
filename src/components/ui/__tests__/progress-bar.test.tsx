import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/components/ui/progress-bar';

describe('ProgressBar', () => {
  it('renders with the progressbar role', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the provided value', () => {
    render(<ProgressBar value={75} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
  });

  it('sets aria-valuemin to 0 and aria-valuemax to 100', () => {
    render(<ProgressBar value={50} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with correct width percentage for 50%', () => {
    render(<ProgressBar value={50} />);
    const progressbar = screen.getByRole('progressbar');
    const fill = progressbar.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('handles 0% value', () => {
    render(<ProgressBar value={0} />);
    const progressbar = screen.getByRole('progressbar');
    const fill = progressbar.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('0%');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
  });

  it('handles 100% value', () => {
    render(<ProgressBar value={100} />);
    const progressbar = screen.getByRole('progressbar');
    const fill = progressbar.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('100%');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps values above 100 to 100', () => {
    render(<ProgressBar value={150} />);
    const progressbar = screen.getByRole('progressbar');
    const fill = progressbar.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('100%');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps negative values to 0', () => {
    render(<ProgressBar value={-10} />);
    const progressbar = screen.getByRole('progressbar');
    const fill = progressbar.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('0%');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
  });

  it('applies custom color when provided', () => {
    render(<ProgressBar value={50} color="#ff0000" />);
    const progressbar = screen.getByRole('progressbar');
    const fill = progressbar.firstElementChild as HTMLElement;
    expect(fill.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('uses accent class when no custom color is provided', () => {
    render(<ProgressBar value={50} />);
    const progressbar = screen.getByRole('progressbar');
    const fill = progressbar.firstElementChild as HTMLElement;
    expect(fill.className).toContain('bg-accent');
  });

  it('merges custom className', () => {
    render(<ProgressBar value={50} className="mt-4" />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.className).toContain('mt-4');
  });
});
