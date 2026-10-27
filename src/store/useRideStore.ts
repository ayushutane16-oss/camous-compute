'use client';
// ============================================================
// Ride Store — Zustand
// ============================================================
import { create } from 'zustand';
import { Ride, Booking, RideFilters } from '@/types';
import { mockRides, mockBookings } from '@/lib/mock-data';

interface NewRideData {
  driver_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  total_seats: number;
  cost_per_seat: number;
  distance_km: number;
  notes?: string;
}

interface RideState {
  rides: Ride[];
  myBookings: Booking[];
  selectedRide: Ride | null;
  filters: RideFilters;
  isLoading: boolean;
  error: string | null;

  fetchRides: () => Promise<void>;
  fetchMyBookings: (userId: string) => Promise<void>;
  selectRide: (ride: Ride | null) => void;
  createRide: (data: NewRideData) => Promise<Ride | null>;
  bookRide: (rideId: string, passengerId: string, seatsRequested: number) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: Booking['status'], rideId: string, seatsRequested: number) => Promise<boolean>;
  cancelRide: (rideId: string) => Promise<void>;
  setFilters: (filters: Partial<RideFilters>) => void;
  getFilteredRides: () => Ride[];
}

// In-memory stores
let ridesStore: Ride[] = [...mockRides];
let bookingsStore: Booking[] = [...mockBookings];

export const useRideStore = create<RideState>((set, get) => ({
  rides: [],
  myBookings: [],
  selectedRide: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchRides: async () => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 400)); // simulate network
    set({ rides: [...ridesStore], isLoading: false });
  },

  fetchMyBookings: async (userId) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 300));
    const myBookings = bookingsStore.filter(
      b => b.passenger_id === userId || b.ride?.driver_id === userId
    );
    set({ myBookings, isLoading: false });
  },

  selectRide: (ride) => set({ selectedRide: ride }),

  createRide: async (data) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 500));
    const newRide: Ride = {
      id: `r${Date.now()}`,
      ...data,
      available_seats: data.total_seats,
      status: 'scheduled',
      waypoints: [data.origin, data.destination],
      created_at: new Date().toISOString(),
    };
    ridesStore = [newRide, ...ridesStore];
    set(state => ({ rides: [newRide, ...state.rides], isLoading: false }));
    return newRide;
  },

  bookRide: async (rideId, passengerId, seatsRequested) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 400));
    const ride = ridesStore.find(r => r.id === rideId);
    if (!ride || ride.available_seats < seatsRequested) {
      set({ isLoading: false, error: 'Not enough seats available.' });
      return false;
    }
    const { mockUsers } = await import('@/lib/mock-data');
    const { supabase } = await import('@/lib/supabase');
    const passenger = mockUsers.find(u => u.id === passengerId) || supabase._db.users.find(u => u.id === passengerId);
    const newBooking: Booking = {
      id: `b${Date.now()}`,
      ride_id: rideId,
      ride,
      passenger_id: passengerId,
      passenger,
      seats_requested: seatsRequested,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    bookingsStore = [...bookingsStore, newBooking];
    set(state => ({
      myBookings: [...state.myBookings, newBooking],
      isLoading: false,
    }));
    return true;
  },

  updateBookingStatus: async (bookingId, status, rideId, seatsRequested) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 300));
    const bookingIdx = bookingsStore.findIndex(b => b.id === bookingId);
    if (bookingIdx < 0) { set({ isLoading: false }); return false; }
    bookingsStore[bookingIdx] = { ...bookingsStore[bookingIdx], status };

    if (status === 'confirmed') {
      const rideIdx = ridesStore.findIndex(r => r.id === rideId);
      if (rideIdx >= 0) {
        ridesStore[rideIdx] = {
          ...ridesStore[rideIdx],
          available_seats: Math.max(0, ridesStore[rideIdx].available_seats - seatsRequested),
        };
      }
    }
    set(state => ({
      myBookings: bookingsStore.filter(b =>
        b.passenger_id === state.myBookings[0]?.passenger_id ||
        b.ride?.driver_id === state.myBookings[0]?.ride?.driver_id
      ),
      rides: [...ridesStore],
      isLoading: false,
    }));
    return true;
  },

  cancelRide: async (rideId) => {
    set({ isLoading: true });
    const idx = ridesStore.findIndex(r => r.id === rideId);
    if (idx >= 0) ridesStore[idx] = { ...ridesStore[idx], status: 'cancelled' };
    set({ rides: [...ridesStore], isLoading: false });
  },

  setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters } })),

  getFilteredRides: () => {
    const { rides, filters } = get();
    let filtered = rides.filter(r => r.status === 'scheduled');
    if (filters.destination) {
      filtered = filtered.filter(r =>
        r.destination.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }
    if (filters.minSeats) {
      filtered = filtered.filter(r => r.available_seats >= filters.minSeats!);
    }
    if (filters.maxCost) {
      filtered = filtered.filter(r => r.cost_per_seat <= filters.maxCost!);
    }
    if (filters.sortBy === 'cost_per_seat') {
      filtered.sort((a, b) => a.cost_per_seat - b.cost_per_seat);
    } else if (filters.sortBy === 'available_seats') {
      filtered.sort((a, b) => b.available_seats - a.available_seats);
    } else {
      filtered.sort((a, b) =>
        new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
      );
    }
    return filtered;
  },
}));
