/**
 * GET /api/check-ins
 *
 * Authenticated endpoint that returns the user's check-in history.
 * Supports ?week= query param for a specific week (ISO date string).
 * Defaults to the current week.
 *
 * POST /api/check-ins
 *
 * Authenticated endpoint to record a new weekly check-in.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { eq, and, desc } from 'drizzle-orm';
import { startOfWeek, format } from 'date-fns';
import { db, users, checkIns } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { checkInSchema } from '@/lib/validations';

function getWeekStart(dateStr?: string | null): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  return format(weekStart, 'yyyy-MM-dd');
}

export async function GET(request: NextRequest) {
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

    // Get the week filter from query params
    const { searchParams } = new URL(request.url);
    const weekParam = searchParams.get('week');
    const weekOf = getWeekStart(weekParam);

    // Fetch check-ins for the user for the given week
    const weekCheckIns = await db
      .select()
      .from(checkIns)
      .where(
        and(
          eq(checkIns.userId, user.id),
          eq(checkIns.weekOf, weekOf),
        ),
      )
      .orderBy(desc(checkIns.createdAt));

    // Also fetch all check-ins to compute streak
    const allCheckIns = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, user.id))
      .orderBy(desc(checkIns.createdAt));

    return NextResponse.json(
      {
        weekOf,
        checkIns: weekCheckIns,
        totalCheckIns: allCheckIns.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[GET /api/check-ins] Unexpected error:', error);
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
    const parseResult = checkInSchema.safeParse(body);

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

    // Calculate the current week start
    const weekOf = getWeekStart();

    // Check if user already checked in this week
    const existingCheckIn = await db
      .select()
      .from(checkIns)
      .where(
        and(
          eq(checkIns.userId, user.id),
          eq(checkIns.weekOf, weekOf),
        ),
      )
      .limit(1);

    if (existingCheckIn.length > 0) {
      return NextResponse.json(
        { error: 'Already checked in this week', existingCheckIn: existingCheckIn[0] },
        { status: 409 },
      );
    }

    // Create the check-in
    const checkInId = nanoid();
    const newCheckIn = {
      id: checkInId,
      userId: user.id,
      weekOf,
      challengeProgress: data.challengeProgress,
      additionalNotes: data.additionalNotes ?? null,
      createdAt: new Date(),
    };

    await db.insert(checkIns).values(newCheckIn);

    // Update user's lastCheckIn timestamp
    await db
      .update(users)
      .set({ lastCheckIn: new Date() })
      .where(eq(users.id, user.id));

    return NextResponse.json(
      { success: true, checkIn: newCheckIn },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    console.error('[POST /api/check-ins] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
