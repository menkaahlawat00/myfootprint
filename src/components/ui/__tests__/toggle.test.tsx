import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '@/components/ui/toggle';

describe('Toggle', () => {
  it('renders in the off state (aria-checked=false)', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Test toggle" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('renders in the on state (aria-checked=true)', () => {
    render(<Toggle checked={true} onChange={() => {}} label="Test toggle" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange with the inverse value when clicked', async () => {
    const handleChange = vi.fn();
    render(<Toggle checked={false} onChange={handleChange} label="Test toggle" />);

    await userEvent.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange(false) when toggling from on to off', async () => {
    const handleChange = vi.fn();
    render(<Toggle checked={true} onChange={handleChange} label="Test toggle" />);

    await userEvent.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('renders the label text', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Dark mode" />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('does not render a label element when label prop is omitted', () => {
    const { container } = render(<Toggle checked={false} onChange={() => {}} />);
    expect(container.querySelector('label')).toBeNull();
  });

  it('has accent background class when checked', () => {
    render(<Toggle checked={true} onChange={() => {}} label="On" />);
    const toggle = screen.getByRole('switch');
    expect(toggle.className).toContain('bg-accent');
  });

  it('has surface background class when unchecked', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Off" />);
    const toggle = screen.getByRole('switch');
    expect(toggle.className).toContain('bg-surface');
  });

  it('sets aria-label from the label prop', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Notifications" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-label', 'Notifications');
  });
});
