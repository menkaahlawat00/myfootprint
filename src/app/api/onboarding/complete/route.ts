/**
 * POST /api/onboarding/complete
 *
 * Authenticated endpoint called after a user signs up to persist their
 * onboarding answers and calculated footprint result to the database.
 *
 * Creates a footprintProfile and an initial footprintScore record, then
 * marks the user as having completed onboarding.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { db, users, footprintProfiles, footprintScores } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { onboardingCompleteSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body: unknown = await request.json();
    const parseResult = onboardingCompleteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: parseResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const data = parseResult.data;

    // Find the user by Clerk ID
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found. Please try signing up again.' },
        { status: 404 },
      );
    }

    const user = existingUsers[0];

    // Create the footprint profile
    const profileId = nanoid();
    await db.insert(footprintProfiles).values({
      id: profileId,
      userId: user.id,
      dietType: data.profile.dietType,
      transitMode: data.profile.transitMode,
      homeType: data.profile.homeType,
      shoppingFrequency: data.profile.shoppingFrequency,
      flightsPerYear: data.profile.flightsPerYear,
      updatedAt: new Date(),
    });

    // Create the initial footprint score
    const scoreId = nanoid();
    await db.insert(footprintScores).values({
      id: scoreId,
      userId: user.id,
      totalTons: data.score.totalTons.toFixed(2),
      earthEquivalents: data.score.earthEquivalents.toFixed(2),
      percentileRank: data.score.percentileRank,
      breakdown: {
        food: data.score.breakdown.food,
        transit: data.score.breakdown.transit,
        home: data.score.breakdown.home,
        shopping: data.score.breakdown.shopping,
        travel: data.score.breakdown.travel,
        work: 0,
      },
      source: 'initial',
      calculatedAt: new Date(),
    });

    // Update the user record
    await db
      .update(users)
      .set({
        onboardingComplete: true,
        zipCode: data.zipCode ?? null,
        region: data.region ?? null,
        characterType: data.characterType,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json(
      {
        success: true,
        profileId,
        scoreId,
      },
      { status: 201 },
    );
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    // Handle unexpected errors
    console.error('[POST /api/onboarding/complete] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
