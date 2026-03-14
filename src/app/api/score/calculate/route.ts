/**
 * POST /api/score/calculate
 *
 * Public endpoint (no auth required) that calculates a carbon footprint
 * score from the user's onboarding questionnaire answers.
 *
 * This is called during the onboarding flow before the user has an account.
 * It accepts lifestyle profile inputs and returns a complete FootprintResult
 * including total tons, Earth equivalents, percentile rank, category breakdown,
 * and a top swap recommendation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { footprintInputSchema } from '@/lib/validations';
import { calculateFootprint, calculateFootprintAsync } from '@/lib/estimation/engine';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: unknown = await request.json();

    // Validate with Zod schema
    const parseResult = footprintInputSchema.safeParse(body);

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

    const input = parseResult.data;

    // Calculate the footprint (try Climatiq first, fall back to static)
    let result;
    try {
      result = await calculateFootprintAsync({
        zipCode: input.zipCode,
        dietType: input.dietType,
        transitMode: input.transitMode,
        homeType: input.homeType,
        shoppingFrequency: input.shoppingFrequency,
        flightsPerYear: input.flightsPerYear,
        customOverrides: input.customOverrides,
      });
    } catch {
      result = calculateFootprint({
        zipCode: input.zipCode,
        dietType: input.dietType,
        transitMode: input.transitMode,
        homeType: input.homeType,
        shoppingFrequency: input.shoppingFrequency,
        flightsPerYear: input.flightsPerYear,
        customOverrides: input.customOverrides,
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    // Handle unexpected errors
    console.error('[POST /api/score/calculate] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
