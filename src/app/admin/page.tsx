'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Badge, Avatar, StarRating } from '@/components/ui';
import { useRideStore } from '@/store/useRideStore';
import { mockUsers, mockBookings } from '@/lib/mock-data';
import { formatDateTime, cn } from '@/lib/utils';
import { Users, Car, BookOpen, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { AdminStats } from '@/types';

export default function AdminPage() {
  const { rides, fetchRides } = useRideStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'rides'>('overview');

  useEffect(() => {
    fetchRides();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats: AdminStats = {
    totalUsers: mockUsers.length,
    verifiedUsers: mockUsers.filter(u => u.is_verified).length,
    totalRides: rides.length,
    activeRides: rides.filter(r => r.status === 'scheduled' || r.status === 'in-progress').length,
    completedRides: rides.filter(r => r.status === 'completed').length,
    totalBookings: mockBookings.length,
    totalSavings: mockBookings.filter(b => b.status === 'confirmed').length * 145,
  };

  const TABS = ['overview', 'users', 'rides'] as const;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Shield size={18} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Admin Panel</h1>
            <p className="text-xs text-zinc-500">Campus Ride platform overview</p>
          </div>
          <Badge variant="amber" size="md" className="ml-auto">Admin</Badge>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize',
                activeTab === tab ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Users, label: 'Total Students', value: stats.totalUsers, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: CheckCircle, label: 'Verified', value: stats.verifiedUsers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { icon: Car, label: 'Active Rides', value: stats.activeRides, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                { icon: BookOpen, label: 'Bookings', value: stats.totalBookings, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <Card key={label} className="p-4">
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-2', bg)}>
                    <Icon size={16} className={color} />
                  </div>
                  <p className={cn('text-2xl font-bold', color)}>{value}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{label}</p>
                </Card>
              ))}
            </div>

            <Card className="p-5">
              <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                Platform Metrics
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total rides published', value: stats.totalRides },
                  { label: 'Rides completed', value: stats.completedRides },
                  { label: 'Total bookings made', value: stats.totalBookings },
                  { label: 'Estimated student savings', value: `₹${stats.totalSavings.toLocaleString()}` },
                  { label: 'Verification rate', value: `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-zinc-800/50 text-sm">
                    <span className="text-zinc-500">{label}</span>
                    <span className="font-semibold text-zinc-200">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3 fade-in">
            {mockUsers.map(user => (
              <Card key={user.id} className="p-4 flex items-center gap-3">
                <Avatar name={user.full_name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-zinc-200">{user.full_name}</p>
                    <Badge variant={user.is_verified ? 'emerald' : 'red'} size="sm" dot>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                    <Badge variant="zinc" size="sm">{user.role}</Badge>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  <p className="text-[10px] text-zinc-600">{user.college_id} · Joined {new Date(user.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <StarRating rating={user.rating} size={11} />
              </Card>
            ))}
          </div>
        )}

        {/* Rides Tab */}
        {activeTab === 'rides' && (
          <div className="space-y-3 fade-in">
            {rides.map(ride => (
              <Card key={ride.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{ride.origin} → {ride.destination}</p>
                    <p className="text-xs text-zinc-500">Driver: {ride.driver?.full_name} · {formatDateTime(ride.departure_time)}</p>
                  </div>
                  <Badge variant={
                    ride.status === 'scheduled' ? 'emerald' :
                    ride.status === 'in-progress' ? 'amber' :
                    ride.status === 'completed' ? 'zinc' : 'red'
                  } dot size="sm">
                    {ride.status}
                  </Badge>
                </div>
                <div className="flex gap-4 text-xs text-zinc-600">
                  <span>{ride.available_seats}/{ride.total_seats} seats</span>
                  <span>₹{ride.cost_per_seat}/seat</span>
                  <span>{ride.distance_km}km</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
