/**
 * GET /api/trends
 *
 * Authenticated endpoint that returns trend data for the user.
 * Returns footprint score history, check-in streak, total savings,
 * and weekly average.
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { eq, asc, desc } from 'drizzle-orm';
import { db, users, footprintScores, checkIns } from '@/lib/db';

export const dynamic = 'force-dynamic';

function calculateStreak(
  checkInDates: { weekOf: string }[],
): number {
  if (checkInDates.length === 0) return 0;

  // Sort by weekOf descending (most recent first)
  const sorted = [...checkInDates].sort(
    (a, b) => new Date(b.weekOf).getTime() - new Date(a.weekOf).getTime(),
  );

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i].weekOf);
    const previous = new Date(sorted[i - 1].weekOf);
    const diffDays = (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);

    // Consecutive weeks = ~7 days apart (allow some tolerance)
    if (diffDays >= 5 && diffDays <= 9) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Find the user by Clerk ID
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    const user = existingUsers[0];

    // Fetch footprint scores ordered by calculatedAt
    const scores = await db
      .select()
      .from(footprintScores)
      .where(eq(footprintScores.userId, user.id))
      .orderBy(asc(footprintScores.calculatedAt));

    // Fetch all check-ins for streak calculation
    const userCheckIns = await db
      .select({ weekOf: checkIns.weekOf })
      .from(checkIns)
      .where(eq(checkIns.userId, user.id))
      .orderBy(desc(checkIns.createdAt));

    // Calculate streak
    const streak = calculateStreak(userCheckIns);

    // Calculate total saved (initial score - latest score)
    let totalSaved = 0;
    let weeklyAverage = 0;

    if (scores.length > 0) {
      const initialScore = parseFloat(scores[0].totalTons);
      const latestScore = parseFloat(scores[scores.length - 1].totalTons);
      totalSaved = Math.max(0, initialScore - latestScore);

      // Weekly average = latest score / 52 (annualized to weekly)
      weeklyAverage = latestScore / 52;
    }

    // Format scores for the response
    const formattedScores = scores.map((s) => ({
      id: s.id,
      totalTons: parseFloat(s.totalTons),
      earthEquivalents: parseFloat(s.earthEquivalents),
      percentileRank: s.percentileRank,
      breakdown: s.breakdown,
      source: s.source,
      calculatedAt: s.calculatedAt,
    }));

    return NextResponse.json(
      {
        scores: formattedScores,
        streak,
        totalSaved: parseFloat(totalSaved.toFixed(2)),
        weeklyAverage: parseFloat(weeklyAverage.toFixed(3)),
        totalCheckIns: userCheckIns.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[GET /api/trends] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
