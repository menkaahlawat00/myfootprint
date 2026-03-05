/**
 * Weekly Reminder Email Template
 *
 * Sent every Monday to users who haven't completed their weekly check-in.
 * Includes current score, streak info, a rotating tip, and a CTA to check in.
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
  Preview,
} from '@react-email/components';

const WEEKLY_TIPS = [
  'Try a meat-free Monday this week — swapping one beef meal for beans saves about 3 kg of CO₂.',
  'Unplug chargers and electronics when not in use. Phantom power can account for 5–10% of home energy use.',
  'Consider combining errands into a single trip. Fewer cold starts = less fuel wasted.',
  'Bring a reusable bag and water bottle — small swaps that add up to big impact over a year.',
  'Air-dry your laundry this week. Skipping the dryer for one load saves about 2.4 kg of CO₂.',
  "Walk or bike for trips under 2 miles. You\u0027ll save fuel and get some fresh air.",
  'Batch-cook meals this weekend. Less oven time and fewer food deliveries = a lighter footprint.',
];

function getTipOfTheWeek(): string {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_TIPS[weekNumber % WEEKLY_TIPS.length];
}

interface WeeklyReminderEmailProps {
  firstName: string;
  score: number;
  streak: number;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://myfootprint.app';

export default function WeeklyReminderEmail({
  firstName = 'there',
  score = 0,
  streak = 0,
}: WeeklyReminderEmailProps) {
  const tip = getTipOfTheWeek();

  return (
    <Html lang="en">
      <Head />
      <Preview>{`Time for your weekly check-in — your footprint is ${score} tons CO₂/yr`}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Img
              src={`${appUrl}/logo.png`}
              width="40"
              height="40"
              alt="My FootPrint"
              style={logoStyle}
            />
            <Text style={headerTextStyle}>My FootPrint</Text>
          </Section>

          <Hr style={dividerStyle} />

          {/* Greeting */}
          <Section style={sectionStyle}>
            <Text style={greetingStyle}>Hey {firstName}!</Text>
            <Text style={paragraphStyle}>
              It&apos;s time for your weekly check-in. A quick update keeps your data
              accurate and helps you track your progress.
            </Text>
          </Section>

          {/* Score Summary */}
          <Section style={scoreSectionStyle}>
            <Text style={scoreLabelStyle}>Your footprint</Text>
            <Text style={scoreValueStyle}>{score} tons CO₂/yr</Text>
          </Section>

          {/* Streak */}
          {streak > 0 && (
            <Section style={streakSectionStyle}>
              <Text style={streakTextStyle}>
                You&apos;re on a {streak}-week streak!
              </Text>
            </Section>
          )}

          {/* CTA */}
          <Section style={ctaSectionStyle}>
            <Button style={buttonStyle} href={`${appUrl}/check-in`}>
              Do Your Check-In
            </Button>
          </Section>

          <Hr style={dividerStyle} />

          {/* Tip of the Week */}
          <Section style={tipSectionStyle}>
            <Text style={tipLabelStyle}>Tip of the week</Text>
            <Text style={tipTextStyle}>{tip}</Text>
          </Section>

          <Hr style={dividerStyle} />

          {/* Footer */}
          <Section style={footerSectionStyle}>
            <Text style={footerTextStyle}>
              You&apos;re receiving this because you signed up for My FootPrint.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ---- Styles ---- */

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#faf7f2',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #e8e0d4',
};

const headerStyle: React.CSSProperties = {
  padding: '24px 32px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const logoStyle: React.CSSProperties = {
  borderRadius: '8px',
};

const headerTextStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#2d2416',
  margin: 0,
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#e8e0d4',
  borderWidth: '1px',
  margin: '0 32px',
};

const sectionStyle: React.CSSProperties = {
  padding: '24px 32px 8px',
};

const greetingStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#2d2416',
  margin: '0 0 12px 0',
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#5c4d3c',
  margin: 0,
};

const scoreSectionStyle: React.CSSProperties = {
  padding: '16px 32px',
  margin: '16px 32px',
  backgroundColor: '#f5f0e8',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const scoreLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#8b7a66',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const scoreValueStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#2d2416',
  margin: 0,
};

const streakSectionStyle: React.CSSProperties = {
  padding: '0 32px 8px',
  textAlign: 'center' as const,
};

const streakTextStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#00E676',
  margin: 0,
};

const ctaSectionStyle: React.CSSProperties = {
  padding: '16px 32px 24px',
  textAlign: 'center' as const,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#00E676',
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 600,
  padding: '12px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
};

const tipSectionStyle: React.CSSProperties = {
  padding: '20px 32px',
};

const tipLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#8b7a66',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const tipTextStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#5c4d3c',
  margin: 0,
  fontStyle: 'italic',
};

const footerSectionStyle: React.CSSProperties = {
  padding: '16px 32px 24px',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#a89880',
  margin: 0,
  textAlign: 'center' as const,
};
