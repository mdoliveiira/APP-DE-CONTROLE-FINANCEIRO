'use client';

import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / delta + 2) / 6;
    else h = ((r - g) / delta + 4) / 6;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToHex(h: number, s: number, v: number): string {
  const c = (v / 100) * (s / 100);
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;

  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp >= 1 && hp < 2) [r, g, b] = [x, c, 0];
  else if (hp >= 2 && hp < 3) [r, g, b] = [0, c, x];
  else if (hp >= 3 && hp < 4) [r, g, b] = [0, x, c];
  else if (hp >= 4 && hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const m = v / 100 - c;
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const [hexInput, setHexInput] = useState(value);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const updateColor = (h: number, s: number, v: number) => {
    const newHsv = { h: Math.max(0, Math.min(360, h)), s: Math.max(0, Math.min(100, s)), v: Math.max(0, Math.min(100, v)) };
    setHsv(newHsv);
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setHexInput(hex);
    onChange(hex);
  };

  const handleSVClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const s = ((e.clientX - rect.left) / rect.width) * 100;
    const v = 100 - ((e.clientY - rect.top) / rect.height) * 100;
    updateColor(hsv.h, s, v);
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColor(parseFloat(e.target.value), hsv.s, hsv.v);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value.toUpperCase();
    if (!hex.startsWith('#')) hex = '#' + hex;
    setHexInput(hex);

    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const newHsv = hexToHsv(hex);
      setHsv(newHsv);
      onChange(hex);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Matiz</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hsv.h}
          onChange={handleHueChange}
          className="w-full h-2 rounded-lg appearance-none bg-gradient-to-r"
          style={{
            backgroundImage: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff0000)',
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Saturação e Brilho</label>
        <div
          ref={svRef}
          onClick={handleSVClick}
          className="relative w-full h-40 rounded-lg cursor-crosshair border border-slate-700"
          style={{
            backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
            backgroundImage: `
              linear-gradient(to right, hsl(${hsv.h}, 0%, 50%), hsl(${hsv.h}, 100%, 50%)),
              linear-gradient(to top, #000, transparent),
              linear-gradient(to bottom, #fff, transparent)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%',
            backgroundPosition: '0 0, 0 0, 0 0',
            backgroundBlendMode: 'multiply, multiply, screen',
          }}
        >
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
            style={{
              left: `${hsv.s}%`,
              top: `${100 - hsv.v}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium" style={{ color: '#9CA3AF' }}>Cor (Hex)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            maxLength={7}
            placeholder="#000000"
            className="flex-1 px-3 py-2 rounded-lg text-sm font-mono border"
            style={{
              backgroundColor: '#1F2937',
              color: '#E8E8EE',
              borderColor: '#374151',
            }}
          />
          <div
            className="w-10 h-10 rounded-lg border-2"
            style={{
              backgroundColor: value,
              borderColor: '#374151',
            }}
          />
        </div>
      </div>
    </div>
  );
}
