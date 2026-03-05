/**
 * GET /api/cron/weekly
 *
 * Vercel Cron endpoint that sends weekly reminder emails to users
 * who have completed onboarding but haven't checked in this week.
 *
 * Protected by CRON_SECRET — Vercel passes this as a Bearer token.
 * Schedule: Every Monday at 9 AM UTC (configured in vercel.json).
 */

import { NextRequest, NextResponse } from 'next/server';
import { eq, desc, and } from 'drizzle-orm';
import { startOfWeek, format } from 'date-fns';
import { db, users, checkIns, footprintScores } from '@/lib/db';
import { sendWeeklyReminder } from '@/lib/email/send';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify the CRON_SECRET
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Calculate the start of the current week (Monday)
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekOf = format(weekStart, 'yyyy-MM-dd');

    // Find all onboarded users
    const onboardedUsers = await db
      .select()
      .from(users)
      .where(eq(users.onboardingComplete, true));

    let sent = 0;
    let errors = 0;

    for (const user of onboardedUsers) {
      try {
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
          // User already checked in — skip
          continue;
        }

        // Fetch latest score
        const latestScore = await db
          .select()
          .from(footprintScores)
          .where(eq(footprintScores.userId, user.id))
          .orderBy(desc(footprintScores.calculatedAt))
          .limit(1);

        const score = latestScore.length > 0
          ? parseFloat(latestScore[0].totalTons)
          : 0;

        // Calculate streak: count consecutive weeks with check-ins going backward
        const allCheckIns = await db
          .select()
          .from(checkIns)
          .where(eq(checkIns.userId, user.id))
          .orderBy(desc(checkIns.createdAt));

        let streak = 0;
        if (allCheckIns.length > 0) {
          // Build a set of weeks the user has checked in
          const checkedInWeeks = new Set(
            allCheckIns.map((ci) => ci.weekOf),
          );

          // Walk backwards from last week (not this week, since they haven't checked in yet)
          const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
          let checkDate = new Date(weekStart.getTime() - oneWeekMs);

          while (true) {
            const checkWeek = format(
              startOfWeek(checkDate, { weekStartsOn: 1 }),
              'yyyy-MM-dd',
            );
            if (checkedInWeeks.has(checkWeek)) {
              streak++;
              checkDate = new Date(checkDate.getTime() - oneWeekMs);
            } else {
              break;
            }
          }
        }

        // Determine display name
        const firstName = user.displayName?.split(' ')[0] ?? 'there';

        // Send the reminder email
        await sendWeeklyReminder({
          email: user.email,
          firstName,
          score,
          streak,
        });

        sent++;
      } catch (err) {
        console.error(
          `[cron/weekly] Failed to send reminder to user ${user.id}:`,
          err,
        );
        errors++;
      }
    }

    console.log(
      `[cron/weekly] Completed: sent=${sent}, errors=${errors}, total=${onboardedUsers.length}`,
    );

    return NextResponse.json(
      { sent, errors, total: onboardedUsers.length },
      { status: 200 },
    );
  } catch (error) {
    console.error('[GET /api/cron/weekly] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
