import { cn } from "@/lib/utils";

type Category = "food" | "transit" | "home" | "shopping" | "travel" | "work";

interface WatercolorBgProps {
  category: Category;
  className?: string;
}

/**
 * Category-specific gradient blob as a placeholder for watercolor illustrations.
 * Renders an absolutely-positioned CSS gradient blob in the category accent
 * color at 10% opacity, positioned at the bottom-right to bleed off the edge.
 *
 * Replace with real watercolor SVGs when available.
 */

const categoryColors: Record<Category, string> = {
  food: "var(--color-cat-food)",
  transit: "var(--color-cat-transit)",
  home: "var(--color-cat-home)",
  shopping: "var(--color-cat-shopping)",
  travel: "var(--color-cat-travel)",
  work: "var(--color-cat-work)",
};

function WatercolorBg({ category, className }: WatercolorBgProps) {
  const color = categoryColors[category];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[3px]",
        className,
      )}
      style={{
        backgroundColor: color,
      }}
    />
  );
}

export { WatercolorBg, type WatercolorBgProps, type Category };
