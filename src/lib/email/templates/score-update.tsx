/**
 * Score Update Email Template
 *
 * Sent after a footprint recalculation to notify the user of their updated score.
 * Shows the new score, the change from last time, and the top improvement area.
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

interface ScoreUpdateEmailProps {
  firstName: string;
  newScore: number;
  oldScore: number;
  topArea: string;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://myfootprint.app';

export default function ScoreUpdateEmail({
  firstName = 'there',
  newScore = 0,
  oldScore = 0,
  topArea = 'food',
}: ScoreUpdateEmailProps) {
  const change = Math.abs(newScore - oldScore).toFixed(1);
  const decreased = newScore < oldScore;
  const noChange = newScore === oldScore;

  return (
    <Html lang="en">
      <Head />
      <Preview>
        {`Your footprint score has changed — now ${newScore} tons CO₂/yr`}
      </Preview>
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
              We&apos;ve recalculated your carbon footprint based on your latest data.
              Here&apos;s your updated result:
            </Text>
          </Section>

          {/* New Score */}
          <Section style={scoreSectionStyle}>
            <Text style={scoreLabelStyle}>Your updated footprint</Text>
            <Text style={scoreValueStyle}>{newScore} tons CO₂/yr</Text>
          </Section>

          {/* Change Indicator */}
          {!noChange && (
            <Section style={changeSectionStyle}>
              <Text
                style={{
                  ...changeTextStyle,
                  color: decreased ? '#00C853' : '#F57C00',
                }}
              >
                {decreased ? '↓' : '↑'} {change} tons from last time
              </Text>
              <Text style={changeSubtextStyle}>
                {decreased
                  ? 'Great work — your footprint is shrinking!'
                  : "Your footprint went up a bit. Let's find ways to bring it back down."}
              </Text>
            </Section>
          )}

          {/* Top Improvement Area */}
          <Section style={areaSectionStyle}>
            <Text style={areaLabelStyle}>Top area to improve</Text>
            <Text style={areaValueStyle}>
              {topArea.charAt(0).toUpperCase() + topArea.slice(1)}
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSectionStyle}>
            <Button style={buttonStyle} href={`${appUrl}/dashboard`}>
              See Full Breakdown
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

const changeSectionStyle: React.CSSProperties = {
  padding: '0 32px 8px',
  textAlign: 'center' as const,
};

const changeTextStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  margin: '0 0 4px 0',
};

const changeSubtextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#5c4d3c',
  margin: 0,
};

const areaSectionStyle: React.CSSProperties = {
  padding: '16px 32px',
  margin: '8px 32px',
  backgroundColor: '#f0f8f1',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const areaLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#8b7a66',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const areaValueStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#2d2416',
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

const footerSectionStyle: React.CSSProperties = {
  padding: '16px 32px 24px',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#a89880',
  margin: 0,
  textAlign: 'center' as const,
};
