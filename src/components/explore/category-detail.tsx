'use client';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WatercolorBg, type Category } from '@/components/layout/watercolor-bg';

interface SubCategory {
  name: string;
  tons: number;
  percentage: number;
}

interface CategoryDetailProps {
  category: Category;
  categoryLabel: string;
  totalTons: number;
  subCategories: SubCategory[];
}

function CategoryDetail({
  category,
  categoryLabel,
  totalTons,
  subCategories,
}: CategoryDetailProps) {
  return (
    <div>
      {/* Category header */}
      <Card className="relative mb-6 overflow-hidden p-6">
        <WatercolorBg category={category} />
        <div className="relative">
          <h1 className="font-display text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
            {categoryLabel}
          </h1>
          <p className="mt-2 font-mono text-[36px] font-medium leading-none text-[var(--color-primary)]">
            {totalTons.toFixed(1)}
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            tons CO&#x2082;/year
          </p>
        </div>
      </Card>

      {/* Sub-category list */}
      <div className="space-y-3">
        {subCategories.map((sub) => (
          <Card key={sub.name} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text)]">
                {sub.name}
              </span>
              <div className="text-right">
                <span className="font-mono text-sm font-medium text-[var(--color-primary)]">
                  {sub.tons.toFixed(1)} tons
                </span>
                <span className="ml-2 text-[13px] text-[var(--color-text-muted)]">
                  {sub.percentage}%
                </span>
              </div>
            </div>
            <ProgressBar value={sub.percentage} className="mt-2" />
          </Card>
        ))}
      </div>
    </div>
  );
}

export { CategoryDetail, type CategoryDetailProps, type SubCategory };
