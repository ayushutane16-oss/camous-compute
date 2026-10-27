// ============================================================
// Campus Ride — Core TypeScript Types
// ============================================================

export type UserRole = 'rider' | 'driver' | 'both';
export type VehicleType = 'bike' | 'car' | null;
export type RideStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  college_id: string;
  role: UserRole;
  vehicle_type: VehicleType;
  vehicle_number: string | null;
  rating: number;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Ride {
  id: string;
  driver_id: string;
  driver?: User;
  origin: string;
  destination: string;
  departure_time: string;
  total_seats: number;
  available_seats: number;
  cost_per_seat: number;
  status: RideStatus;
  distance_km: number;
  waypoints?: string[];
  notes?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  ride_id: string;
  ride?: Ride;
  passenger_id: string;
  passenger?: User;
  seats_requested: number;
  status: BookingStatus;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface RideFilters {
  destination?: string;
  date?: string;
  minSeats?: number;
  maxCost?: number;
  sortBy?: 'departure_time' | 'cost_per_seat' | 'available_seats';
}

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  totalRides: number;
  activeRides: number;
  completedRides: number;
  totalBookings: number;
  totalSavings: number;
}

export const CAMPUS_ORIGINS = [
  'Main Campus Gate (A)',
  'North Campus Gate (B)',
  'South Campus Gate (C)',
  'Hostel Gate (D)',
  'Engineering Block Gate',
] as const;

export const METRO_DESTINATIONS = [
  'City Centre Metro Station',
  'University Park Metro',
  'Tech Hub Metro Station',
  'Central Railway Station',
  'Airport Bus Terminal',
  'Sector 18 Metro Station',
  'Old City Bus Stand',
] as const;

export type CampusOrigin = (typeof CAMPUS_ORIGINS)[number];
export type MetroDestination = (typeof METRO_DESTINATIONS)[number];
