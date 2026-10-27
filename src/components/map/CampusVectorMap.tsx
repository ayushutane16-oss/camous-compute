'use client';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface CampusVectorMapProps {
  onSelectTier?: (tierId: string) => void;
  selectedTierId?: string;
  isConfirmed?: boolean;
}

// Coordinates for PCE Campus to Khapri Metro Station corridor (Nagpur)
const CAMPUS_ORIGIN: [number, number] = [21.0995, 79.0525];
const METRO_DESTINATION: [number, number] = [21.0592, 79.0642];

// High-fidelity road vector coordinates connecting Campus Gate 1 to Khapri Metro Station
const ROUTE_COORDINATES: [number, number][] = [
  [21.0995, 79.0525], // Campus Gate 1
  [21.0968, 79.0542], // Campus Tech Corridor
  [21.0915, 79.0570], // Hingna Main Junction
  [21.0845, 79.0588], // Transit Link Road
  [21.0770, 79.0602], // Outer Ring Road Flyover
  [21.0695, 79.0618], // MIHAN Entry Connector
  [21.0640, 79.0630], // Metro Feeder Boulevard
  [21.0592, 79.0642], // Khapri Metro Station
];

export default function CampusVectorMap({
  onSelectTier,
  selectedTierId = 'tier-a',
  isConfirmed = false,
}: CampusVectorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const vehicleMarkersRef = useRef<{ [key: string]: any }>({});
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet client-side
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon assets
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '',
        iconUrl: '',
        shadowUrl: '',
      });

      // 1. Initialize Map with clean hygiene (no default zoom, no attribution chrome)
      const map = L.map(mapContainerRef.current, {
        center: [21.079, 79.058],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
      });

      mapInstanceRef.current = map;

      // 2. Base Viewport: CartoDB Dark Matter edge-to-edge dark vector map canvas
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        opacity: 0.95,
      }).addTo(map);

      // Fit bounds to show both Origin and Destination with comfortable padding for bottom sheet
      const bounds = L.latLngBounds([CAMPUS_ORIGIN, METRO_DESTINATION]);
      map.fitBounds(bounds, {
        paddingTopLeft: [60, 50],
        paddingBottomRight: [60, 240], // extra bottom clearance for bottom sheet
      });

      // 3. Crisp Neon Emerald Polyline (#00E599) with directional glow & pulse
      const polyline = L.polyline(ROUTE_COORDINATES, {
        color: '#00E599',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'neon-polyline-glow animate-neon-pulse',
      }).addTo(map);

      // Ambient outer polyline glow aura
      L.polyline(ROUTE_COORDINATES, {
        color: '#00E599',
        weight: 12,
        opacity: 0.22,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // 4. Origin Pin: Glowing green pulse radar marker labeled "Campus Main Gate"
      const originIcon = L.divIcon({
        className: 'custom-origin-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <!-- Radar ping ripples -->
            <span class="absolute w-10 h-10 rounded-full bg-emerald-400 opacity-30 animate-ping"></span>
            <span class="absolute w-7 h-7 rounded-full bg-emerald-500/40 animate-pulse"></span>
            
            <!-- Origin Center Core -->
            <div class="relative z-10 w-4 h-4 rounded-full bg-[#00E599] border-2 border-slate-950 shadow-lg shadow-emerald-400/80"></div>
            
            <!-- Origin Pill Label -->
            <div class="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-2xl flex items-center gap-1.5 pointer-events-none">
              <span class="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse"></span>
              <span class="text-[11px] font-bold text-slate-100 tracking-tight">Campus Main Gate</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker(CAMPUS_ORIGIN, { icon: originIcon, zIndexOffset: 1000 }).addTo(map);

      // 5. Destination Pin: Clean white pill marker with a metro glyph labeled "Khapri Metro"
      const destIcon = L.divIcon({
        className: 'custom-dest-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <!-- Outer beacon ring -->
            <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/40 shadow-lg">
              <div class="w-3 h-3 rounded-full bg-white shadow-sm"></div>
            </div>
            
            <!-- Destination Pill Label -->
            <div class="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-950 px-3 py-1 rounded-full font-bold text-[11px] shadow-2xl flex items-center gap-1.5 border border-slate-200 pointer-events-none">
              <span class="text-xs">🚇</span>
              <span class="tracking-tight">Khapri Metro</span>
              <span class="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1 rounded">Hub</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker(METRO_DESTINATION, { icon: destIcon, zIndexOffset: 1000 }).addTo(map);

      // 6. Moving Simulated Vehicles: 2 to 3 campus carpool vehicle markers gently moving along road vectors
      // Vehicle 1: Rahul T. - Campus BikePool
      const bikeIcon = L.divIcon({
        className: 'custom-vehicle-bike',
        html: `
          <div class="group cursor-pointer relative flex items-center justify-center">
            <div class="w-9 h-9 rounded-2xl bg-slate-950/90 border border-emerald-500/80 shadow-lg shadow-emerald-950 flex items-center justify-center text-[#00E599] transition-transform hover:scale-110">
              <!-- Custom SVG Bike Silhouette -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18.5" cy="17.5" r="3.5"/>
                <circle cx="5.5" cy="17.5" r="3.5"/>
                <circle cx="15" cy="5" r="1"/>
                <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
              </svg>
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-slate-700/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-400">
              Rahul • 3m
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Vehicle 2: Priya S. - Campus CarShare
      const carIcon = L.divIcon({
        className: 'custom-vehicle-car',
        html: `
          <div class="group cursor-pointer relative flex items-center justify-center">
            <div class="w-9 h-9 rounded-2xl bg-slate-950/90 border border-emerald-400/60 shadow-lg shadow-emerald-950 flex items-center justify-center text-slate-100 transition-transform hover:scale-110">
              <!-- Custom SVG Car Silhouette -->
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-slate-700/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-200">
              Priya • 6m
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Vehicle 3: Campus AutoShare
      const autoIcon = L.divIcon({
        className: 'custom-vehicle-auto',
        html: `
          <div class="group cursor-pointer relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-2xl bg-slate-950/90 border border-amber-500/60 shadow-lg flex items-center justify-center text-amber-400 transition-transform hover:scale-110">
              <!-- Auto glyph -->
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 border border-slate-700/80 px-1 py-0.5 rounded text-[8px] font-bold text-amber-400">
              Amit • 4m
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const markerBike = L.marker([21.0915, 79.0570], { icon: bikeIcon }).addTo(map);
      const markerCar = L.marker([21.0770, 79.0602], { icon: carIcon }).addTo(map);
      const markerAuto = L.marker([21.0640, 79.0630], { icon: autoIcon }).addTo(map);

      markerBike.on('click', () => onSelectTier?.('tier-a'));
      markerCar.on('click', () => onSelectTier?.('tier-b'));
      markerAuto.on('click', () => onSelectTier?.('tier-c'));

      vehicleMarkersRef.current = {
        bike: markerBike,
        car: markerCar,
        auto: markerAuto,
      };

      setMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onSelectTier]);

  // Gentle vehicle animation along road vector coordinates
  useEffect(() => {
    if (!mapReady) return;

    let t = 0;
    const interval = setInterval(() => {
      t += 0.02;
      const markers = vehicleMarkersRef.current;
      if (!markers.bike || !markers.car || !markers.auto) return;

      // Interpolate along route slices
      // Bike gently patrols near origin/corridor (index 1 to 3)
      const bikeProgress = 0.5 + Math.sin(t) * 0.35; // 0.15 to 0.85
      const p1 = ROUTE_COORDINATES[1];
      const p2 = ROUTE_COORDINATES[3];
      const bikeLat = p1[0] + (p2[0] - p1[0]) * bikeProgress;
      const bikeLng = p1[1] + (p2[1] - p1[1]) * bikeProgress;
      markers.bike.setLatLng([bikeLat, bikeLng]);

      // Car patrols mid corridor (index 3 to 6)
      const carProgress = 0.5 + Math.cos(t * 0.8) * 0.4;
      const p3 = ROUTE_COORDINATES[3];
      const p4 = ROUTE_COORDINATES[6];
      const carLat = p3[0] + (p4[0] - p3[0]) * carProgress;
      const carLng = p3[1] + (p4[1] - p3[1]) * carProgress;
      markers.car.setLatLng([carLat, carLng]);

      // Auto patrols near destination (index 5 to 7)
      const autoProgress = 0.5 + Math.sin(t * 0.9 + 1) * 0.4;
      const p5 = ROUTE_COORDINATES[5];
      const p6 = ROUTE_COORDINATES[7];
      const autoLat = p5[0] + (p6[0] - p5[0]) * autoProgress;
      const autoLng = p5[1] + (p6[1] - p5[1]) * autoProgress;
      markers.auto.setLatLng([autoLat, autoLng]);
    }, 150);

    return () => clearInterval(interval);
  }, [mapReady]);

  // Recenter handler exposed via custom event or ref
  useEffect(() => {
    const handleRecenter = () => {
      if (!mapInstanceRef.current) return;
      const bounds = [CAMPUS_ORIGIN, METRO_DESTINATION];
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: [60, 50],
        paddingBottomRight: [60, 240],
      });
    };
    window.addEventListener('recenter-campus-map', handleRecenter);
    return () => window.removeEventListener('recenter-campus-map', handleRecenter);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#020617]">
      {/* 1. Base Viewport Vector Map Canvas */}
      <div
        ref={mapContainerRef}
        id="campus-leaflet-canvas"
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* 2. Global Ambient Dark Obsidian Vignette (#020617) around viewport edges */}
      <div className="absolute inset-0 pointer-events-none z-10 obsidian-vignette opacity-90" />

      {/* Top subtle fade gradient for clean header readability */}
      <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-10 bg-gradient-to-b from-[#020617] via-[#020617]/70 to-transparent" />

      {/* Bottom subtle fade for seamless sheet transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
    </div>
  );
}
