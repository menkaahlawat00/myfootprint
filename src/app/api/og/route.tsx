/**
 * GET /api/og
 *
 * Generates Open Graph share card images using @vercel/og.
 * Accepts query params: score, percentile, character
 * Returns a 1200x630 PNG image.
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const score = searchParams.get('score') ?? '14.2';
  const percentile = searchParams.get('percentile') ?? '55';
  const character = searchParams.get('character') ?? 'sprout';

  const scoreNum = parseFloat(score);
  const earthEquivalents = (scoreNum / 8.1).toFixed(1);

  const characterEmoji: Record<string, string> = {
    sprout: '\uD83C\uDF31',
    tree: '\uD83C\uDF33',
    leaf: '\uD83C\uDF3F',
    earth: '\uD83C\uDF0D',
    sun: '\u2600\uFE0F',
  };

  const emoji = characterEmoji[character] ?? '\uD83C\uDF31';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 40%, #6B7280 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top: Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              {'\uD83C\uDF3F'}
            </div>
            <span
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#1A1A1A',
                letterSpacing: '-0.02em',
              }}
            >
              My FootPrint
            </span>
          </div>
          <span style={{ fontSize: '64px' }}>{emoji}</span>
        </div>

        {/* Center: Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#9CA3AF',
            }}
          >
            My Carbon Footprint
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '120px',
                fontWeight: 800,
                color: '#1A1A1A',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {scoreNum.toFixed(1)}
            </span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 500,
                color: '#9CA3AF',
              }}
            >
              tons CO2/yr
            </span>
          </div>
        </div>

        {/* Bottom: Stats row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          {/* Earth equivalents */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#1A1A1A',
              }}
            >
              {earthEquivalents}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#9CA3AF',
                fontWeight: 500,
              }}
            >
              Earth equivalents
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: '2px',
              height: '48px',
              backgroundColor: 'rgba(26, 26, 26, 0.15)',
            }}
          />

          {/* Percentile */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#FC5F2B',
              }}
            >
              Top {100 - parseInt(percentile, 10)}%
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#9CA3AF',
                fontWeight: 500,
              }}
            >
              vs. national average
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: '2px',
              height: '48px',
              backgroundColor: 'rgba(26, 26, 26, 0.15)',
            }}
          />

          {/* CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FC5F2B',
              padding: '12px 24px',
              borderRadius: '12px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}
            >
              Calculate yours free
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
