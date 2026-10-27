'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Badge, Avatar, Button } from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { formatDateTime } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, Car, MapPin } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuthStore();
  const { myBookings, fetchMyBookings, updateBookingStatus, isLoading } = useRideStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth'); return; }
    if (currentUser) fetchMyBookings(currentUser.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser]);

  const isDriver = currentUser?.role === 'driver' || currentUser?.role === 'both';

  const incomingRequests = myBookings.filter(
    b => b.ride?.driver_id === currentUser?.id && b.status === 'pending'
  );
  const myPassengerBookings = myBookings.filter(b => b.passenger_id === currentUser?.id);

  const handleAccept = (bookingId: string, rideId: string, seats: number) =>
    updateBookingStatus(bookingId, 'confirmed', rideId, seats);
  const handleDecline = (bookingId: string, rideId: string, seats: number) =>
    updateBookingStatus(bookingId, 'rejected', rideId, seats);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        <h1 className="text-xl font-bold text-zinc-100 mb-5">My Trips</h1>

        {/* Driver: Incoming Requests */}
        {isDriver && incomingRequests.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold text-zinc-300 text-sm">Ride Requests</h2>
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">
                {incomingRequests.length}
              </span>
            </div>
            <div className="space-y-3">
              {incomingRequests.map(booking => (
                <Card key={booking.id} className="p-4 border-amber-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={booking.passenger?.full_name || 'Passenger'} size="md" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-200">{booking.passenger?.full_name}</p>
                      <p className="text-xs text-zinc-500">{booking.passenger?.college_id} · {booking.seats_requested} seat(s)</p>
                    </div>
                    <Badge variant="amber" dot size="sm">Pending</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-600 mb-3 p-2 bg-zinc-800/50 rounded-xl">
                    <MapPin size={11} className="text-emerald-400" />
                    <span>{booking.ride?.destination}</span>
                    <span className="ml-auto">{formatDateTime(booking.ride?.departure_time || '')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      icon={<XCircle size={14} />}
                      loading={isLoading}
                      onClick={() => handleDecline(booking.id, booking.ride_id, booking.seats_requested)}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      icon={<CheckCircle size={14} />}
                      loading={isLoading}
                      onClick={() => handleAccept(booking.id, booking.ride_id, booking.seats_requested)}
                    >
                      Accept
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Passenger Bookings */}
        <div>
          <h2 className="font-semibold text-zinc-300 text-sm mb-3">My Bookings</h2>
          {myPassengerBookings.length > 0 ? (
            <div className="space-y-3">
              {myPassengerBookings.map(booking => {
                const statusColor = {
                  pending: 'amber', confirmed: 'emerald', rejected: 'red', completed: 'zinc'
                }[booking.status] as 'amber' | 'emerald' | 'red' | 'zinc';
                return (
                  <Card key={booking.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={booking.ride?.driver?.full_name || 'D'} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{booking.ride?.driver?.full_name}</p>
                          <p className="text-xs text-zinc-500">{booking.seats_requested} seat(s) · ₹{(booking.seats_requested * (booking.ride?.cost_per_seat || 0))}</p>
                        </div>
                      </div>
                      <Badge variant={statusColor} dot size="sm">{booking.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-600 p-2 bg-zinc-800/50 rounded-xl mt-2">
                      <MapPin size={11} className="text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{booking.ride?.origin} → {booking.ride?.destination}</span>
                      <span className="ml-auto flex-shrink-0 flex items-center gap-1">
                        <Clock size={10} />{formatDateTime(booking.ride?.departure_time || '')}
                      </span>
                    </div>
                    {booking.status === 'confirmed' && (
                      <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle size={11} />
                        Driver contact unlocked: {booking.ride?.driver?.phone}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <Car size={32} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No bookings yet.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/rides/browse')}>
                Browse Rides
              </Button>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
