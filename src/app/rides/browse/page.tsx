'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RideCard } from '@/components/rides/RideCard';
import { RideFilters } from '@/components/rides/RideFilters';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { Ride } from '@/types';
import { Button, Card } from '@/components/ui';
import { Search, RefreshCw, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BrowseRidesPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuthStore();
  const { fetchRides, isLoading, bookRide, getFilteredRides } = useRideStore();
  const [bookingRide, setBookingRide] = useState<string | null>(null);
  const [successRide, setSuccessRide] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth'); return; }
    fetchRides();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const filteredRides = getFilteredRides();

  const handleBook = async (ride: Ride) => {
    if (!currentUser) return;
    setBookingRide(ride.id);
    const ok = await bookRide(ride.id, currentUser.id, 1);
    setBookingRide(null);
    if (ok) {
      setSuccessRide(ride.id);
      setTimeout(() => setSuccessRide(null), 3000);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Search size={20} className="text-emerald-400" />
              Browse Rides
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">{filteredRides.length} rides available today</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchRides} loading={isLoading} icon={<RefreshCw size={14} />}>
            Refresh
          </Button>
        </div>

        {/* Success toast */}
        {successRide && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400 flex items-center gap-2 fade-in">
            <Car size={14} />
            Booking request sent! The driver will confirm shortly.
          </div>
        )}

        {/* Filters */}
        <div className="mb-5">
          <RideFilters />
        </div>

        {/* Ride List */}
        {isLoading && filteredRides.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="space-y-4">
            {filteredRides.map(ride => (
              <div key={ride.id} className={cn('transition-all duration-300', bookingRide === ride.id && 'opacity-60')}>
                <RideCard
                  ride={ride}
                  onBook={handleBook}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Search size={40} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium mb-1">No rides found</p>
            <p className="text-sm text-zinc-600">Try adjusting your filters or check back later.</p>
            <Button variant="ghost" size="sm" className="mt-4" onClick={fetchRides}>
              Clear & Refresh
            </Button>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
