'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Badge, Avatar, Button, StarRating } from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { Mail, Phone, CreditCard, Car, LogOut, Edit } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const { rides } = useRideStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth'); return; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!currentUser) return null;

  const myRides = rides.filter(r => r.driver_id === currentUser.id);
  const isDriver = currentUser.role === 'driver' || currentUser.role === 'both';

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
        {/* Profile Header */}
        <Card className="p-6 mb-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          <Avatar name={currentUser.full_name} size="xl" className="mx-auto mb-3" />
          <h1 className="text-xl font-bold text-zinc-100">{currentUser.full_name}</h1>
          <p className="text-sm text-zinc-500 mb-2">{currentUser.email}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="emerald" dot size="sm">{currentUser.role}</Badge>
            <Badge variant="zinc" size="sm">{currentUser.college_id}</Badge>
            {currentUser.is_verified && <Badge variant="blue" size="sm">✓ Verified</Badge>}
          </div>
          <div className="flex items-center justify-center mt-3">
            <StarRating rating={currentUser.rating} size={14} />
          </div>
        </Card>

        {/* Details */}
        <Card className="p-4 mb-4 space-y-1">
          {[
            { icon: Mail, label: 'Email', value: currentUser.email },
            { icon: Phone, label: 'Phone', value: currentUser.phone || 'Not provided' },
            { icon: CreditCard, label: 'College ID', value: currentUser.college_id },
            ...(isDriver ? [
              { icon: Car, label: 'Vehicle', value: `${currentUser.vehicle_type} · ${currentUser.vehicle_number || '—'}` },
            ] : []),
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-2.5 border-b border-zinc-800/50 last:border-0">
              <Icon size={14} className="text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-zinc-500 w-20">{label}</span>
              <span className="text-sm text-zinc-300 flex-1">{value}</span>
            </div>
          ))}
        </Card>

        {/* Stats */}
        {isDriver && (
          <Card className="p-4 mb-4">
            <p className="text-xs font-medium text-zinc-400 mb-3">Driver Stats</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-emerald-400">{myRides.length}</p>
                <p className="text-[10px] text-zinc-600">Rides Offered</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-400">{currentUser.rating.toFixed(1)}</p>
                <p className="text-[10px] text-zinc-600">Avg Rating</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-400">
                  {myRides.filter(r => r.status === 'completed').length}
                </p>
                <p className="text-[10px] text-zinc-600">Completed</p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="secondary" className="w-full" icon={<Edit size={14} />}>
            Edit Profile
          </Button>
          <Button variant="danger" className="w-full" onClick={handleLogout} icon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
