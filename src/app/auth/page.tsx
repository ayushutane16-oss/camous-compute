import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/AuthForm';
import { Car, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In | Campus Ride',
  description: 'Sign in or create your Campus Ride account with your institutional email.',
};

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel — branding */}
      <div className="hidden md:flex md:w-2/5 bg-zinc-900 border-r border-zinc-800 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

        <Link href="/" className="flex items-center gap-2 relative">
          <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center emerald-glow-sm">
            <Car size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl">Campus<span className="text-gradient">Ride</span></span>
        </Link>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Your ride,<br />
            <span className="text-gradient">shared & fair.</span>
          </h2>
          <p className="text-zinc-500 leading-relaxed">
            Connect with verified fellow students for cost-sharing campus rides. Safer, cheaper, greener.
          </p>
          <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <Shield size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-zinc-400">
              Only students with verified institutional email addresses can access the platform.
            </p>
          </div>
          <div className="space-y-3">
            {['Strict cost-sharing. Zero profit markup.', 'Contact unlocked only after booking acceptance.', 'Rate your driver/rider after each trip.'].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-700 relative">© 2026 Campus Ride</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 md:hidden">
          <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
            <Car size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl">Campus<span className="text-gradient">Ride</span></span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-zinc-100 mb-1">Welcome back</h1>
            <p className="text-sm text-zinc-500">Sign in with your institutional email to continue.</p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
