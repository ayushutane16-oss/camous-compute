'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapHeader } from '@/components/map/MapHeader';
import { BottomSheet } from '@/components/map/BottomSheet';
import { EmergencySOSModal } from '@/components/map/EmergencySOSModal';
import { useAuthStore } from '@/store/useAuthStore';

// Dynamically import Leaflet vector map engine to prevent SSR window issues
const CampusVectorMap = dynamic(() => import('@/components/map/CampusVectorMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[100dvh] bg-[#020617] flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
      <span className="text-xs font-medium tracking-wide text-slate-300">
        Loading Campus Ride Vector Engine...
      </span>
    </div>
  ),
});

export default function CampusMapPage() {
  const { currentUser } = useAuthStore();
  const [selectedTier, setSelectedTier] = useState<string>('tier-a');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  const userName = currentUser?.full_name || 'Abhinay U.';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AU';

  const handleRecenter = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('recenter-campus-map'));
    }
  };

  const handleConfirmRide = () => {
    setIsConfirmed(true);
  };

  const handleResetRide = () => {
    setIsConfirmed(false);
  };

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-[#020617] text-slate-100 font-sans select-none">
      {/* 1. Full-Screen Vector Map Engine (Edge-to-Edge Dark Canvas) */}
      <CampusVectorMap
        selectedTierId={selectedTier}
        onSelectTier={setSelectedTier}
        isConfirmed={isConfirmed}
      />

      {/* 2. Floating Contextual Header (Glassmorphic Pill System) */}
      <MapHeader
        userName={userName}
        userInitials={initials}
        verifiedLabel="PCE Verified ✓"
        onOpenSOS={() => setIsSOSOpen(true)}
        onRecenter={handleRecenter}
      />

      {/* 3. Draggable Bottom Sheet (Framer Motion 3 Snap Points & Slide-to-Confirm) */}
      <BottomSheet
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        isConfirmed={isConfirmed}
        onConfirmRide={handleConfirmRide}
        onResetRide={handleResetRide}
      />

      {/* 4. Emergency SOS Safety Modal */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        userLocation="Campus Main Gate (PCE Gate 1), Nagpur"
      />
    </main>
  );
}
