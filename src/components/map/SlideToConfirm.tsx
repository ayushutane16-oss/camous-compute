'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsRight, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SlideToConfirmProps {
  onConfirm: () => void;
  isConfirmed?: boolean;
  tierName?: string;
  fare?: string;
  disabled?: boolean;
}

export function SlideToConfirm({
  onConfirm,
  isConfirmed = false,
  tierName = 'Campus BikePool',
  fare = '₹20',
  disabled = false,
}: SlideToConfirmProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00E599', '#34D399', '#10B981', '#F8FAFC'],
      });
    } catch (e) {
      // ignore if confetti fails
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || isConfirmed) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current || isConfirmed) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbWidth = 56;
    const maxDrag = Math.max(1, trackRect.width - thumbWidth - 8);
    const currentX = e.clientX - trackRect.left - thumbWidth / 2;
    const clampedX = Math.max(0, Math.min(maxDrag, currentX));
    setDragX(clampedX);
    const progress = clampedX / maxDrag;
    setDragProgress(progress);

    if (progress >= 0.88) {
      setIsDragging(false);
      setDragProgress(1);
      setDragX(maxDrag);
      triggerCelebration();
      onConfirm();
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragProgress < 0.88) {
      // Spring back to 0
      setDragX(0);
      setDragProgress(0);
    }
  };

  // Reset if isConfirmed becomes false
  useEffect(() => {
    if (!isConfirmed) {
      setDragProgress(0);
      setDragX(0);
    } else {
      setDragProgress(1);
    }
  }, [isConfirmed]);

  return (
    <div className="w-full select-none">
      {/* Track */}
      <div
        ref={trackRef}
        id="slide-to-confirm-track"
        className={`relative h-14 w-full rounded-2xl border transition-colors flex items-center overflow-hidden p-1 ${
          isConfirmed
            ? 'bg-emerald-950/60 border-emerald-500/50 shadow-lg shadow-emerald-950/50'
            : 'bg-slate-900 border-slate-800 shadow-inner'
        }`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Dynamic Progress Fill with Neon Glow */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/25 via-emerald-400/30 to-emerald-400/40 transition-[width] duration-75 ease-out"
          style={{
            width: isConfirmed ? '100%' : `${Math.max(10, dragProgress * 100)}%`,
          }}
        />

        {/* Text Shimmer Label */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
            isConfirmed ? 'opacity-0' : ''
          }`}
          style={{
            opacity: isConfirmed ? 0 : Math.max(0, 1 - dragProgress * 1.6),
          }}
        >
          <span className="slide-shimmer-text text-sm font-semibold tracking-wide pl-7">
            Slide to Confirm Campus Pool
          </span>
        </div>

        {/* Confirmed Label */}
        {isConfirmed && (
          <div className="absolute inset-0 flex items-center justify-center text-emerald-400 text-sm font-bold gap-2 animate-in fade-in duration-300">
            <Check size={18} className="stroke-[3]" />
            <span>Pool Confirmed • Driver En-route</span>
          </div>
        )}

        {/* Draggable Mint Thumb */}
        {!isConfirmed && (
          <div
            id="slide-thumb-handle"
            onPointerDown={handlePointerDown}
            className={`relative z-10 w-12 h-12 rounded-xl bg-[#00E599] flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/40 cursor-grab active:cursor-grabbing transition-transform ${
              isDragging ? 'scale-105 shadow-emerald-400/60' : 'hover:scale-102'
            }`}
            style={{
              transform: `translateX(${dragX}px)`,
              transition: isDragging ? 'transform 0s' : 'transform 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            }}
          >
            <ChevronsRight size={22} className="stroke-[2.5] animate-pulse" />
          </div>
        )}
      </div>

      {/* Micro Info Below Slider */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 mt-2">
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles size={12} className="text-emerald-400" />
          {tierName} • Flat {fare}
        </span>
        <span className="text-slate-500">PCE Zero-Surge Guarantee</span>
      </div>
    </div>
  );
}
