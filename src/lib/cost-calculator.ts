// ============================================================
// Cost Calculator — Strict cost-sharing formula
// ============================================================

/**
 * Fair Cost Calculation:
 * cost_per_seat = (distance_km * fuel_rate_per_km) / (total_passengers + 1)
 * The +1 accounts for the driver's own share.
 */
export function calculateCostShare(
  distanceKm: number,
  totalPassengers: number,
  fuelRatePerKm = 8.5 // ₹ per km average (petrol + maintenance)
): number {
  if (distanceKm <= 0 || totalPassengers <= 0) return 0;
  const totalCost = distanceKm * fuelRatePerKm;
  const costPerPerson = totalCost / (totalPassengers + 1);
  return Math.ceil(costPerPerson); // round up to nearest rupee
}

/**
 * Estimated savings vs auto-rickshaw
 */
export function estimateSavings(
  distanceKm: number,
  totalPassengers: number
): number {
  const autoRate = 15; // ₹ per km (auto average)
  const autoFare = distanceKm * autoRate + 25; // base charge
  const carpoolFare = calculateCostShare(distanceKm, totalPassengers);
  return Math.max(0, autoFare - carpoolFare);
}

/**
 * Distance lookup between common campus-metro pairs (in KM)
 */
export const DISTANCE_MAP: Record<string, Record<string, number>> = {
  'Main Campus Gate (A)': {
    'City Centre Metro Station': 8.5,
    'University Park Metro': 7.0,
    'Tech Hub Metro Station': 6.8,
    'Central Railway Station': 12.0,
    'Airport Bus Terminal': 22.0,
    'Sector 18 Metro Station': 9.2,
    'Old City Bus Stand': 11.5,
  },
  'North Campus Gate (B)': {
    'City Centre Metro Station': 9.0,
    'University Park Metro': 6.2,
    'Tech Hub Metro Station': 7.5,
    'Central Railway Station': 13.0,
    'Airport Bus Terminal': 23.5,
    'Sector 18 Metro Station': 8.8,
    'Old City Bus Stand': 12.0,
  },
  'South Campus Gate (C)': {
    'City Centre Metro Station': 7.8,
    'University Park Metro': 8.2,
    'Tech Hub Metro Station': 6.0,
    'Central Railway Station': 11.5,
    'Airport Bus Terminal': 21.0,
    'Sector 18 Metro Station': 7.3,
    'Old City Bus Stand': 10.8,
  },
  'Hostel Gate (D)': {
    'City Centre Metro Station': 8.8,
    'University Park Metro': 7.5,
    'Tech Hub Metro Station': 7.2,
    'Central Railway Station': 12.5,
    'Airport Bus Terminal': 22.5,
    'Sector 18 Metro Station': 9.5,
    'Old City Bus Stand': 4.5,
  },
  'Engineering Block Gate': {
    'City Centre Metro Station': 8.2,
    'University Park Metro': 6.8,
    'Tech Hub Metro Station': 5.8,
    'Central Railway Station': 11.8,
    'Airport Bus Terminal': 21.8,
    'Sector 18 Metro Station': 8.5,
    'Old City Bus Stand': 11.0,
  },
};

export function getDistance(origin: string, destination: string): number {
  return DISTANCE_MAP[origin]?.[destination] ?? 8.0; // default 8km
}
