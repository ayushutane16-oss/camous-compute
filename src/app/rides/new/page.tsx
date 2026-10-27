'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { NewRideForm } from '@/components/rides/NewRideForm';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui';
import { Car } from 'lucide-react';

export default function NewRidePage() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth'); return; }
    if (currentUser?.role === 'rider') {
      router.replace('/dashboard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser]);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Car size={20} className="text-emerald-400" />
            <h1 className="text-xl font-bold text-zinc-100">Offer a Ride</h1>
            <Badge variant="emerald" size="sm">Driver</Badge>
          </div>
          <p className="text-sm text-zinc-500">Post your route and let verified students request seats.</p>
        </div>
        <NewRideForm />
      </div>
    </AppShell>
  );
}
