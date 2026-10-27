'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Check,
  ShieldCheck,
  Zap,
  Clock,
  Car,
  ChevronUp,
  ChevronDown,
  Navigation,
  Phone,
  MessageSquare,
  Copy,
  Info,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SlideToConfirm } from './SlideToConfirm';

export type SnapLevel = 'collapsed' | 'mid' | 'expanded';

interface BottomSheetProps {
  selectedTier: string;
  onSelectTier: (id: string) => void;
  isConfirmed: boolean;
  onConfirmRide: () => void;
  onResetRide: () => void;
}

interface CommuteTier {
  id: string;
  name: string;
  badge?: string;
  eta: string;
  driver: string;
  rating: string;
  fare: string;
  seatsText: string;
  seatCount: number;
  totalSeats: number;
  vehicleModel: string;
  plateNumber: string;
  perks: string[];
  vehicleType: 'bike' | 'car' | 'auto';
}

const COMMUTE_TIERS: CommuteTier[] = [
  {
    id: 'tier-a',
    name: 'Campus BikePool',
    badge: 'Fastest',
    eta: '3 mins away',
    driver: 'Rahul T. • ★ 4.9',
    rating: '4.9',
    fare: '₹20',
    seatsText: '1 seat left',
    seatCount: 1,
    totalSeats: 1,
    vehicleModel: 'Royal Enfield Hunter 350 (Dapper Ash)',
    plateNumber: 'MH 31 ER 8421',
    perks: ['Sanitized Helmet Provided', 'Zero Traffic Delays', 'Direct Gate Drop'],
    vehicleType: 'bike',
  },
  {
    id: 'tier-b',
    name: 'Campus CarShare',
    badge: 'Comfort / Rain Guard',
    eta: '6 mins away',
    driver: 'Priya S. • ★ 5.0 • AC',
    rating: '5.0',
    fare: '₹35',
    seatsText: '1 seat left',
    seatCount: 1,
    totalSeats: 3,
    vehicleModel: 'Maruti Suzuki Swift VXi (Pearl White)',
    plateNumber: 'MH 31 BQ 9920',
    perks: ['Climate Controlled AC', 'Boot Space for Backpacks', 'Classmates Only'],
    vehicleType: 'car',
  },
  {
    id: 'tier-c',
    name: 'Campus AutoShare',
    badge: 'Group Split',
    eta: '4 mins away',
    driver: 'Amit K. • ★ 4.8',
    rating: '4.8',
    fare: '₹18',
    seatsText: '2 seats left',
    seatCount: 2,
    totalSeats: 3,
    vehicleModel: 'Bajaj RE EV Campus Carrier',
    plateNumber: 'MH 31 CZ 4402',
    perks: ['Spacious 3-Seater', 'Quick Hop-on Hop-off', 'Zero Emission'],
    vehicleType: 'auto',
  },
];

const QUICK_CHIPS = [
  { id: 'khapri', label: 'Khapri Metro', icon: '🚇', active: true },
  { id: 'sitabuldi', label: 'Sitabuldi Metro', icon: '🚉', active: false },
  { id: 'gate2', label: 'Campus Gate 2', icon: '🏢', active: false },
  { id: 'techpark', label: 'Tech Park / MIHAN', icon: '🔬', active: false },
];

export function BottomSheet({
  selectedTier,
  onSelectTier,
  isConfirmed,
  onConfirmRide,
  onResetRide,
}: BottomSheetProps) {
  const [snap, setSnap] = useState<SnapLevel>('mid');
  const [activeChip, setActiveChip] = useState('khapri');
  const [searchQuery, setSearchQuery] = useState('');
  const [otpCopied, setOtpCopied] = useState(false);

  const activeTier = COMMUTE_TIERS.find((t) => t.id === selectedTier) || COMMUTE_TIERS[0];

  // Heights for snap points
  const snapHeights: Record<SnapLevel, string> = {
    collapsed: '24vh',
    mid: '62vh',
    expanded: '88vh',
  };

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    if (offset < -50 || velocity < -300) {
      if (snap === 'collapsed') setSnap('mid');
      else if (snap === 'mid') setSnap('expanded');
    } else if (offset > 50 || velocity > 300) {
      if (snap === 'expanded') setSnap('mid');
      else if (snap === 'mid') setSnap('collapsed');
    }
  };

  const copyOTP = () => {
    navigator.clipboard.writeText('4892');
    setOtpCopied(true);
    setTimeout(() => setOtpCopied(false), 2000);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      animate={{ height: snapHeights[snap] }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      className="fixed bottom-0 left-0 right-0 z-30 max-w-xl mx-auto bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 rounded-t-[32px] shadow-2xl shadow-black flex flex-col overflow-hidden text-slate-100 will-change-[height]"
    >
      {/* 1. Drawer Drag Handle & Snap Controls */}
      <div className="pt-3 pb-2 px-6 flex flex-col items-center cursor-grab active:cursor-grabbing select-none shrink-0">
        <div className="w-12 h-1 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors mb-2" />

        {/* Snap Level Indicator / Mini Switcher */}
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
            <span className="text-slate-200 font-semibold">Campus Gate 1 ➔ Khapri Metro</span>
            <span className="text-slate-500">• 3.8 km (9 min)</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setSnap(snap === 'collapsed' ? 'mid' : snap === 'mid' ? 'expanded' : 'mid')
              }
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Toggle View Height"
            >
              {snap === 'expanded' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 no-scrollbar">
        {/* POST-CONFIRMATION STATE: Revealed on Slide-to-Confirm */}
        <AnimatePresence mode="wait">
          {isConfirmed ? (
            <motion.div
              key="confirmed-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4 pt-1"
            >
              {/* Trip Connection Status Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#00E599]/20 border border-[#00E599]/50 flex items-center justify-center text-[#00E599]">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        Driver Matched & En-Route
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">
                          Live
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">Arriving in ~2m 45s at Campus Gate 1</p>
                    </div>
                  </div>

                  {/* Passenger OTP Pill */}
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Pickup OTP
                    </span>
                    <button
                      onClick={copyOTP}
                      className="flex items-center gap-1 font-mono font-black text-lg text-[#00E599] hover:text-emerald-300 transition-colors"
                      title="Click to copy OTP"
                    >
                      <span>4892</span>
                      {otpCopied ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} className="text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Driver & Vehicle Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm">
                      RT
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-100 flex items-center gap-1">
                        Rahul T.
                        <ShieldCheck size={14} className="text-emerald-400" />
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Royal Enfield Hunter 350 • <span className="font-mono text-slate-300 font-semibold">{activeTier.plateNumber}</span>
                      </p>
                    </div>
                  </div>

                  {/* Quick Comms */}
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+919876543210"
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center border border-slate-700 transition-colors"
                      title="Call Driver"
                    >
                      <Phone size={16} />
                    </a>
                    <button
                      onClick={() => alert('Opening Campus In-App Chat with Rahul T.')}
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition-colors"
                      title="Message Driver"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Safety & Cost Recap */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Fare Share</span>
                  <span className="font-bold text-base text-slate-100">{activeTier.fare}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Zero Platform Fee</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Vehicle Verification</span>
                  <span className="font-bold text-slate-200 block truncate">PCE Campus Tagged</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Helmets Provided ✓</span>
                </div>
              </div>

              {/* Action Buttons: Share & Cancel */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onResetRide}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Cancel Ride
                </button>
                <button
                  onClick={() => alert('Live Tracking Link Copied: https://campusride.local/track/cc-4892')}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Share Live Trip
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selection-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* SNAP 1 ELEMENT: Compact "Where to?" search pill */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (snap === 'collapsed') setSnap('mid');
                    }}
                    placeholder="Where to? (e.g. Khapri Metro, Sitabuldi...)"
                    className="w-full h-11 pl-10 pr-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00E599]/60 focus:ring-1 focus:ring-[#00E599]/40 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Quick Route Chips Horizontal Scroll Row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
                {QUICK_CHIPS.map((chip) => {
                  const isSelected = activeChip === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => {
                        setActiveChip(chip.id);
                        if (snap === 'collapsed') setSnap('mid');
                      }}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500/20 text-[#00E599] border border-emerald-500/50 shadow-md shadow-emerald-950'
                          : 'bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SNAP 2 ELEMENT: Commute Tier Selection Cards (Vertical List) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
                  <span>AVAILABLE CAMPUS POOLS</span>
                  <span className="text-emerald-400">Strict Zero-Profit Split</span>
                </div>

                {COMMUTE_TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => onSelectTier(tier.id)}
                      className={`group relative rounded-2xl p-3.5 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-[1.5px] border-[#00E599] shadow-lg shadow-emerald-950/40 ring-1 ring-[#00E599]/20'
                          : 'bg-slate-900/70 border border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Left: Vehicle Silhouette in Glass Container */}
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-slate-950 border-emerald-500/50 text-[#00E599]'
                              : 'bg-slate-950/80 border-slate-800 text-slate-400 group-hover:text-slate-200'
                          }`}
                        >
                          {tier.vehicleType === 'bike' ? (
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="18.5" cy="17.5" r="3.5"/>
                              <circle cx="5.5" cy="17.5" r="3.5"/>
                              <circle cx="15" cy="5" r="1"/>
                              <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
                            </svg>
                          ) : tier.vehicleType === 'car' ? (
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/>
                              <circle cx="7" cy="17" r="2"/>
                              <path d="M9 17h6"/>
                              <circle cx="17" cy="17" r="2"/>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                              <circle cx="7.5" cy="14.5" r="1.5"/>
                              <circle cx="16.5" cy="14.5" r="1.5"/>
                            </svg>
                          )}
                        </div>

                        {/* Center: Title, ETA, Driver */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-slate-100 tracking-tight truncate">
                              {tier.name}
                            </span>
                            {tier.badge && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-emerald-400 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {tier.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                            <span className="text-[#00E599] font-medium flex items-center gap-1">
                              <Clock size={12} />
                              {tier.eta}
                            </span>
                            <span>•</span>
                            <span className="truncate">{tier.driver}</span>
                          </div>
                        </div>

                        {/* Right: Flat Fare & Seat Counter */}
                        <div className="text-right shrink-0">
                          <p className="font-bold text-base text-slate-100 tabular-nums">
                            {tier.fare}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-0.5">
                            {tier.totalSeats > 1 ? (
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: tier.totalSeats }).map((_, idx) => (
                                  <span
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      idx < tier.seatCount ? 'bg-emerald-400' : 'bg-slate-700'
                                    }`}
                                  />
                                ))}
                                <span className="text-[10px] text-slate-400 ml-1">{tier.seatsText}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {tier.seatsText}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Active Selection Expanded Preview */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-emerald-500/20 text-xs text-slate-300"
                        >
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="text-slate-400">Vehicle:</span>
                            <span className="font-medium text-slate-200">
                              {tier.vehicleModel} • <span className="font-mono text-emerald-400">{tier.plateNumber}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {tier.perks.map((perk, i) => (
                              <span
                                key={i}
                                className="bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1"
                              >
                                <Check size={11} className="text-[#00E599]" />
                                {perk}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* PRIMARY INTERACTION: Slide to Confirm Campus Pool */}
              <div className="pt-2">
                <SlideToConfirm
                  tierName={activeTier.name}
                  fare={activeTier.fare}
                  onConfirm={onConfirmRide}
                  isConfirmed={isConfirmed}
                />
              </div>

              {/* SNAP 3 ELEMENT: Complete Route Breakdown & Cost Transparency Matrix */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-300 tracking-wide uppercase text-[11px]">
                    RIDE INTELLIGENCE
                  </span>
                  <button
                    onClick={() => setSnap(snap === 'expanded' ? 'mid' : 'expanded')}
                    className="text-[#00E599] text-xs font-semibold flex items-center gap-1 hover:underline"
                  >
                    {snap === 'expanded' ? 'Collapse Details' : 'Full Transparency Breakdown'}
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* Route Waypoints & Timing */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00E599]" />
                      <span className="w-0.5 h-7 bg-slate-700 my-0.5" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    <div className="space-y-3 text-xs flex-1">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-200">Campus Main Gate (Pickup)</p>
                          <span className="text-[11px] text-slate-500 tabular-nums">08:45 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Near PCE Gate 1 Security Checkpost</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-200">Khapri Metro Station (Dropoff)</p>
                          <span className="text-[11px] text-emerald-400 font-bold tabular-nums">
                            ~08:54 AM
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">Nagpur Metro Orange Line Transit Hub</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Co-Passenger Student Verification */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-[#00E599]" />
                      Co-Passenger Campus Verification
                    </p>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      100% Student Body
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    All riders & drivers authenticate with official university email domains (@pce.edu / college ID).
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                        R
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-700 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                        A
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-300">
                      Rahul T. (CSE &apos;24) + 1 peer registered on this corridor
                    </span>
                  </div>
                </div>

                {/* Fair-Cost Transparency Matrix */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-400" />
                      Fair-Cost Zero Profit Matrix
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">₹/km Standard</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Corridor Fuel Share (3.8 km)</span>
                      <span className="text-slate-200 tabular-nums">₹16.40</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vehicle Wear & Tear Maintenance</span>
                      <span className="text-slate-200 tabular-nums">₹3.60</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Platform Commission & Surge Fee</span>
                      <span className="font-bold">₹0.00 (Free Campus Utility)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-sm text-slate-100">
                      <span>Rider Split Total</span>
                      <span className="text-[#00E599] text-base tabular-nums">{activeTier.fare}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
