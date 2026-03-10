interface NumberStepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  width?: string;
}

export function NumberStepper({ value, onChange, min = 0, max = 9999, step = 1, label, width = "w-20" }: NumberStepperProps) {
  return (
    <div>
      {label && <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block">{label}</label>}
      <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          className="px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm disabled:opacity-30"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          className={`${width} text-center bg-transparent font-mono text-xs text-foreground focus:outline-none border-x border-border py-1.5`}
        />
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          className="px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
