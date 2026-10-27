'use client';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, Search, TrendingUp, Clock, Users, IndianRupee, ArrowRight, Bell, CheckCircle, MapPin, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Badge, Avatar } from '@/components/ui';
import { RideCard } from '@/components/rides/RideCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { formatTime, timeUntil, cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const { rides, myBookings, fetchRides, fetchMyBookings } = useRideStore();

  const h = new Date().getHours();
  const greeting = useMemo(
    () => h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth'); return; }
    fetchRides();
    if (currentUser) fetchMyBookings(currentUser.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser]);

  const upcomingRides = rides.filter(r => r.status === 'scheduled').slice(0, 3);
  const activeBookings = myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').slice(0, 2);
  const isDriver = currentUser?.role === 'driver' || currentUser?.role === 'both';

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-zinc-500">{greeting},</p>
            <h1 className="text-xl font-bold text-zinc-100">{currentUser?.full_name?.split(' ')[0] || 'Student'} 👋</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isDriver ? 'emerald' : 'zinc'} size="sm" dot>
                {currentUser?.role}
              </Badge>
              <Badge variant="zinc" size="sm">{currentUser?.college_id}</Badge>
            </div>
          </div>
          <Avatar name={currentUser?.full_name || 'U'} size="lg" />
        </div>

        {/* Live Vector Map Engine Hero Banner */}
        <Link href="/map" id="open-live-map-banner">
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/70 border border-emerald-500/30 hover:border-emerald-400/60 shadow-xl transition-all duration-300 card-hover group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#00E599]/15 rounded-full blur-2xl group-hover:bg-[#00E599]/25 transition-colors pointer-events-none" />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#00E599] group-hover:scale-105 transition-transform">
                  <MapPin size={22} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-100">Live Campus Ride Map</p>
                    <span className="text-[10px] font-bold bg-[#00E599] text-slate-950 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles size={10} />
                      Uber/Bolt Grade
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time vector tracking • Slide to confirm • Zero-profit pool
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 group-hover:bg-[#00E599] group-hover:text-slate-950 flex items-center justify-center transition-all shrink-0">
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </Link>

        {/* Active Booking Alert */}
        {activeBookings.length > 0 && (
          <div className="mb-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3 fade-in">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-400">Active Booking</p>
              <p className="text-xs text-zinc-500 truncate">
                {activeBookings[0].ride?.destination} — {formatTime(activeBookings[0].ride?.departure_time || '')} · {timeUntil(activeBookings[0].ride?.departure_time || '')}
              </p>
            </div>
            <Badge variant={activeBookings[0].status === 'confirmed' ? 'emerald' : 'amber'} dot>
              {activeBookings[0].status}
            </Badge>
          </div>
        )}

        {/* Primary Action Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/rides/browse" id="find-ride-btn">
            <div className="group relative overflow-hidden rounded-2xl p-5 h-36 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300 card-hover cursor-pointer">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/15 transition-colors" />
              <Search size={28} className="text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-200" />
              <p className="font-bold text-zinc-200 text-base">Find a Ride</p>
              <p className="text-xs text-zinc-500 mt-1">Browse available rides</p>
              <ArrowRight size={14} className="absolute bottom-4 right-4 text-zinc-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </Link>

          <Link href="/rides/new" id="offer-ride-btn">
            <div className={cn(
              'group relative overflow-hidden rounded-2xl p-5 h-36 border transition-all duration-300 card-hover cursor-pointer',
              isDriver
                ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 opacity-70'
            )}>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors" />
              <Car size={28} className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform duration-200" />
              <p className="font-bold text-zinc-200 text-base">Offer a Ride</p>
              <p className="text-xs text-zinc-500 mt-1">
                {isDriver ? 'Post your route' : 'Drivers only'}
              </p>
              <ArrowRight size={14} className="absolute bottom-4 right-4 text-zinc-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: TrendingUp, label: 'Total Rides', value: rides.filter(r => r.status === 'scheduled').length, color: 'text-emerald-400' },
            { icon: Users, label: 'Seats Available', value: rides.reduce((acc, r) => acc + (r.status === 'scheduled' ? r.available_seats : 0), 0), color: 'text-blue-400' },
            { icon: IndianRupee, label: 'Avg Cost', value: `₹${Math.round(rides.filter(r => r.status === 'scheduled').reduce((a, r) => a + r.cost_per_seat, 0) / Math.max(1, rides.filter(r => r.status === 'scheduled').length))}`, color: 'text-amber-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} className="p-3 text-center">
              <Icon size={16} className={cn('mx-auto mb-1', color)} />
              <p className={cn('text-lg font-bold', color)}>{value}</p>
              <p className="text-[10px] text-zinc-600">{label}</p>
            </Card>
          ))}
        </div>

        {/* Upcoming Rides */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-zinc-200 flex items-center gap-2">
              <Clock size={16} className="text-emerald-400" />
              Upcoming Rides
            </h2>
            <Link href="/rides/browse" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {upcomingRides.length > 0 ? (
            <div className="space-y-3">
              {upcomingRides.map(ride => (
                <RideCard key={ride.id} ride={ride} compact />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Car size={32} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No upcoming rides. Check back soon!</p>
            </Card>
          )}
        </div>

        {/* My Bookings */}
        {myBookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-zinc-200 flex items-center gap-2">
                <Bell size={16} className="text-emerald-400" />
                My Bookings
              </h2>
              <Link href="/bookings" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {myBookings.slice(0, 2).map(booking => (
                <Card key={booking.id} className="p-3 flex items-center gap-3">
                  <Avatar name={booking.ride?.driver?.full_name || 'Driver'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300 truncate">{booking.ride?.destination}</p>
                    <p className="text-[10px] text-zinc-600">{formatTime(booking.ride?.departure_time || '')} · {booking.seats_requested} seat(s)</p>
                  </div>
                  <Badge variant={
                    booking.status === 'confirmed' ? 'emerald' :
                    booking.status === 'pending' ? 'amber' :
                    booking.status === 'rejected' ? 'red' : 'zinc'
                  } dot size="sm">
                    {booking.status}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
