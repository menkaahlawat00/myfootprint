/**
 * GET /api/challenges
 *
 * Authenticated endpoint that returns the user's active and completed challenges.
 *
 * POST /api/challenges
 *
 * Authenticated endpoint to create/join a new challenge.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { db, users, challenges } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { createChallengeSchema } from '@/lib/validations';

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

    // Fetch all challenges for this user
    const userChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.userId, user.id));

    // Categorize into active and completed
    const active = userChallenges.filter((c) => c.status === 'active');
    const completed = userChallenges.filter((c) => c.status === 'completed');

    return NextResponse.json({ active, completed }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/challenges] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body: unknown = await request.json();
    const parseResult = createChallengeSchema.safeParse(body);

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
        { error: 'User not found' },
        { status: 404 },
      );
    }

    const user = existingUsers[0];

    // Create the challenge
    const challengeId = nanoid();
    const newChallenge = {
      id: challengeId,
      userId: user.id,
      category: data.category,
      title: data.title,
      description: data.description,
      impactTons: data.impactTons.toFixed(3),
      status: 'active',
      startedAt: new Date(),
    };

    await db.insert(challenges).values(newChallenge);

    return NextResponse.json(
      { success: true, challenge: { ...newChallenge, id: challengeId } },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    console.error('[POST /api/challenges] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
