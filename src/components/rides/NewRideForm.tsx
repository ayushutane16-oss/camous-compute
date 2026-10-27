'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Select, Button, Card } from '@/components/ui';
import { MapPin, Clock, Users, IndianRupee, ArrowRight, Info, Car } from 'lucide-react';
import { CAMPUS_ORIGINS, METRO_DESTINATIONS } from '@/types';
import { calculateCostShare, getDistance, estimateSavings } from '@/lib/cost-calculator';
import { useAuthStore } from '@/store/useAuthStore';
import { useRideStore } from '@/store/useRideStore';
import { cn } from '@/lib/utils';

const STEPS = ['Route', 'Schedule', 'Seats & Cost', 'Review'];

export function NewRideForm() {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const { createRide, isLoading } = useRideStore();

  const [step, setStep] = useState(0);

  const [minDate, setMinDate] = useState('');
  const [quickSlots, setQuickSlots] = useState<{ offset: number; label: string; timeStr: string; isoVal: string }[]>([]);

  const [form, setForm] = useState<{
    origin: string;
    destination: string;
    departure_time: string;
    total_seats: number;
    notes: string;
  }>({
    origin: CAMPUS_ORIGINS[0],
    destination: METRO_DESTINATIONS[0],
    departure_time: '',
    total_seats: 3,
    notes: '',
  });

  useEffect(() => {
    const now = Date.now();
    const min = new Date(now).toISOString().slice(0, 16);
    setMinDate(min);

    const d = new Date(now + 30 * 60000);
    d.setSeconds(0, 0);
    const def = d.toISOString().slice(0, 16);
    setForm(f => ({ ...f, departure_time: f.departure_time || def }));

    const slots = [-15, 0, 15].map(offset => {
      const ms = now + (offset + 30) * 60000;
      const slotD = new Date(ms);
      slotD.setSeconds(0, 0);
      const label = offset === 0 ? 'Now +30m' : offset > 0 ? `+${offset}m` : `${offset}m`;
      const timeStr = slotD.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      const isoVal = slotD.toISOString().slice(0, 16);
      return { offset, label, timeStr, isoVal };
    });
    setQuickSlots(slots);
  }, []);

  const distance = getDistance(form.origin, form.destination);
  const costPerSeat = calculateCostShare(distance, form.total_seats);
  const savings = estimateSavings(distance, form.total_seats);

  const update = (field: string, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!currentUser) return;
    const ride = await createRide({
      driver_id: currentUser.id,
      origin: form.origin,
      destination: form.destination,
      departure_time: new Date(form.departure_time).toISOString(),
      total_seats: form.total_seats,
      cost_per_seat: costPerSeat,
      distance_km: distance,
      notes: form.notes,
    });
    if (ride) router.push('/dashboard');
  };

  const isStepValid = () => {
    if (step === 0) return form.origin && form.destination && form.origin !== form.destination;
    if (step === 1) return form.departure_time && new Date(form.departure_time) > new Date();
    if (step === 2) return form.total_seats >= 1 && form.total_seats <= 6;
    return true;
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                i < step ? 'bg-emerald-500 border-emerald-500 text-white' :
                i === step ? 'border-emerald-500 text-emerald-400' :
                'border-zinc-700 text-zinc-600'
              )}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={cn('text-[9px] font-medium mt-1 hidden sm:block', i === step ? 'text-emerald-400' : 'text-zinc-600')}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-px transition-colors duration-300', i < step ? 'bg-emerald-500' : 'bg-zinc-800')} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-5 fade-in">
        {/* Step 0 — Route */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-200">Where are you going?</h3>
            <Select
              label="Pickup Point (Campus Gate)"
              value={form.origin}
              onChange={e => update('origin', e.target.value)}
              options={CAMPUS_ORIGINS.map(o => ({ value: o, label: o }))}
              icon={<MapPin size={14} />}
            />
            <Select
              label="Drop-off Hub (Transit Station)"
              value={form.destination}
              onChange={e => update('destination', e.target.value)}
              options={METRO_DESTINATIONS.map(d => ({ value: d, label: d }))}
              icon={<MapPin size={14} />}
            />
            {form.origin && form.destination && form.origin !== form.destination && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <Info size={14} className="text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-emerald-400">Route distance: ~{distance} km</p>
              </div>
            )}
          </div>
        )}

        {/* Step 1 — Schedule */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-200">When are you leaving?</h3>
            <Input
              label="Departure Time"
              type="datetime-local"
              value={form.departure_time}
              onChange={e => update('departure_time', e.target.value)}
              icon={<Clock size={14} />}
              min={minDate}
            />
            <div className="grid grid-cols-3 gap-2">
              {quickSlots.map(({ offset, label, timeStr, isoVal }) => (
                <button
                  key={offset}
                  onClick={() => update('departure_time', isoVal)}
                  className="py-2 px-3 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                >
                  {label}
                  <p className="text-[9px] mt-0.5 text-zinc-600">{timeStr}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Seats & Cost */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-200">How many passengers?</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Available Seats</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => update('total_seats', Math.max(1, form.total_seats - 1))}
                  className="w-10 h-10 rounded-xl border border-zinc-800 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 flex items-center justify-center text-lg transition-all"
                >
                  −
                </button>
                <div className="flex-1 text-center py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <span className="text-2xl font-bold text-emerald-400">{form.total_seats}</span>
                  <p className="text-xs text-zinc-500">{form.total_seats === 1 ? 'seat' : 'seats'}</p>
                </div>
                <button
                  onClick={() => update('total_seats', Math.min(6, form.total_seats + 1))}
                  className="w-10 h-10 rounded-xl border border-zinc-800 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 flex items-center justify-center text-lg transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Cost Preview */}
            <div className="p-4 bg-zinc-900/60 border border-emerald-500/20 rounded-xl space-y-2">
              <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <IndianRupee size={12} />Fair Cost Calculation
              </p>
              <div className="text-xs text-zinc-500 space-y-1">
                <div className="flex justify-between">
                  <span>Distance × Fuel Rate</span>
                  <span className="text-zinc-400">{distance}km × ₹8.5 = ₹{(distance * 8.5).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>÷ (Passengers + You)</span>
                  <span className="text-zinc-400">÷ {form.total_seats + 1}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <span className="text-sm font-semibold text-zinc-200">Cost per seat</span>
                <span className="text-xl font-bold text-emerald-400">₹{costPerSeat}</span>
              </div>
              <p className="text-[10px] text-zinc-600">Each passenger saves ~₹{savings} vs auto-rickshaw</p>
            </div>

            <Input
              label="Notes (optional)"
              placeholder="e.g. AC car, music on request, ladies only..."
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
            />
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-200">Review your ride</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: MapPin, label: 'From', value: form.origin },
                { icon: MapPin, label: 'To', value: form.destination },
                { icon: Clock, label: 'Departure', value: new Date(form.departure_time).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) },
                { icon: Users, label: 'Seats', value: `${form.total_seats} passengers` },
                { icon: IndianRupee, label: 'Cost per seat', value: `₹${costPerSeat}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-zinc-800/50">
                  <Icon size={14} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-zinc-500 w-24">{label}</span>
                  <span className="text-zinc-200 font-medium">{value}</span>
                </div>
              ))}
              {form.notes && (
                <div className="flex items-start gap-3 py-2">
                  <Info size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-500 w-24">Notes</span>
                  <span className="text-zinc-300 italic">&quot;{form.notes}&quot;</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <Info size={14} className="text-emerald-400" />
              <p className="text-xs text-zinc-400">
                By publishing, you confirm this is a cost-sharing ride with zero profit markup. Verified student contacts are unlocked only after booking confirmation.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="flex-1">
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            className="flex-1"
            disabled={!isStepValid()}
            onClick={() => setStep(s => s + 1)}
            iconRight={<ArrowRight size={16} />}
          >
            Continue
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={handleSubmit}
            loading={isLoading}
            icon={<Car size={16} />}
          >
            Publish Ride
          </Button>
        )}
      </div>
    </div>
  );
}
