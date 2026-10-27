'use client';
import { useState } from 'react';
import { RideFilters as RideFiltersType } from '@/types';
import { Input, Select, Button } from '@/components/ui';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { METRO_DESTINATIONS } from '@/types';
import { useRideStore } from '@/store/useRideStore';
import { cn } from '@/lib/utils';

export function RideFilters() {
  const { filters, setFilters } = useRideStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  const clearFilters = () => setFilters({
    destination: undefined,
    minSeats: undefined,
    maxCost: undefined,
    sortBy: undefined,
  });

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          icon={<Search size={16} />}
          placeholder="Search destinations..."
          value={filters.destination || ''}
          onChange={e => setFilters({ destination: e.target.value || undefined })}
          className="flex-1"
        />
        <Button
          variant={showAdvanced ? 'outline' : 'secondary'}
          size="md"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex-shrink-0 relative"
          icon={<SlidersHorizontal size={16} />}
        >
          <span className="hidden sm:inline">Filter</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="md" onClick={clearFilters} icon={<X size={16} />}>
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Quick Destination Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {METRO_DESTINATIONS.slice(0, 5).map(dest => (
          <button
            key={dest}
            onClick={() => setFilters({ destination: filters.destination === dest ? undefined : dest })}
            className={cn(
              'flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
              filters.destination === dest
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
            )}
          >
            <MapPin size={10} />
            {dest.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl fade-in">
          <Select
            label="Destination"
            value={filters.destination || ''}
            onChange={e => setFilters({ destination: e.target.value || undefined })}
            options={[
              { value: '', label: 'All destinations' },
              ...METRO_DESTINATIONS.map(d => ({ value: d, label: d })),
            ]}
            icon={<MapPin size={14} />}
          />
          <Select
            label="Sort By"
            value={filters.sortBy || 'departure_time'}
            onChange={e => setFilters({ sortBy: e.target.value as RideFiltersType['sortBy'] })}
            options={[
              { value: 'departure_time', label: 'Departure Time' },
              { value: 'cost_per_seat', label: 'Lowest Cost' },
              { value: 'available_seats', label: 'Most Seats' },
            ]}
          />
          <Input
            label="Min seats needed"
            type="number"
            min={1}
            max={6}
            placeholder="1"
            value={filters.minSeats || ''}
            onChange={e => setFilters({ minSeats: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>
      )}
    </div>
  );
}
