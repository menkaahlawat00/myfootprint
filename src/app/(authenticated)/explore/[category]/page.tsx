'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CategoryDetail, type SubCategory } from '@/components/explore/category-detail';
import { SwapToggle } from '@/components/explore/swap-toggle';
import { Button } from '@/components/ui/button';
import type { Category } from '@/components/layout/watercolor-bg';

// TODO: Replace with real API data
const mockCategoryData: Record<
  string,
  { label: string; tons: number; subCategories: SubCategory[]; swaps: { title: string; description: string; impactTons: number }[] }
> = {
  food: {
    label: 'Food',
    tons: 4.2,
    subCategories: [
      { name: 'Meat & Poultry', tons: 1.9, percentage: 45 },
      { name: 'Dairy', tons: 0.84, percentage: 20 },
      { name: 'Packaged Goods', tons: 0.63, percentage: 15 },
      { name: 'Food Waste', tons: 0.5, percentage: 12 },
      { name: 'Dining Out', tons: 0.33, percentage: 8 },
    ],
    swaps: [
      { title: 'Try Meatless Monday', description: 'Skip meat one day per week', impactTons: 0.4 },
      { title: 'Go fully vegetarian', description: 'Eliminate meat from your diet', impactTons: 1.6 },
      { title: 'Reduce food waste', description: 'Plan meals and compost scraps', impactTons: 0.3 },
    ],
  },
  transit: {
    label: 'Transit',
    tons: 3.8,
    subCategories: [
      { name: 'Car Commute', tons: 2.28, percentage: 60 },
      { name: 'Errands & Trips', tons: 0.76, percentage: 20 },
      { name: 'Ride-sharing', tons: 0.38, percentage: 10 },
      { name: 'Public Transit', tons: 0.38, percentage: 10 },
    ],
    swaps: [
      { title: 'Bike to work 2 days/week', description: 'Replace car commute with cycling twice per week', impactTons: 0.8 },
      { title: 'Carpool with a colleague', description: 'Share your commute to cut emissions in half', impactTons: 0.6 },
    ],
  },
  home: {
    label: 'Home',
    tons: 3.1,
    subCategories: [
      { name: 'Heating & Cooling', tons: 1.24, percentage: 40 },
      { name: 'Electricity', tons: 0.93, percentage: 30 },
      { name: 'Hot Water', tons: 0.62, percentage: 20 },
      { name: 'Appliances', tons: 0.31, percentage: 10 },
    ],
    swaps: [
      { title: 'Switch to LED bulbs', description: 'Replace all incandescent bulbs with LEDs', impactTons: 0.2 },
      { title: 'Lower thermostat 2 degrees', description: 'Small temperature change, big energy savings', impactTons: 0.4 },
    ],
  },
  shopping: {
    label: 'Shopping',
    tons: 1.8,
    subCategories: [
      { name: 'Clothing', tons: 0.72, percentage: 40 },
      { name: 'Electronics', tons: 0.36, percentage: 20 },
      { name: 'Household Items', tons: 0.36, percentage: 20 },
      { name: 'Other Goods', tons: 0.36, percentage: 20 },
    ],
    swaps: [
      { title: 'Buy secondhand first', description: 'Check thrift stores before buying new', impactTons: 0.3 },
      { title: 'One-in-one-out rule', description: 'Donate something for every new purchase', impactTons: 0.2 },
    ],
  },
  travel: {
    label: 'Travel',
    tons: 1.3,
    subCategories: [
      { name: 'Flights', tons: 0.91, percentage: 70 },
      { name: 'Hotel Stays', tons: 0.26, percentage: 20 },
      { name: 'Ground Transport', tons: 0.13, percentage: 10 },
    ],
    swaps: [
      { title: 'Take one fewer flight per year', description: 'Replace one round trip with a staycation', impactTons: 0.5 },
      { title: 'Choose direct flights', description: 'Takeoffs and landings use the most fuel', impactTons: 0.2 },
    ],
  },
  work: {
    label: 'Work',
    tons: 0.0,
    subCategories: [
      { name: 'Office Energy', tons: 0.0, percentage: 0 },
      { name: 'Remote Work', tons: 0.0, percentage: 0 },
    ],
    swaps: [],
  },
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category;
  const data = mockCategoryData[categoryKey];

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
