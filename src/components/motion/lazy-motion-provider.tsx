"use client";

import { LazyMotion, domAnimation } from "motion/react";
import { type ReactNode } from "react";

interface LazyMotionProviderProps {
  children: ReactNode;
}

/**
 * Provides motion features to all descendant `m.*` components.
 * Uses domAnimation for smaller bundle size (no layout animations).
 * Wrap page layouts or app shell with this provider.
 */
function LazyMotionProvider({ children }: LazyMotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

export { LazyMotionProvider };
