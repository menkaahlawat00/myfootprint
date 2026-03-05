import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-lg shadow-sm",
          hoverable && [
            "transition-all duration-[var(--duration-snap)] ease-[var(--ease-smooth)]",
            "hover:shadow-md hover:-translate-y-0.5",
            "motion-reduce:hover:translate-y-0 motion-reduce:transition-none",
          ],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card, type CardProps };
