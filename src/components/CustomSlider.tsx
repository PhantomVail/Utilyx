import { useRef, useCallback } from "react";

export interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  width?: string;
  showValue?: boolean;
  suffix?: string;
}

export function CustomSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  width = "w-40",
  showValue = true,
  suffix = "",
}: CustomSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const pct = ((value - min) / (max - min)) * 100;

  const update = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      onChange(Math.max(min, Math.min(max, snapped)));
    },
    [min, max, step, onChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    update(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    update(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className={width}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-[10px] font-mono text-muted-foreground">{value}{suffix}</span>
          )}
        </div>
      )}
      <div
        ref={trackRef}
        className="relative h-5 flex items-center cursor-pointer"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="absolute inset-x-0 h-1 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-primary border-2 border-primary-foreground shadow-md -translate-x-1/2 transition-[left] duration-75 hover:scale-110"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}
