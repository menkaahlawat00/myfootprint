/**
 * "What if?" swap recommendations.
 *
 * Loads the swaps catalog and filters it based on the user's current
 * profile to surface relevant, actionable alternatives sorted by
 * impact and difficulty.
 */

import swapsData from '@/data/emissions/swaps.json';
import type { EmissionProfile, CategoryBreakdown, EmissionCategory } from './factors';

// ---------- Types ----------

export interface Swap {
  id: string;
  category: EmissionCategory;
  title: string;
  description: string;
  impactTons: number;
  difficulty: 'easy' | 'medium' | 'hard';
  applicableTo: string[];
}

// ---------- Internal data ----------

const allSwaps: Swap[] = swapsData as Swap[];

// ---------- Difficulty ranking ----------

const difficultyRank: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

// ---------- Public API ----------

/**
 * Get the user's current choice for a given category.
 */
function getUserChoice(profile: EmissionProfile, category: EmissionCategory): string {
  switch (category) {
    case 'food':
      return profile.dietType;
    case 'transit':
      return profile.transitMode;
    case 'home':
      return profile.homeType;
    case 'shopping':
      return profile.shoppingFrequency;
    case 'travel':
      return profile.flightsPerYear;
    default:
      return '';
  }
}

/**
 * Get available swaps filtered to the user's current lifestyle choices.
 *
 * Only returns swaps whose `applicableTo` list includes the user's
 * current selection for that category. Optionally filter by a single category.
 *
 * Results are sorted by impact (descending) then difficulty (ascending, easiest first).
 *
 * @param profile  - The user's current lifestyle profile
 * @param category - Optional category to filter by
 * @returns Array of applicable swaps
 */
export function getAvailableSwaps(
  profile: EmissionProfile,
  category?: EmissionCategory,
): Swap[] {
  return allSwaps
    .filter((swap) => {
      // If filtering by category, skip swaps from other categories
      if (category && swap.category !== category) return false;

      // Check if the swap is applicable to the user's current choice
      const userChoice = getUserChoice(profile, swap.category);
      return swap.applicableTo.includes(userChoice);
    })
    .sort((a, b) => {
      // Sort by impact descending, then difficulty ascending
      const impactDiff = b.impactTons - a.impactTons;
      if (impactDiff !== 0) return impactDiff;
      return (difficultyRank[a.difficulty] ?? 2) - (difficultyRank[b.difficulty] ?? 2);
    });
}

/**
 * Get the single best swap recommendation: highest impact among the easiest difficulty tier.
 *
 * Strategy:
 * 1. Get all available swaps across all categories
 * 2. Among easy swaps, pick the one with the highest impact
 * 3. If no easy swaps exist, fall back to the highest-impact medium swap
 * 4. If no medium swaps, fall back to any highest-impact swap
 *
 * @param profile   - The user's current lifestyle profile
 * @param breakdown - The per-category emissions breakdown (used to focus on highest-emission categories)
 * @returns The single best swap, or null if no swaps are applicable
 */
export function getTopSwap(
  profile: EmissionProfile,
  breakdown: CategoryBreakdown,
): Swap | null {
  const available = getAvailableSwaps(profile);

  if (available.length === 0) return null;

  // Group by difficulty
  const easy = available.filter((s) => s.difficulty === 'easy');
  const medium = available.filter((s) => s.difficulty === 'medium');

  // Among easy swaps, prefer ones from the user's highest-emission category
  if (easy.length > 0) {
    // Sort easy swaps: prioritize swaps from highest-emission categories, then by impact
    const sorted = easy.sort((a, b) => {
      const categoryDiff =
        (breakdown[b.category as keyof CategoryBreakdown] ?? 0) -
        (breakdown[a.category as keyof CategoryBreakdown] ?? 0);
      if (Math.abs(categoryDiff) > 0.5) return categoryDiff;
      return b.impactTons - a.impactTons;
    });
    return sorted[0];
  }

  // Fall back to medium difficulty
  if (medium.length > 0) {
    return medium.sort((a, b) => b.impactTons - a.impactTons)[0];
  }

  // Last resort: highest impact regardless of difficulty
  return available[0];
}
