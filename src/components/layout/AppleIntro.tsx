'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Car, Sparkles } from 'lucide-react';

interface AppleIntroProps {
  onTransitionStart?: () => void;
  onComplete?: () => void;
}

export function AppleIntro({ onTransitionStart, onComplete }: AppleIntroProps) {
  const [isZooming, setIsZooming] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const isTriggeredRef = useRef(false);

  const dismiss = useCallback(() => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;

    setIsZooming(true);
    onTransitionStart?.();

    // Smooth camera expansion, then remove the intro.
    setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, 400);
  }, [onTransitionStart, onComplete]);

  useEffect(() => {
    // Keep the intro brief so the landing page appears quickly.
    const autoTimer = setTimeout(() => {
      dismiss();
    }, 800);

    return () => clearTimeout(autoTimer);
  }, [dismiss]);

  const handleManualSkip = () => {
    dismiss();
  };

  if (isDone) return null;

  return (
    <div
      onClick={handleManualSkip}
      className={`fixed inset-0 z-[100] bg-[#040406] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-opacity duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        isZooming ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    >
      {/* Ambient Spotlight Background Flare */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ease-out ${
          isZooming ? 'opacity-0' : 'opacity-100 animate-pulse-slow'
        }`}
      />

      {/* Top-Right Instant Skip Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          handleManualSkip();
        }}
        className={`absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-lg ${
          isZooming ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <span>Enter Site</span>
        <span className="text-[10px] text-emerald-400 font-bold">→</span>
      </button>

      {/* Center Stage Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* TIER 1: ZOOM PORTAL CONTAINER */}
        <div
          className="relative mb-8"
          style={{
            transformOrigin: 'center center',
            transform: isZooming ? 'scale3d(24, 24, 1)' : 'scale3d(1, 1, 1)',
            opacity: isZooming ? 0 : 1,
            transition: isZooming
              ? 'transform 400ms cubic-bezier(0.65, 0, 0.35, 1), opacity 200ms ease 200ms'
              : 'none',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* TIER 2: SQUIRCLE EMBLEM */}
          <div
            className={`w-20 h-20 rounded-[28px] bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 p-[1.5px] shadow-2xl ${
              isZooming ? '' : 'animate-squircle-breathe'
            }`}
          >
            <div className="w-full h-full rounded-[26px] bg-zinc-950 flex items-center justify-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
              <Car
                size={34}
                className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]"
              />
            </div>
          </div>

          {/* Floor shadow */}
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-emerald-500/25 rounded-full blur-sm transition-opacity duration-300 ${
              isZooming ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Text Container */}
        <div
          className={`flex flex-col items-center transition-all duration-300 ease-out ${
            isZooming
              ? 'opacity-0 -translate-y-3 pointer-events-none'
              : 'opacity-100 translate-y-0'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Shimmering Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 apple-shine-text leading-tight">
            Campus Ride
          </h1>

          {/* Creator Subtitle */}
          <p className="text-xs sm:text-sm font-medium text-zinc-400 tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Engineered by <strong className="text-zinc-200 font-semibold">Ayush Utane</strong>
            </span>
          </p>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div
        className={`absolute bottom-6 text-[11px] text-zinc-600 flex items-center gap-1.5 tracking-wider font-medium transition-all duration-300 ease-out ${
          isZooming ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
        style={{ willChange: 'opacity, transform' }}
      >
        <Sparkles size={11} className="text-emerald-500" />
        <span>SMART PEER-TO-PEER CAMPUS TRANSIT • TAP TO ENTER</span>
      </div>
    </div>
  );
}
