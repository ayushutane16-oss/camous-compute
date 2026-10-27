'use client';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Sparkles, Navigation } from 'lucide-react';

interface MapHeaderProps {
  userName?: string;
  userInitials?: string;
  verifiedLabel?: string;
  onOpenSOS: () => void;
  onRecenter?: () => void;
  activeTierTitle?: string;
}

export function MapHeader({
  userName = 'Abhinay U.',
  userInitials = 'AU',
  verifiedLabel = 'PCE Verified ✓',
  onOpenSOS,
  onRecenter,
  activeTierTitle = 'Campus Pool',
}: MapHeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pt-3 px-4 pointer-events-none">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
        {/* Left Capsule: Ultra-compact frosted container */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-full px-3.5 py-2 shadow-2xl shadow-black/80 hover:border-slate-700/80 transition-all">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-7 h-7 -ml-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft size={14} />
          </button>

          {/* User Initials Avatar with Emerald Ring */}
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-[11px] shadow-sm">
              {userInitials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-xs font-semibold text-slate-100 tracking-tight leading-tight truncate">
              {userName}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 tracking-wide leading-none flex items-center gap-1">
              <span>{verifiedLabel}</span>
            </span>
          </div>
        </div>

        {/* Right Action Stack */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Route Status / Alert Pill */}
          <div className="hidden xs:flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-full px-3 py-1.5 shadow-xl text-[11px] text-slate-300 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-bold">4 Pools Live</span>
          </div>

          {/* Recenter Map Button */}
          {onRecenter && (
            <button
              onClick={onRecenter}
              className="w-10 h-10 rounded-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center shadow-2xl transition-all active:scale-95"
              title="Recenter Route"
              aria-label="Recenter Map"
            >
              <Navigation size={17} />
            </button>
          )}

          {/* Floating SOS Shield Icon with pulsing tap state */}
          <button
            onClick={onOpenSOS}
            id="sos-button"
            className="relative w-10 h-10 rounded-full bg-rose-500/20 backdrop-blur-xl border border-rose-500/60 text-rose-400 hover:text-rose-200 hover:bg-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-950/50 transition-all active:scale-90 group"
            title="Campus SOS & Emergency"
            aria-label="Emergency SOS"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-20 pointer-events-none" />
            <ShieldAlert size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
