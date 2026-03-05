"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

function Toggle({ checked, onChange, label, className }: ToggleProps) {
  const id = useId();

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full",
          "transition-colors duration-[var(--duration-snap)] ease-[var(--ease-snap)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-base",
          checked ? "bg-accent" : "bg-surface",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm",
            "transition-transform duration-[var(--duration-snap)] ease-[var(--ease-snap)]",
            "motion-reduce:transition-none",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
      {label && (
        <label htmlFor={id} className="cursor-pointer text-sm text-text select-none">
          {label}
        </label>
      )}
    </div>
  );
}

export { Toggle, type ToggleProps };
