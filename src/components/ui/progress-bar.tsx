import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Progress value between 0 and 100 */
  value: number;
  /** Fill color — defaults to electric green (accent) */
  color?: string;
  className?: string;
}

function ProgressBar({ value, color, className }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-base", className)}
    >
      <div
        className={cn(
          "h-full rounded-full",
          "transition-all duration-[var(--duration-count)] ease-[var(--ease-smooth)]",
          "motion-reduce:transition-none",
          !color && "bg-accent",
        )}
        style={{
          width: `${clampedValue}%`,
          ...(color ? { backgroundColor: color } : {}),
        }}
      />
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
