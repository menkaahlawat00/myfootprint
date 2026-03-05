import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card content here</Card>);
    expect(screen.getByText('Card content here')).toBeInTheDocument();
  });

  it('renders with base classes', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain('bg-surface');
    expect(card.className).toContain('rounded-lg');
  });

  it('adds hover classes when hoverable prop is true', () => {
    render(
      <Card hoverable data-testid="card">
        Hoverable
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card.className).toContain('hover:shadow-md');
    expect(card.className).toContain('hover:-translate-y-0.5');
  });

  it('does not add hover classes by default (hoverable=false)', () => {
    render(<Card data-testid="card">Non-hoverable</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).not.toContain('hover:shadow-md');
    expect(card.className).not.toContain('hover:-translate-y-0.5');
  });

  it('merges custom className', () => {
    render(
      <Card className="p-4" data-testid="card">
        Padded
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card.className).toContain('p-4');
  });

  it('renders nested elements correctly', () => {
    render(
      <Card data-testid="card">
        <h2>Title</h2>
        <p>Description</p>
      </Card>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
