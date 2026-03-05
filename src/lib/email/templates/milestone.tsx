/**
 * Milestone Email Template
 *
 * Sent when a user achieves a milestone (e.g. first check-in, 10% reduction, etc.).
 * Celebratory design with achievement badge, share CTA, and dashboard link.
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

interface MilestoneEmailProps {
  firstName: string;
  milestone: string;
  description: string;
  score?: number;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://myfootprint.app';

export default function MilestoneEmail({
  firstName = 'there',
  milestone = 'First Check-In',
  description = 'You completed your first weekly check-in!',
  score,
}: MilestoneEmailProps) {
  const shareUrl = score
    ? `${appUrl}/api/og?score=${score}`
    : `${appUrl}/api/og`;

  return (
    <Html lang="en">
      <Head />
      <Preview>You hit a milestone — {milestone}!</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Celebratory Header */}
          <Section style={celebrationHeaderStyle}>
            <Text style={celebrationEmojiStyle}>🎉</Text>
            <Text style={celebrationTitleStyle}>Milestone Achieved!</Text>
          </Section>

          <Hr style={dividerStyle} />

          {/* Greeting */}
          <Section style={sectionStyle}>
            <Text style={greetingStyle}>Hey {firstName}!</Text>
            <Text style={paragraphStyle}>
              Amazing work — you just unlocked a new milestone. Every step counts
              on the journey to a lighter footprint.
            </Text>
          </Section>

          {/* Achievement Badge */}
          <Section style={badgeSectionStyle}>
            <Section style={badgeInnerStyle}>
              <Text style={badgeIconStyle}>🏆</Text>
              <Text style={badgeNameStyle}>{milestone}</Text>
              <Text style={badgeDescriptionStyle}>{description}</Text>
            </Section>
          </Section>

          {/* Share CTA */}
          <Section style={ctaSectionStyle}>
            <Button style={shareButtonStyle} href={shareUrl}>
              Share Your Achievement
            </Button>
          </Section>

          {/* Dashboard CTA */}
          <Section style={secondaryCtaSectionStyle}>
            <Button style={secondaryButtonStyle} href={`${appUrl}/dashboard`}>
              Keep Going
            </Button>
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

const celebrationHeaderStyle: React.CSSProperties = {
  padding: '32px 32px 16px',
  textAlign: 'center' as const,
  backgroundColor: '#f0f8f1',
};

const celebrationEmojiStyle: React.CSSProperties = {
  fontSize: '48px',
  margin: '0 0 8px 0',
};

const celebrationTitleStyle: React.CSSProperties = {
  fontSize: '24px',
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

const badgeSectionStyle: React.CSSProperties = {
  padding: '16px 32px',
};

const badgeInnerStyle: React.CSSProperties = {
  backgroundColor: '#faf7f2',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  border: '2px solid #00E676',
};

const badgeIconStyle: React.CSSProperties = {
  fontSize: '40px',
  margin: '0 0 8px 0',
};

const badgeNameStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#2d2416',
  margin: '0 0 8px 0',
};

const badgeDescriptionStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#5c4d3c',
  margin: 0,
};

const ctaSectionStyle: React.CSSProperties = {
  padding: '8px 32px',
  textAlign: 'center' as const,
};

const shareButtonStyle: React.CSSProperties = {
  backgroundColor: '#00E676',
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 600,
  padding: '12px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
};

const secondaryCtaSectionStyle: React.CSSProperties = {
  padding: '8px 32px 24px',
  textAlign: 'center' as const,
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#5c4d3c',
  fontSize: '14px',
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  border: '1px solid #e8e0d4',
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
