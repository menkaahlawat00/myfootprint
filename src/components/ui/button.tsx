"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-primary font-semibold shadow-sm hover:shadow-glow focus-visible:shadow-glow",
  secondary:
    "bg-surface text-primary border border-border hover:bg-surface/80 focus-visible:ring-2 focus-visible:ring-accent/40",
  ghost:
    "bg-transparent text-primary hover:bg-surface/60 focus-visible:ring-2 focus-visible:ring-accent/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-sm",
  md: "px-5 py-2.5 text-base rounded-sm",
  lg: "px-7 py-3.5 text-lg rounded-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          /* Base styles */
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-[var(--duration-snap)] ease-[var(--ease-snap)]",
          /* Press animation — respects prefers-reduced-motion */
          "active:scale-[0.96] motion-reduce:active:scale-100",
          /* Focus visible ring for accessibility */
          "focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          /* Cursor */
          "cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
