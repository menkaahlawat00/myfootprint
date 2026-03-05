/**
 * Email Send Utility
 *
 * Helper functions for sending templated emails via Resend.
 * Each function renders a React Email template and sends it through the Resend client.
 */

import { render } from '@react-email/components';
import { resend } from './resend';
import WeeklyReminderEmail from './templates/weekly-reminder';
import ScoreUpdateEmail from './templates/score-update';
import MilestoneEmail from './templates/milestone';

const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? 'My FootPrint <noreply@myfootprint.app>';

export async function sendWeeklyReminder(user: {
  email: string;
  firstName: string;
  score: number;
  streak: number;
}): Promise<void> {
  const html = await render(
    WeeklyReminderEmail({
      firstName: user.firstName,
      score: user.score,
      streak: user.streak,
    }),
  );

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: user.email,
    subject: 'Time for your weekly check-in 🌱',
    html,
  });
}

export async function sendScoreUpdate(user: {
  email: string;
  firstName: string;
  newScore: number;
  oldScore: number;
  topArea: string;
}): Promise<void> {
  const html = await render(
    ScoreUpdateEmail({
      firstName: user.firstName,
      newScore: user.newScore,
      oldScore: user.oldScore,
      topArea: user.topArea,
    }),
  );

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: user.email,
    subject: 'Your footprint score has changed!',
    html,
  });
}

export async function sendMilestone(user: {
  email: string;
  firstName: string;
  milestone: string;
  description: string;
  score?: number;
}): Promise<void> {
  const html = await render(
    MilestoneEmail({
      firstName: user.firstName,
      milestone: user.milestone,
      description: user.description,
      score: user.score,
    }),
  );

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: user.email,
    subject: 'You hit a milestone! 🎉',
    html,
  });
}
