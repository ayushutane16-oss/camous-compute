'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Badge, Avatar, StarRating, Button } from '@/components/ui';
import { MapPin, Clock, Users, IndianRupee, Phone, ArrowLeft, Car, CheckCircle, AlertCircle, Navigation, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';

import { formatDateTime, formatTime, timeUntil, cn } from '@/lib/utils';
import Link from 'next/link';
import { maskPhone } from '@/lib/auth-validator';

export default function RideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuthStore();
  const { rides, fetchRides, bookRide, isLoading } = useRideStore();


  const [seatsRequested, setSeatsRequested] = useState(1);
  const [showContact, setShowContact] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth'); return; }
    if (rides.length === 0) fetchRides();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Derive ride from store — no secondary setState effect needed
  const ride = useMemo(() => rides.find(r => r.id === params.id) ?? null, [rides, params.id]);

  const handleBook = async () => {
    if (!currentUser || !ride) return;
    setBookingError(null);
    const ok = await bookRide(ride.id, currentUser.id, seatsRequested);
    if (ok) {
      setBookingDone(true);
      setShowModal(false);
    } else {
      setBookingError('Booking failed. Please try again.');
    }
  };

  if (!ride) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
        </div>
      </AppShell>
    );
  }

  const isMyRide = ride.driver_id === currentUser?.id;
  const isFull = ride.available_seats === 0;
  const isScheduled = ride.status === 'scheduled';

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        {/* Back */}
        <Link href="/rides/browse" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 mb-4 transition-colors">
          <ArrowLeft size={16} />Back to rides
        </Link>

        {/* Status Banner */}
        {bookingDone && (
          <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 fade-in">
            <CheckCircle size={18} className="text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-emerald-400">Booking request sent!</p>
              <p className="text-xs text-zinc-500">The driver will confirm your request. Contact info will be unlocked on acceptance.</p>
            </div>
          </div>
        )}

        {/* Driver Card */}
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-4">
            <Avatar name={ride.driver?.full_name || 'Driver'} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-zinc-100">{ride.driver?.full_name}</h2>
                <Badge variant="emerald" size="sm" dot>Verified</Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{ride.driver?.college_id}</p>
              <StarRating rating={ride.driver?.rating || 5} size={13} />
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-600">Vehicle</p>
              <p className="text-lg">{ride.driver?.vehicle_type === 'car' ? '🚗' : '🛵'}</p>
              <p className="text-[10px] text-zinc-500 font-mono">{ride.driver?.vehicle_number}</p>
            </div>
          </div>

          {/* Contact (only if booking confirmed) */}
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Phone size={14} />
                <span>{showContact ? ride.driver?.phone : maskPhone(ride.driver?.phone || '')}</span>
              </div>
              {bookingDone ? (
                <Button variant="outline" size="sm" onClick={() => setShowContact(!showContact)} icon={<Phone size={12} />}>
                  {showContact ? 'Hide' : 'Show'} Contact
                </Button>
              ) : (
                <p className="text-xs text-zinc-600 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Unlocked after confirmation
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Route Details */}
        <Card className="p-5 mb-4">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <Navigation size={14} className="text-emerald-400" />
            Route
          </h3>
          <div className="space-y-0">
            {(ride.waypoints && ride.waypoints.length > 0 ? ride.waypoints : [ride.origin, ride.destination]).map((point, i, arr) => (
              <div key={point} className="flex items-stretch gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-3 h-3 rounded-full flex-shrink-0',
                    i === 0 ? 'bg-emerald-500' :
                    i === arr.length - 1 ? 'border-2 border-zinc-500' :
                    'bg-zinc-600'
                  )} />
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-zinc-800 my-1" />}
                </div>
                <div className={cn('pb-4', i === arr.length - 1 && 'pb-0')}>
                  <p className={cn('text-sm font-medium', i === 0 ? 'text-emerald-400' : i === arr.length - 1 ? 'text-zinc-400' : 'text-zinc-400')}>
                    {point}
                  </p>
                  {i === 0 && <p className="text-xs text-zinc-600">Pickup · {formatTime(ride.departure_time)}</p>}
                  {i === arr.length - 1 && <p className="text-xs text-zinc-600">Drop-off</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Ride Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: Clock, label: 'Departure', value: formatDateTime(ride.departure_time), sub: timeUntil(ride.departure_time) },
            { icon: MapPin, label: 'Distance', value: `~${ride.distance_km} km`, sub: 'one-way' },
            { icon: Users, label: 'Seats', value: `${ride.available_seats} / ${ride.total_seats}`, sub: 'available' },
            { icon: IndianRupee, label: 'Cost/Seat', value: `₹${ride.cost_per_seat}`, sub: 'fair share' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <Card key={label} className="p-3.5">
              <Icon size={14} className="text-emerald-400 mb-1.5" />
              <p className="text-xs text-zinc-600">{label}</p>
              <p className="text-sm font-bold text-zinc-200">{value}</p>
              <p className="text-[10px] text-zinc-600">{sub}</p>
            </Card>
          ))}
        </div>

        {/* Notes */}
        {ride.notes && (
          <Card className="p-4 mb-4 border-l-2 border-emerald-500/40">
            <p className="text-xs text-zinc-600 mb-1">Driver&apos;s note</p>
            <p className="text-sm text-zinc-400 italic">&quot;{ride.notes}&quot;</p>
          </Card>
        )}

        {/* CTA */}
        {!isMyRide && isScheduled && !bookingDone && (
          <div className="sticky bottom-20 md:bottom-4">
            <Card className="p-4 glass border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500">Seats to book</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => setSeatsRequested(s => Math.max(1, s - 1))}
                      className="w-7 h-7 rounded-lg border border-zinc-700 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 flex items-center justify-center text-base transition-all">
                      −
                    </button>
                    <span className="text-lg font-bold text-zinc-200 w-6 text-center">{seatsRequested}</span>
                    <button onClick={() => setSeatsRequested(s => Math.min(ride.available_seats, s + 1))}
                      className="w-7 h-7 rounded-lg border border-zinc-700 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 flex items-center justify-center text-base transition-all">
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right mr-2">
                  <p className="text-xs text-zinc-500">Total</p>
                  <p className="text-xl font-bold text-emerald-400">₹{seatsRequested * ride.cost_per_seat}</p>
                </div>
                <Button
                  size="lg"
                  onClick={() => setShowModal(true)}
                  disabled={isFull}
                  className="min-w-[120px]"
                  icon={<Car size={16} />}
                >
                  {isFull ? 'Full' : 'Request'}
                </Button>
              </div>
              {bookingError && <p className="text-xs text-red-400 mt-2">{bookingError}</p>}
            </Card>
          </div>
        )}

        {isMyRide && (
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-sm text-blue-400 text-center">
            This is your own ride
          </div>
        )}
      </div>

      {/* Booking Confirm Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 fade-in" onClick={() => setShowModal(false)}>
          <Card className="w-full max-w-sm p-6 slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-zinc-200">Confirm Booking</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
            </div>
            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-500">Driver</span><span className="text-zinc-200">{ride.driver?.full_name}</span></div>
              <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-500">Route</span><span className="text-zinc-200 text-right max-w-[60%]">{ride.origin} → {ride.destination}</span></div>
              <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-500">Departure</span><span className="text-zinc-200">{formatTime(ride.departure_time)}</span></div>
              <div className="flex justify-between py-2 border-b border-zinc-800"><span className="text-zinc-500">Seats</span><span className="text-zinc-200">{seatsRequested}</span></div>
              <div className="flex justify-between py-2"><span className="text-zinc-400 font-medium">Total to Pay</span><span className="text-emerald-400 font-bold text-lg">₹{seatsRequested * ride.cost_per_seat}</span></div>
            </div>
            <p className="text-xs text-zinc-600 mb-4">The driver will accept or decline your request. Contact details are shared only after acceptance.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleBook} loading={isLoading}>Confirm</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
