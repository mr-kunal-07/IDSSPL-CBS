"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette, RotateCcw } from "lucide-react";
import { DEFAULT_PRIMARY_COLOR, useTheme } from "./ThemeProvider";

const PRESET_COLORS = [
  { name: "Blue", value: "#0B63C1" },
  { name: "Indigo", value: "#4F46E5" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Teal", value: "#0D9488" },
  { name: "Green", value: "#16A34A" },
  { name: "Emerald", value: "#059669" },
  { name: "Amber", value: "#D97706" },
  { name: "Orange", value: "#EA580C" },
  { name: "Red", value: "#DC2626" },
  { name: "Rose", value: "#E11D48" },
  { name: "Navy", value: "#1E3A8A" },
  { name: "Slate", value: "#334155" },
];

const isValidHex = (value: string) => /^#([0-9A-Fa-f]{6})$/.test(value);

export default function ThemeSwitcher() {
  const { primaryColor, setPrimaryColor, resetPrimaryColor } = useTheme();
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(primaryColor);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleHexCommit = (value: string) => {
    const normalized = value.startsWith("#") ? value : `#${value}`;
    if (isValidHex(normalized)) setPrimaryColor(normalized);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme color"
        className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-primary text-primary transition hover:bg-primary-50"
      >
        <Palette size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">Theme Color</p>
            <button
              type="button"
              onClick={resetPrimaryColor}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-primary"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          {/* Custom color picker */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
            <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-slate-200">
              <input
                type="color"
                value={isValidHex(primaryColor) ? primaryColor : DEFAULT_PRIMARY_COLOR}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="absolute -top-1 -left-1 h-11 w-11 cursor-pointer border-none bg-transparent p-0"
              />
            </label>
            <div className="flex-1">
              <p className="text-[11px] font-medium text-slate-400">Custom color</p>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onBlur={(e) => handleHexCommit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleHexCommit(hexInput)}
                spellCheck={false}
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                placeholder="#0B63C1"
              />
            </div>
          </div>

          {/* Quick-pick solid swatches */}
          <p className="mb-2 text-[11px] font-medium text-slate-400">Quick pick</p>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((color) => {
              const active = primaryColor.toLowerCase() === color.value.toLowerCase();
              return (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onClick={() => setPrimaryColor(color.value)}
                  className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-slate-200 ring-offset-2 transition hover:scale-110"
                  style={{ backgroundColor: color.value }}
                >
                  {active && <Check size={14} className="text-white drop-shadow" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
