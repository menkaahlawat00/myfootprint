/**
 * GET /api/public-challenges
 *
 * Public endpoint that returns community challenges.
 * Currently serves static seed data; will be backed by a database in the future.
 */

import { NextResponse } from 'next/server';

export interface PublicChallenge {
  id: string;
  name: string;
  description: string;
  category: string;
  tonsSaved: number;
  durationDays: number;
  participants: number;
}

const challenges: PublicChallenge[] = [
  {
    id: 'meatless-mondays',
    name: 'Meatless Mondays',
    description: 'Skip meat every Monday for a month. Discover plant-based meals that are satisfying, affordable, and planet-friendly.',
    category: 'food',
    tonsSaved: 0.15,
    durationDays: 30,
    participants: 1243,
  },
  {
    id: 'commute-switch',
    name: 'Commute Switch',
    description: 'Take public transit or bike to work at least 3 days a week. Track your miles saved and CO2 avoided.',
    category: 'transport',
    tonsSaved: 0.8,
    durationDays: 30,
    participants: 876,
  },
  {
    id: 'energy-audit',
    name: 'Energy Audit',
    description: 'Reduce your home energy usage by 10% this month. Start with thermostat adjustments, LED swaps, and sealing drafts.',
    category: 'home',
    tonsSaved: 0.5,
    durationDays: 30,
    participants: 654,
  },
  {
    id: 'shopping-fast',
    name: 'Shopping Fast',
    description: 'No new purchases for 30 days (essentials like groceries excluded). Rediscover what you already own.',
    category: 'shopping',
    tonsSaved: 0.3,
    durationDays: 30,
    participants: 1087,
  },
  {
    id: 'zero-waste-week',
    name: 'Zero Waste Week',
    description: 'Produce zero landfill waste for one week. Compost, recycle, and refuse single-use items.',
    category: 'food',
    tonsSaved: 0.1,
    durationDays: 7,
    participants: 2341,
  },
];

export async function GET() {
  return NextResponse.json(challenges, { status: 200 });
}
