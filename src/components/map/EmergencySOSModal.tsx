'use client';
import { useState } from 'react';
import { ShieldAlert, Phone, AlertTriangle, X, Check, Share2, MapPin } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation?: string;
}

export function EmergencySOSModal({ isOpen, onClose, userLocation = 'Near Campus Gate 1, Hingna Road' }: EmergencySOSModalProps) {
  const [copied, setCopied] = useState(false);
  const [beaconActive, setBeaconActive] = useState(false);

  if (!isOpen) return null;

  const handleShareBeacon = () => {
    navigator.clipboard.writeText(`EMERGENCY SOS: My current location is ${userLocation}. Campus Ride Live Beacon: https://campusride.local/sos-live`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl shadow-rose-950/50 p-6 text-slate-100">
        {/* Glow ambient accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 animate-pulse">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                Emergency & Safety
              </h3>
              <p className="text-xs text-rose-400 font-medium">Campus Ride Rapid Assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Location Pill */}
        <div className="my-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5">
          <MapPin size={16} className="text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400">Broadcast Location:</span>
            <p className="font-semibold text-slate-200 mt-0.5">{userLocation}</p>
          </div>
        </div>

        {/* Direct Action Contacts */}
        <div className="space-y-2.5 mb-5">
          <a
            href="tel:112"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/25 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                112
              </div>
              <div>
                <p className="font-bold text-sm text-slate-100">National Police & Emergency</p>
                <p className="text-[11px] text-slate-400">Direct dispatch (Dial 112)</p>
              </div>
            </div>
            <Phone size={18} className="text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="tel:+917122240101"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-700 text-emerald-400 flex items-center justify-center">
                <ShieldAlert size={18} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-100">PCE Campus Security Control Room</p>
                <p className="text-[11px] text-slate-400">24x7 Campus Quick Response Team</p>
              </div>
            </div>
            <Phone size={18} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="tel:1091"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-700 text-rose-400 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-100">Women Student Helpline</p>
                <p className="text-[11px] text-slate-400">Toll-free 24x7 support (1091)</p>
              </div>
            </div>
            <Phone size={18} className="text-rose-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Live Location Share Button */}
        <div className="space-y-2">
          <button
            onClick={handleShareBeacon}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="text-emerald-400">Emergency Beacon Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={16} className="text-slate-400" />
                <span>Copy Real-time Live Beacon Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => setBeaconActive(!beaconActive)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium border transition-colors ${
              beaconActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-transparent text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            {beaconActive ? '● Silent Campus Alert Active' : 'Activate Silent Campus Security Alert'}
          </button>
        </div>
      </div>
    </div>
  );
}
