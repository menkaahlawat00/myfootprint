'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { CategoryDetail, type SubCategory } from '@/components/explore/category-detail';
import { SwapToggle } from '@/components/explore/swap-toggle';
import { Button } from '@/components/ui/button';
import type { Category } from '@/components/layout/watercolor-bg';

/** Sub-category percentage splits and swap recommendations per category. */
const categoryMeta: Record<
  string,
  { label: string; subSplits: { name: string; percentage: number }[]; swaps: { title: string; description: string; impactTons: number }[] }
> = {
  food: {
    label: 'Food',
    subSplits: [
      { name: 'Meat & Poultry', percentage: 45 },
      { name: 'Dairy', percentage: 20 },
      { name: 'Packaged Goods', percentage: 15 },
      { name: 'Food Waste', percentage: 12 },
      { name: 'Dining Out', percentage: 8 },
    ],
    swaps: [
      { title: 'Try Meatless Monday', description: 'Skip meat one day per week', impactTons: 0.4 },
      { title: 'Go fully vegetarian', description: 'Eliminate meat from your diet', impactTons: 1.6 },
      { title: 'Reduce food waste', description: 'Plan meals and compost scraps', impactTons: 0.3 },
    ],
  },
  transit: {
    label: 'Transit',
    subSplits: [
      { name: 'Car Commute', percentage: 60 },
      { name: 'Errands & Trips', percentage: 20 },
      { name: 'Ride-sharing', percentage: 10 },
      { name: 'Public Transit', percentage: 10 },
    ],
    swaps: [
      { title: 'Bike to work 2 days/week', description: 'Replace car commute with cycling twice per week', impactTons: 0.8 },
      { title: 'Carpool with a colleague', description: 'Share your commute to cut emissions in half', impactTons: 0.6 },
    ],
  },
  home: {
    label: 'Home',
    subSplits: [
      { name: 'Heating & Cooling', percentage: 40 },
      { name: 'Electricity', percentage: 30 },
      { name: 'Hot Water', percentage: 20 },
      { name: 'Appliances', percentage: 10 },
    ],
    swaps: [
      { title: 'Switch to LED bulbs', description: 'Replace all incandescent bulbs with LEDs', impactTons: 0.2 },
      { title: 'Lower thermostat 2 degrees', description: 'Small temperature change, big energy savings', impactTons: 0.4 },
    ],
  },
  shopping: {
    label: 'Shopping',
    subSplits: [
      { name: 'Clothing', percentage: 40 },
      { name: 'Electronics', percentage: 20 },
      { name: 'Household Items', percentage: 20 },
      { name: 'Other Goods', percentage: 20 },
    ],
    swaps: [
      { title: 'Buy secondhand first', description: 'Check thrift stores before buying new', impactTons: 0.3 },
      { title: 'One-in-one-out rule', description: 'Donate something for every new purchase', impactTons: 0.2 },
    ],
  },
  travel: {
    label: 'Travel',
    subSplits: [
      { name: 'Flights', percentage: 70 },
      { name: 'Hotel Stays', percentage: 20 },
      { name: 'Ground Transport', percentage: 10 },
    ],
    swaps: [
      { title: 'Take one fewer flight per year', description: 'Replace one round trip with a staycation', impactTons: 0.5 },
      { title: 'Choose direct flights', description: 'Takeoffs and landings use the most fuel', impactTons: 0.2 },
    ],
  },
  work: {
    label: 'Work',
    subSplits: [
      { name: 'Office Energy', percentage: 50 },
      { name: 'Remote Work', percentage: 50 },
    ],
    swaps: [],
  },
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category;
  const meta = categoryMeta[categoryKey];
  const result = useOnboardingStore((s) => s.result);

  // Get the user's actual tons for this category, or 0
  const breakdownWithWork = result ? { ...result.breakdown, work: 0.0 } : null;
  const userTons = breakdownWithWork?.[categoryKey as keyof typeof breakdownWithWork] ?? 0;

  // Build sub-categories from the user's real tons and the percentage splits
  const data = meta
    ? {
        label: meta.label,
        tons: userTons,
        subCategories: meta.subSplits.map((s) => ({
          name: s.name,
          tons: Math.round((userTons * s.percentage) / 100 * 100) / 100,
          percentage: s.percentage,
        })) as SubCategory[],
        swaps: meta.swaps,
      }
    : null;

  if (!data) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
          Category Not Found
        </h1>
        <p className="text-[var(--color-text-muted)]">
          The category &quot;{categoryKey}&quot; does not exist.
        </p>
        <Link href="/explore">
          <Button variant="secondary" size="sm">
            Back to Explore
          </Button>
        </Link>
      </div>
    );
  }

  const validCategory = categoryKey as Category;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        &larr; Back to Explore
      </Link>

      {/* Category detail header and sub-categories */}
      <CategoryDetail
        category={validCategory}
        categoryLabel={data.label}
        totalTons={data.tons}
        subCategories={data.subCategories}
      />

      {/* "What if?" swaps */}
      {data.swaps.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-[var(--color-primary)]">
            What if?
          </h2>
          <div className="space-y-3">
            {data.swaps.map((swap) => (
              <SwapToggle
                key={swap.title}
                title={swap.title}
                description={swap.description}
                impactTons={swap.impactTons}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
