/**
 * Climatiq API client.
 *
 * Thin wrapper around the Climatiq estimation API with caching.
 * Returns null on any failure so callers can fall back to static data.
 */

import { cacheGet, cacheSet } from './cache';

// ---------- Types ----------

interface EstimateRequest {
  emission_factor: {
    activity_id: string;
    source?: string;
    region?: string;
    year?: number;
    data_version?: string;
  };
  parameters: Record<string, number | string>;
}

interface EstimateResponse {
  co2e: number; // kg CO2e
  co2e_unit: string;
  emission_factor: {
    name: string;
    activity_id: string;
    source: string;
    region: string;
  };
}

// ---------- Constants ----------

const BASE_URL = 'https://api.climatiq.io/data/v1/estimate';
const DATA_VERSION = '^32';

function getApiKey(): string {
  const key = process.env.CLIMATIQ_API_KEY?.trim();
  if (!key) throw new Error('CLIMATIQ_API_KEY is not set');
  return key;
}

// ---------- Core request ----------

async function estimate(req: EstimateRequest): Promise<EstimateResponse | null> {
  const cacheKey = JSON.stringify(req);
  const cached = cacheGet<EstimateResponse>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      console.warn(`[Climatiq] ${res.status} for ${req.emission_factor.activity_id}`);
      return null;
    }

    const data = (await res.json()) as EstimateResponse;
    cacheSet(cacheKey, data);
    return data;
  } catch (err) {
    console.warn('[Climatiq] Request failed:', err);
    return null;
  }
}

// ---------- Public API ----------

/**
 * Estimate emissions for electricity consumption.
 * @param region - Climatiq region code (e.g., "US-CA", "US-TX")
 * @param kwh - Annual kilowatt-hours consumed
 * @returns Tons CO2e/year, or null on failure
 */
export async function estimateElectricity(region: string, kwh: number): Promise<number | null> {
  const result = await estimate({
    emission_factor: {
      activity_id: 'electricity-supply_grid-source_supplier_mix',
      region,
      data_version: DATA_VERSION,
    },
    parameters: { energy: kwh, energy_unit: 'kWh' },
  });
  return result ? result.co2e / 1000 : null; // kg -> metric tons
}

/**
 * Estimate emissions for passenger flights.
 * @param distanceKm - Total round-trip distance in km
 * @param passengers - Number of passengers (default 1)
 * @returns Tons CO2e, or null on failure
 */
export async function estimateFlight(distanceKm: number, passengers = 1): Promise<number | null> {
  const result = await estimate({
    emission_factor: {
      activity_id: 'passenger_flight-route_type_na-aircraft_type_na-distance_na-class_na-rf_included',
      region: 'US',
      data_version: DATA_VERSION,
    },
    parameters: { distance: distanceKm, distance_unit: 'km', passengers },
  });
  return result ? result.co2e / 1000 : null;
}

/**
 * Estimate emissions for vehicle travel.
 * @param distanceKm - Annual distance in km
 * @returns Tons CO2e/year, or null on failure
 */
export async function estimateVehicle(distanceKm: number): Promise<number | null> {
  const result = await estimate({
    emission_factor: {
      activity_id: 'passenger_vehicle-vehicle_type_car-fuel_source_na-distance_na-engine_size_na',
      region: 'US',
      data_version: DATA_VERSION,
    },
    parameters: { distance: distanceKm, distance_unit: 'km' },
  });
  return result ? result.co2e / 1000 : null;
}

/**
 * Estimate emissions for food consumption.
 * @param activityId - Climatiq activity ID for the food type
 * @param weightKg - Annual weight in kg
 * @returns Tons CO2e/year, or null on failure
 */
export async function estimateFood(activityId: string, weightKg: number): Promise<number | null> {
  const result = await estimate({
    emission_factor: {
      activity_id: activityId,
      region: 'US',
      data_version: DATA_VERSION,
    },
    parameters: { weight: weightKg, weight_unit: 'kg' },
  });
  return result ? result.co2e / 1000 : null;
}

/**
 * Estimate emissions for consumer goods / shopping.
 * @param activityId - Climatiq activity ID
 * @param moneyUsd - Annual spend in USD
 * @returns Tons CO2e/year, or null on failure
 */
export async function estimateShopping(activityId: string, moneyUsd: number): Promise<number | null> {
  const result = await estimate({
    emission_factor: {
      activity_id: activityId,
      region: 'US',
      data_version: DATA_VERSION,
    },
    parameters: { money: moneyUsd, money_unit: 'usd' },
  });
  return result ? result.co2e / 1000 : null;
}
