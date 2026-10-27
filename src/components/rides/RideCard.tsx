'use client';
import { useState, useEffect } from 'react';
import { Ride } from '@/types';
import { Card, Badge, Avatar, StarRating, Button } from '@/components/ui';
import { Clock, Users, IndianRupee, ArrowRight, Zap } from 'lucide-react';
import { formatTime, timeUntil, cn } from '@/lib/utils';
import Link from 'next/link';

interface RideCardProps {
  ride: Ride;
  onBook?: (ride: Ride) => void;
  compact?: boolean;
  isMyRide?: boolean;
}

export function RideCard({ ride, onBook, compact = false, isMyRide = false }: RideCardProps) {
  const statusColors = {
    scheduled: 'emerald',
    'in-progress': 'amber',
    completed: 'zinc',
    cancelled: 'red',
  } as const;

  const isFullyBooked = ride.available_seats === 0;
  const timeLabel = timeUntil(ride.departure_time);
  const [isSoon, setIsSoon] = useState(false);

  useEffect(() => {
    const diff = new Date(ride.departure_time).getTime() - Date.now();
    setIsSoon(!isFullyBooked && ride.status === 'scheduled' && diff > 0 && diff < 30 * 60000);
  }, [isFullyBooked, ride.status, ride.departure_time]);

  return (
    <Card className={cn('p-4 card-hover slide-up border-zinc-800/80 hover:border-zinc-700/80', isFullyBooked && 'opacity-75')}>
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={ride.driver?.full_name || 'Driver'} size="md" />
          <div>
            <p className="text-sm font-semibold text-zinc-200">{ride.driver?.full_name || 'Driver'}</p>
            <div className="flex items-center gap-1.5">
              <StarRating rating={ride.driver?.rating || 5} size={11} />
              <span className="text-[10px] text-zinc-600">•</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                {ride.driver?.vehicle_type === 'car' ? '🚗' : '🛵'} {ride.driver?.vehicle_number}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <Badge variant={statusColors[ride.status]} dot size="sm">
            {ride.status}
          </Badge>
          {isSoon && (
            <Badge variant="amber" size="sm">
              <Zap size={9} />Departing soon
            </Badge>
          )}
        </div>
      </div>

      {/* Route */}
      <div className="flex items-stretch gap-3 my-3">
        <div className="flex flex-col items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1" />
          <div className="w-px flex-1 bg-zinc-700 border-dashed" />
          <div className="w-2.5 h-2.5 rounded-full border-2 border-zinc-500" />
        </div>
        <div className="flex flex-col justify-between gap-2 flex-1">
          <div>
            <p className="text-xs text-zinc-500">Pickup</p>
            <p className="text-sm font-medium text-zinc-200">{ride.origin}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Drop</p>
            <p className="text-sm font-medium text-zinc-300">{ride.destination}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-zinc-800/60 my-3">
        <div className="text-center">
          <p className="text-xs text-zinc-600 flex items-center justify-center gap-1">
            <Clock size={10} />Time
          </p>
          <p className="text-xs font-semibold text-zinc-300 mt-0.5">{formatTime(ride.departure_time)}</p>
          <p className="text-[9px] text-zinc-600">{timeLabel}</p>
        </div>
        <div className="text-center border-x border-zinc-800/60">
          <p className="text-xs text-zinc-600 flex items-center justify-center gap-1">
            <Users size={10} />Seats
          </p>
          <p className={cn('text-xs font-semibold mt-0.5', isFullyBooked ? 'text-red-400' : 'text-emerald-400')}>
            {isFullyBooked ? 'Full' : `${ride.available_seats} left`}
          </p>
          <p className="text-[9px] text-zinc-600">of {ride.total_seats}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-600 flex items-center justify-center gap-1">
            <IndianRupee size={10} />Cost
          </p>
          <p className="text-xs font-semibold text-emerald-400 mt-0.5">₹{ride.cost_per_seat}</p>
          <p className="text-[9px] text-zinc-600">per seat</p>
        </div>
      </div>

      {/* Notes */}
      {ride.notes && !compact && (
        <p className="text-xs text-zinc-500 italic mb-3">&quot;{ride.notes}&quot;</p>
      )}

      {/* Action */}
      {!compact && (
        <div className="flex items-center gap-2">
          <Link href={`/rides/${ride.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full" iconRight={<ArrowRight size={14} />}>
              View Details
            </Button>
          </Link>
          {!isMyRide && !isFullyBooked && ride.status === 'scheduled' && onBook && (
            <Button size="sm" onClick={() => onBook(ride)} className="flex-1">
              Request Seat
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
