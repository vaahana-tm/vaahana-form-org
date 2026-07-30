import React, { useRef, useEffect } from 'react';

/** Last selectable minute = 11:45 PM */
export const GLOBAL_MAX = 1425;
const STEP = 15;

/** Format minutes-since-midnight → "H:MM AM/PM" */
export function formatMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

interface DualTimeSliderProps {
  globalMin: number;
  arrivalMin: number;
  departureMin: number;
  lockArrival?: boolean;
  onChange: (arrival: number, departure: number) => void;
}

export const DualTimeSlider: React.FC<DualTimeSliderProps> = ({
  globalMin,
  arrivalMin,
  departureMin,
  lockArrival = false,
  onChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<'arrival' | 'departure' | null>(null);

  const range = GLOBAL_MAX - globalMin || 1;
  const leftPct = ((arrivalMin - globalMin) / range) * 100;
  const rightPct = ((GLOBAL_MAX - departureMin) / range) * 100;
  const durationMin = departureMin - arrivalMin;

  // Use a ref to store the latest values of props to avoid stale closures in the window event listeners
  const stateRef = useRef({ arrivalMin, departureMin, globalMin, lockArrival, onChange, range });
  useEffect(() => {
    stateRef.current = { arrivalMin, departureMin, globalMin, lockArrival, onChange, range };
  }, [arrivalMin, departureMin, globalMin, lockArrival, onChange, range]);

  const updateVal = (clientX: number, thumb: 'arrival' | 'departure') => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    
    const { globalMin: gMin, range: rRange, arrivalMin: arr, departureMin: dep, lockArrival: lock, onChange: onChangeFn } = stateRef.current;
    const val = Math.round((gMin + pct * rRange) / STEP) * STEP;

    if (thumb === 'arrival') {
      if (lock) return;
      const newArrival = Math.max(gMin, Math.min(val, dep - STEP));
      onChangeFn(newArrival, dep);
    } else {
      const newDeparture = Math.max(arr + STEP, Math.min(val, GLOBAL_MAX));
      onChangeFn(arr, newDeparture);
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!activeThumbRef.current) return;
      updateVal(e.clientX, activeThumbRef.current);
    };

    const handlePointerUp = () => {
      if (!activeThumbRef.current) return;
      activeThumbRef.current = null;
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []); // Run once on mount

  const startDrag = (e: React.PointerEvent, thumb: 'arrival' | 'departure') => {
    e.preventDefault();
    e.stopPropagation();
    activeThumbRef.current = thumb;
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    updateVal(e.clientX, thumb);
  };

  return (
    <div className="space-y-3">
      {/* Time labels */}
      <div className="flex justify-between items-start px-0.5 select-none">
        <div>
          <p className="text-[9px] font-bold text-white/30 tracking-[0.15em] uppercase mb-0.5">Arrival</p>
          <p className={`text-sm font-poppins font-black ${lockArrival ? 'text-white/40' : 'text-blue-400'}`}>
            {formatMin(arrivalMin)}
            {lockArrival && <span className="text-[8px] font-normal text-white/20 ml-1 uppercase tracking-wider">locked</span>}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-bold text-white/20 tracking-wider uppercase mb-0.5">Duration</p>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 tracking-wider">
            {durationMin} min
          </span>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-white/30 tracking-[0.15em] uppercase mb-0.5">Departure</p>
          <p className="text-sm font-poppins font-black text-white">{formatMin(departureMin)}</p>
        </div>
      </div>

      {/* Track container */}
      <div className="relative h-8 flex items-center select-none touch-none">
        {/* Track bar */}
        <div 
          ref={trackRef}
          className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative"
          onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            
            const { globalMin: gMin, range: rRange, arrivalMin: arr, departureMin: dep, lockArrival: lock } = stateRef.current;
            const clickVal = gMin + pct * rRange;
            const distToArr = Math.abs(clickVal - arr);
            const distToDep = Math.abs(clickVal - dep);
            const thumb = distToArr < distToDep ? 'arrival' : 'departure';
            if (thumb === 'arrival' && lock) return;
            startDrag(e, thumb);
          }}
        >
          {/* Active fill between thumbs */}
          <div
            className="absolute h-full rounded-full pointer-events-none"
            style={{
              left: `${leftPct}%`,
              right: `${rightPct}%`,
              background: lockArrival
                ? 'linear-gradient(90deg, rgba(59,130,246,0.4), #93C5FD)'
                : 'linear-gradient(90deg, #3B82F6, #93C5FD)',
              boxShadow: '0 0 10px rgba(59,130,246,0.4)',
            }}
          />

          {/* Arrival thumb */}
          <div
            className={`absolute w-7 h-7 md:w-5 md:h-5 -mt-[10px] md:-mt-[7px] -ml-[14px] md:-ml-[10px] rounded-full border-2 border-white shadow-[0_0_12px_rgba(59,130,246,0.7)] flex items-center justify-center touch-none ${
              lockArrival ? 'bg-blue-500/40 border-blue-400/40 cursor-not-allowed' : 'bg-blue-500 cursor-grab active:cursor-grabbing'
            }`}
            style={{ left: `${leftPct}%`, zIndex: activeThumbRef.current === 'arrival' ? 10 : 5 }}
            onPointerDown={(e) => startDrag(e, 'arrival')}
          />

          {/* Departure thumb */}
          <div
            className="absolute w-7 h-7 md:w-5 md:h-5 -mt-[10px] md:-mt-[7px] -ml-[14px] md:-ml-[10px] rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing touch-none border border-white/20"
            style={{ left: `${100 - rightPct}%`, zIndex: activeThumbRef.current === 'departure' ? 10 : 5 }}
            onPointerDown={(e) => startDrag(e, 'departure')}
          />
        </div>
      </div>

      {/* Edge labels */}
      <div className="flex justify-between px-0.5 select-none">
        <span className="text-[9px] text-white/20 font-medium">{formatMin(globalMin)}</span>
        <span className="text-[9px] text-white/20 font-medium">11:45 PM</span>
      </div>
    </div>
  );
};

