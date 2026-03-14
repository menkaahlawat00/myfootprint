import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "circle" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded-md",
  circle: "h-10 w-10 rounded-full",
  card: "h-32 w-full rounded-lg",
};

function Skeleton({ variant = "text", className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-base",
        variantStyles[variant],
        className,
      )}
    />
  );
}

export { Skeleton, type SkeletonProps, type SkeletonVariant };
