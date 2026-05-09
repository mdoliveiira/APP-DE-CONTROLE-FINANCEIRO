'use client';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const COLORS = [
  '#6366f1', // indigo
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#64748b', // slate
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`h-8 w-8 rounded-lg border-2 transition-all ${
            value === color
              ? 'border-slate-900 dark:border-slate-100 ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-950'
              : 'border-slate-200 dark:border-slate-800'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
    </div>
  );
}
