'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, PlusCircle, BookOpen, User, Bell, LogOut, Car, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/map', label: 'Live Map', icon: MapPin, highlight: true },
  { href: '/rides/browse', label: 'Browse', icon: Search },
  { href: '/rides/new', label: 'Offer', icon: PlusCircle },
  { href: '/bookings', label: 'Trips', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-zinc-800 md:hidden">
      <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, highlight }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition-all duration-200',
                active
                  ? 'text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <span className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200',
                active && 'bg-emerald-500/15 emerald-glow-sm',
                highlight && !active && 'text-emerald-400/90'
              )}>
                <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                {highlight && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                )}
                {label === 'Offer' && !highlight && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
                )}
              </span>
              <span className={cn('text-[9px] font-medium tracking-tight', active ? 'text-emerald-400' : 'text-zinc-500')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800/80 h-16 items-center px-6">
      <Link href="/dashboard" className="flex items-center gap-2 mr-8">
        <div className="w-8 h-8 rounded-xl gradient-emerald flex items-center justify-center">
          <Car size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">
          Campus<span className="text-gradient">Ride</span>
        </span>
      </Link>

      <div className="flex items-center gap-1 flex-1">
        {[
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/map', label: '⚡ Live Map Engine' },
          { href: '/rides/browse', label: 'Browse Rides' },
          { href: '/rides/new', label: 'Offer a Ride' },
          { href: '/bookings', label: 'My Trips' },
        ].map(({ href, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              )}
            >
              {label}
            </Link>
          );
        })}
        {currentUser?.role !== 'rider' && (
          <Link href="/admin" className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            pathname.startsWith('/admin')
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          )}>Admin</Link>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center text-white text-sm font-bold">
            {currentUser?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-zinc-200">{currentUser?.full_name || 'Student'}</p>
            <p className="text-[10px] text-zinc-500">{currentUser?.college_id}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-0 md:pt-16 pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
