'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Divider } from '@/components/ui';
import { Mail, Lock, User, Phone, CreditCard, Car, Bike, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuthStore, SignupData } from '@/store/useAuthStore';
import { getEmailError } from '@/lib/auth-validator';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'signup';

export function AuthForm() {
  const router = useRouter();
  const { login, signup, isLoading, error, clearError } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState<SignupData & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    college_id: '',
    role: 'rider',
    vehicle_type: null,
    vehicle_number: '',
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const cleanEmail = loginForm.email.trim().toLowerCase();
    const err = getEmailError(cleanEmail);
    if (err) { setEmailError(err); return; }
    setEmailError(null);
    const ok = await login(cleanEmail, loginForm.password);
    if (ok) {
      router.push('/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);
    const cleanEmail = signupForm.email.trim().toLowerCase();
    const err = getEmailError(cleanEmail);
    if (err) { setEmailError(err); return; }
    if (!signupForm.full_name.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!signupForm.password) {
      setFormError('Password is required.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (signupForm.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if ((signupForm.role === 'driver' || signupForm.role === 'both') && !signupForm.vehicle_number?.trim()) {
      setFormError('Vehicle number is required for drivers.');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...data } = signupForm;
    const ok = await signup({
      ...data,
      email: cleanEmail,
      full_name: signupForm.full_name.trim(),
    });
    if (ok) {
      router.push('/dashboard');
    }
  };

  const switchMode = (m: AuthMode) => {
    clearError();
    setEmailError(null);
    setFormError(null);
    setMode(m);
  };

  const isDriver = signupForm.role === 'driver' || signupForm.role === 'both';

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">
      {/* Mode Tabs */}
      <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        {(['login', 'signup'] as const).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize',
              mode === m
                ? 'bg-emerald-500 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {m === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Error Banner */}
      {(error || formError) && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm fade-in">
          <Shield size={14} />
          {error || formError}
        </div>
      )}

      {/* Login Form */}
      {mode === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4 slide-up">
          <Input
            label="Institutional Email"
            type="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@student.university.edu"
            value={loginForm.email}
            onChange={e => { setLoginForm(f => ({ ...f, email: e.target.value })); setEmailError(null); }}
            error={emailError || undefined}
            icon={<Mail size={16} />}
            required
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={loginForm.password}
            onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
            icon={<Lock size={16} />}
            iconRight={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
          />
          <Button type="submit" className="w-full" size="lg" loading={isLoading} iconRight={<ArrowRight size={16} />}>
            Sign In
          </Button>
          <p className="text-center text-xs text-zinc-600">
            Demo: use any email ending in{' '}
            <span className="text-emerald-400">.edu</span> or{' '}
            <span className="text-emerald-400">.ac.in</span>
          </p>

          {/* Quick Demo Logins */}
          <div className="pt-3 border-t border-zinc-800/80">
            <p className="text-[11px] text-zinc-500 text-center mb-2 font-medium">⚡ 1-Click Quick Demo Sign-In</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={async () => {
                  const ok = await login('arjun.sharma@student.university.edu', 'demo123');
                  if (ok) router.push('/dashboard');
                }}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
              >
                <p className="text-xs font-semibold text-zinc-300 group-hover:text-emerald-400">🚗 Arjun (Admin)</p>
                <p className="text-[10px] text-zinc-500">Driver & Admin</p>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await login('priya.nair@student.university.edu', 'demo123');
                  if (ok) router.push('/dashboard');
                }}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left transition-all group cursor-pointer"
              >
                <p className="text-xs font-semibold text-zinc-300 group-hover:text-emerald-400">🎒 Priya (Rider)</p>
                <p className="text-[10px] text-zinc-500">Student Rider</p>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Signup Form */}
      {mode === 'signup' && (
        <form onSubmit={handleSignup} className="space-y-4 slide-up">
          <Input
            label="Full Name"
            placeholder="Arjun Sharma"
            value={signupForm.full_name}
            onChange={e => setSignupForm(f => ({ ...f, full_name: e.target.value }))}
            icon={<User size={16} />}
            required
          />
          <div className="space-y-1.5">
            <Input
              label="Institutional Email"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="you@student.university.edu"
              value={signupForm.email}
              onChange={e => { setSignupForm(f => ({ ...f, email: e.target.value })); setEmailError(null); }}
              error={emailError || undefined}
              icon={<Mail size={16} />}
              required
            />
            {/* Quick domain buttons for mobile convenience */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-zinc-500">Quick fill:</span>
              {['@student.university.edu', '@college.ac.in'].map(domain => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => {
                    const prefix = signupForm.email.split('@')[0] || (signupForm.full_name ? signupForm.full_name.toLowerCase().replace(/\s+/g, '.') : 'student');
                    setSignupForm(f => ({ ...f, email: `${prefix}${domain}` }));
                    setEmailError(null);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  +{domain}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="9876543210"
              value={signupForm.phone}
              onChange={e => setSignupForm(f => ({ ...f, phone: e.target.value }))}
              icon={<Phone size={16} />}
            />
            <Input
              label="College ID"
              placeholder="CS2021001"
              value={signupForm.college_id}
              onChange={e => setSignupForm(f => ({ ...f, college_id: e.target.value }))}
              icon={<CreditCard size={16} />}
            />
          </div>

          <Divider label="Role" />

          <div className="grid grid-cols-3 gap-2">
            {(['rider', 'driver', 'both'] as const).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setSignupForm(f => ({
                  ...f,
                  role,
                  vehicle_type: role === 'rider' ? null : f.vehicle_type || 'car',
                }))}
                className={cn(
                  'py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 capitalize',
                  signupForm.role === role
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                )}
              >
                {role}
              </button>
            ))}
          </div>

          {isDriver && (
            <>
              <Divider label="Vehicle Details" />
              <div className="grid grid-cols-2 gap-2">
                {(['car', 'bike'] as const).map(vtype => (
                  <button
                    key={vtype}
                    type="button"
                    onClick={() => setSignupForm(f => ({ ...f, vehicle_type: vtype }))}
                    className={cn(
                      'flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 capitalize',
                      signupForm.vehicle_type === vtype
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'border-zinc-800 text-zinc-500'
                    )}
                  >
                    {vtype === 'car' ? <Car size={14} /> : <Bike size={14} />}
                    {vtype}
                  </button>
                ))}
              </div>
              <Input
                label="Vehicle Number"
                placeholder="MH12AB1234"
                value={signupForm.vehicle_number}
                onChange={e => setSignupForm(f => ({ ...f, vehicle_number: e.target.value.toUpperCase() }))}
                icon={<Car size={16} />}
                required
              />
            </>
          )}

          <Divider label="Password" />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            value={signupForm.password}
            onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
            icon={<Lock size={16} />}
            required
            iconRight={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            value={signupForm.confirmPassword}
            onChange={e => setSignupForm(f => ({ ...f, confirmPassword: e.target.value }))}
            icon={<Lock size={16} />}
            required
          />

          <Button type="submit" className="w-full" size="lg" loading={isLoading} iconRight={<ArrowRight size={16} />}>
            Create Account
          </Button>

          {/* Quick Demo Signup */}
          <div className="pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={async () => {
                const randomNum = Math.floor(100 + Math.random() * 900);
                const ok = await signup({
                  email: `student${randomNum}@student.university.edu`,
                  password: 'password123',
                  full_name: `Student Demo ${randomNum}`,
                  phone: '9876543210',
                  college_id: `ID${randomNum}`,
                  role: 'rider',
                  vehicle_type: null,
                  vehicle_number: '',
                });
                if (ok) {
                  router.push('/dashboard');
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-center transition-all cursor-pointer"
            >
              <p className="text-xs font-semibold text-zinc-300 hover:text-emerald-400">⚡ 1-Tap Quick Demo Student Signup</p>
              <p className="text-[10px] text-zinc-500">Auto-generates student account and logs in instantly</p>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
