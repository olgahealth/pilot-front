"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, Star } from "lucide-react";

export function Tip({ text, wide }: { text: string; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  function handleEnter() {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top });
    }
  }

  return (
    <div ref={ref} className="inline-flex flex-shrink-0">
      <HelpCircle
        className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-slate-500 transition-colors"
        onMouseEnter={handleEnter}
        onMouseLeave={() => setPos(null)}
      />
      {pos && createPortal(
        <div
          className={`fixed z-[9999] ${wide ? 'w-72' : 'w-60'} bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl leading-relaxed pointer-events-none`}
          style={{ left: pos.x, top: pos.y - 8, transform: 'translate(-50%, -100%)' }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>,
        document.body
      )}
    </div>
  );
}

export function Stars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(score);
        const color = filled
          ? score >= 4 ? "text-amber-400 fill-amber-400"
          : score >= 3 ? "text-amber-500 fill-amber-500"
          : "text-rose-500 fill-rose-500"
          : "text-slate-200 fill-slate-200";
        return <Star key={i} className={`w-3.5 h-3.5 ${color}`} />;
      })}
    </div>
  );
}

export function CapitalCell({ value, variant }: { value: number; variant: "aprobado" | "cuarentena" | "rechazado" }) {
  if (value === 0) return <span className="text-slate-300 tabular-nums">—</span>;
  const styles = { aprobado: "text-emerald-700 font-semibold", cuarentena: "text-amber-700 font-semibold", rechazado: "text-rose-700 font-semibold" };
  return <span className={`tabular-nums ${styles[variant]}`}>${(value / 1_000_000).toFixed(1)}M</span>;
}
