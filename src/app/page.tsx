'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Car,
  MapPin,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button, Badge } from '@/components/ui';
import { AppleIntro } from '@/components/layout/AppleIntro';

// Social Icon Components with precise SVG paths
function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.953 1.179-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.783-1.674-2.084-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.928-2.232-.244-.587-.493-.507-.677-.516-.175-.009-.376-.009-.577-.009-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.479 1.078 2.908 1.228 3.109.15.2 2.122 3.24 5.14 4.544.718.31 1.279.495 1.716.634.721.23 1.377.197 1.896.12.578-.087 1.78-.727 2.031-1.429.251-.702.251-1.303.176-1.429-.076-.126-.276-.201-.577-.352zm-5.467 7.422h-.005a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884z" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: Shield,
    title: 'Verified Students Only',
    desc: 'Institutional email required. Every rider and driver is a verified campus student with college badge.',
  },
  {
    icon: Zap,
    title: 'Zero Profit Model',
    desc: 'Strict cost-sharing formula. You pay only your fair share of fuel — zero surge pricing or commissions.',
  },
  {
    icon: Users,
    title: 'Peer-to-Peer Carpooling',
    desc: 'No middleman. Connect directly with fellow classmates heading to the same metro or campus gate.',
  },
  {
    icon: MapPin,
    title: 'Campus-First Routes',
    desc: 'Optimized specifically for campus gates, nearby metro stations, and central transit corridors.',
  },
];

const STATS = [
  { value: '2,400+', label: 'Students Saved' },
  { value: '₹180', label: 'Avg Trip Savings' },
  { value: '98%', label: 'Safety Rating' },
  { value: '12+', label: 'Campus Routes' },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [carPosition, setCarPosition] = useState(15);
  const [showIntro, setShowIntro] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  // Failsafe timer: ensures page is always revealed even on slow devices
  useEffect(() => {
    const failsafe = setTimeout(() => {
      setIsRevealed(true);
    }, 1600);
    return () => clearTimeout(failsafe);
  }, []);

  // Animated car commute progression along route line (starts after intro reveals)
  useEffect(() => {
    if (showIntro) return;
    const interval = setInterval(() => {
      setCarPosition(prev => (prev >= 85 ? 15 : prev + 1.2));
    }, 100);
    return () => clearInterval(interval);
  }, [showIntro]);

  const handleReplayIntro = useCallback(() => {
    setIsRevealed(false);
    setShowIntro(true);
  }, []);

  const handleTransitionStart = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setIsRevealed(true);
  }, []);

  const creatorSocials = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      url: 'https://www.instagram.com/',
      hoverStyle: 'hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400',
      tag: '@ayushutane',
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      url: 'https://www.facebook.com/',
      hoverStyle: 'hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400',
      tag: 'Ayush Utane',
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      url: 'https://wa.me/?text=Hi%20Ayush!%20I%20am%20reaching%20out%20from%20Campus%20Ride.',
      hoverStyle: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400',
      tag: 'Chat Directly',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 relative overflow-hidden">
      {/* Apple-style Cinematic Camera Portal Zoom Starting Animation */}
      {showIntro && (
        <AppleIntro
          onTransitionStart={handleTransitionStart}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Synchronized Portal Reveal Wrapper */}
      <div
        className="origin-center"
        style={{
          opacity: isRevealed || !showIntro ? 1 : 0,
          transform: isRevealed || !showIntro ? 'scale3d(1, 1, 1)' : 'scale3d(0.97, 0.97, 1)',
          transition: 'opacity 700ms cubic-bezier(0.65, 0, 0.35, 1), transform 700ms cubic-bezier(0.65, 0, 0.35, 1)',
          willChange: 'opacity, transform',
        }}
      >
        {/* Background Animated Gradients & Mesh */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-teal-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-700/10 rounded-full blur-[120px]" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Top Navbar */}
        <nav className="relative flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full z-20 apple-stagger-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shadow-lg emerald-glow-sm animate-float">
              <Car size={20} className="text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight">
                Campus<span className="text-gradient">Ride</span>
              </span>
              <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-wider">
                By Ayush Utane
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Replay Apple Intro Trigger */}
            <button
              onClick={handleReplayIntro}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Replay Apple-style keynote zoom transition"
            >
              <Sparkles size={12} className="text-emerald-400" />
              <span className="hidden sm:inline">Replay Intro</span>
            </button>
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-zinc-400 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="emerald-glow-sm hover:scale-105 transition-transform" iconRight={<ArrowRight size={14} />}>
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

      {/* Hero Section with Apple Staggered Blur-Up Reveal */}
      <section className="relative px-6 pt-12 pb-20 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs font-semibold text-emerald-400 mb-8 animate-float shadow-lg shadow-emerald-500/5 apple-stagger-2">
          <Sparkles size={14} className="animate-spin text-emerald-300" style={{ animationDuration: '6s' }} />
          <span>Created by Ayush Utane — Smart Campus Ride Sharing</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl apple-stagger-2">
          Your Campus Ride, <br />
          <span className="text-gradient animate-gradient-text">Shared & Seamless</span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed font-normal apple-stagger-3">
          Car-pool between <span className="text-emerald-400 font-semibold">Campus Gates</span> and{' '}
          <span className="text-emerald-400 font-semibold">Transit Metro Stations</span> with verified students.
          Fair cost-split, zero surge pricing, and 100% verified peers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto justify-center apple-stagger-3">
          <Link href="/auth" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold emerald-glow-sm hover:scale-105 active:scale-95 transition-all"
              iconRight={<ArrowRight size={18} />}
            >
              Start Commuting Now
            </Button>
          </Link>
          <Link href="/rides/browse" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-medium border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900 transition-all"
            >
              Browse Active Rides
            </Button>
          </Link>
        </div>

        {/* Live Route Interactive Animation Card */}
        <div className="w-full max-w-3xl glass rounded-3xl p-6 md:p-8 border border-zinc-800/80 shadow-2xl relative overflow-hidden mb-16 apple-card-glow apple-stagger-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-zinc-300">Live Campus Corridor Simulation</span>
            </div>
            <Badge variant="emerald" size="sm">Active Split: ₹45 / seat</Badge>
          </div>

          {/* Animated Route Line */}
          <div className="relative py-7 px-4">
            {/* Background Road Track */}
            <div className="h-2 w-full bg-zinc-800 rounded-full relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150"
                style={{ width: `${carPosition}%` }}
              />
            </div>

            {/* Start Node */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center shadow-md">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-medium text-zinc-400 mt-2 absolute -bottom-5 whitespace-nowrap">
                Main Campus Gate (A)
              </span>
            </div>

            {/* Moving Car Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-150"
              style={{ left: `${carPosition}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-9 h-9 rounded-xl gradient-emerald shadow-lg flex items-center justify-center emerald-glow-sm">
                <Car size={18} className="text-white animate-bounce" style={{ animationDuration: '1.2s' }} />
              </div>
            </div>

            {/* Destination Node */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-teal-400 flex items-center justify-center shadow-md">
                <MapPin size={12} className="text-teal-400" />
              </div>
              <span className="text-[11px] font-medium text-zinc-400 mt-2 absolute -bottom-5 whitespace-nowrap">
                City Centre Metro
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 text-center">
            <div>
              <p className="text-[10px] text-zinc-500 font-medium">EST. DURATION</p>
              <p className="text-sm font-bold text-zinc-200 flex items-center justify-center gap-1 mt-0.5">
                <Clock size={12} className="text-emerald-400" /> 12 mins
              </p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-medium">AVERAGE SAVINGS</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">₹135 vs Cab</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-medium">PEER SECURITY</p>
              <p className="text-sm font-bold text-teal-300 mt-0.5">100% Verified</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="glass rounded-2xl p-4 text-center border border-zinc-800 hover:border-emerald-500/30 transition-all card-hover"
            >
              <p className="text-2xl sm:text-3xl font-black text-gradient">{value}</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Engineered Exclusively for Students
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            Every feature is tailored to eliminate expensive auto fares and unsafe public commutes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 border border-zinc-800 hover:border-emerald-500/40 transition-all duration-300 card-hover group relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl gradient-emerald flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg emerald-glow-sm">
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-zinc-100 text-lg mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* CREATOR SHOWCASE SECTION (AYUSH UTANE) */}
      {/* ============================================================ */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 glass border border-emerald-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 shadow-2xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            {/* Creator Avatar with Animated Aura */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl gradient-emerald p-1 shadow-2xl animate-pulse-glow">
                <div className="w-full h-full rounded-[22px] bg-zinc-900 flex flex-col items-center justify-center text-emerald-400">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">AU</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Creator</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-zinc-950 rounded-full p-1.5 shadow-lg">
                <CheckCircle2 size={16} strokeWidth={3} />
              </div>
            </div>

            {/* Creator Details */}
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs font-semibold text-emerald-400">
                <Code2 size={13} />
                <span>Project Architect & Creator</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-zinc-100 tracking-tight">
                Ayush Utane
              </h3>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Passionate software developer and innovator. Ayush conceived and developed{' '}
                <span className="text-emerald-400 font-semibold">Campus Ride</span> to empower college
                students with safe, peer-verified, and economical daily campus travel.
              </p>

              {/* Creator Taglines & Skills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-300 font-medium">
                  🚀 Full-Stack Engineering
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-300 font-medium">
                  🛡️ Campus Safety Focus
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-300 font-medium">
                  🌱 Sustainable Mobility
                </span>
              </div>

              {/* Functional Social Media Links for Ayush Utane */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Connect with Ayush:
                </span>
                <div className="flex items-center gap-2.5">
                  {creatorSocials.map(social => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${social.name}`}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 transition-all duration-200 card-hover ${social.hoverStyle}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-semibold">{social.name}</span>
                        <ExternalLink size={11} className="opacity-60" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Commute CTA Card */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-10 sm:p-14 border border-zinc-800 relative overflow-hidden emerald-glow">
          <div className="w-14 h-14 rounded-2xl gradient-emerald flex items-center justify-center mx-auto mb-6 shadow-xl emerald-glow-sm animate-float">
            <Car size={26} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Transform Your Campus Ride?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm sm:text-base">
            Join verified students already sharing rides and saving money every single day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base emerald-glow-sm" iconRight={<ArrowRight size={18} />}>
                Join Campus Ride
              </Button>
            </Link>
            <a
              href="https://wa.me/?text=Hi%20Ayush,%20I%20want%20to%20know%20more%20about%20Campus%20Ride!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-sm font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Modern Footer with Creator Tribute and Socials */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Creator Credit */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-emerald-400" />
              <span className="font-bold text-base text-zinc-200">Campus Ride</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">
                Created by <strong className="text-emerald-400 font-semibold">Ayush Utane</strong>
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              © 2026 Campus Ride. Peer-to-peer student carpooling platform.
            </p>
          </div>

          {/* Replay intro and Fully Functional Social Icons in Footer */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowIntro(true)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={12} className="text-emerald-400" />
              <span>Replay Intro</span>
            </button>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram profile"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all card-hover"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook profile"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all card-hover"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/?text=Hi%20Ayush,%20I%20love%20the%20Campus%20Ride%20platform!"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp chat"
              className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all card-hover"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
