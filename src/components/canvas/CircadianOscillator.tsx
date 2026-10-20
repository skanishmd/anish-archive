import React, { useState, useMemo } from 'react';

interface GeneCurve {
  name: string;
  role: string;
  peakHour: number; // Peak time in hours (0-24)
  color: string;
  expression: number;
}

export default function CircadianOscillator() {
  const [selectedHour, setSelectedHour] = useState<number>(14.5); // Default ~2:30 PM
  const [isAutomated, setIsAutomated] = useState<boolean>(false);

  // Compute sinusoidal gene expression levels at current hour: y = 50 + 40 * cos(2π * (t - peak) / 24)
  const genes: GeneCurve[] = useMemo(() => {
    const clockGenes = [
      { name: 'BMAL1 (ARNTL)', role: 'Core Activator', peakHour: 0, color: '#3B82F6' },
      { name: 'CLOCK', role: 'Heterodimer Partner', peakHour: 2, color: '#06B6D4' },
      { name: 'PER1/2', role: 'Repressor Loop', peakHour: 12, color: '#EF4444' },
      { name: 'CRY1/2', role: 'Negative Feedback', peakHour: 14, color: '#F59E0B' },
      { name: 'REV-ERBα (NR1D1)', role: 'Auxiliary Loop', peakHour: 8, color: '#10B981' },
      { name: 'CYP3A4', role: 'Hepatic Drug Metabolism', peakHour: 15, color: '#A855F7' },
    ];

    return clockGenes.map((g) => {
      const radians = (2 * Math.PI * (selectedHour - g.peakHour)) / 24;
      const level = Math.round(50 + 45 * Math.cos(radians));
      return { ...g, expression: Math.max(5, Math.min(100, level)) };
    });
  }, [selectedHour]);

  // Therapeutic index recommendation
  const therapeuticStatus = useMemo(() => {
    if (selectedHour >= 6 && selectedHour <= 10) {
      return {
        label: 'Optimal Morning Phase (ZT0 - ZT4)',
        advice: 'Elevated glucocorticoids. High tolerance for immunomodulators and kinase inhibitors.',
        safetyScore: '94% OPTIMAL',
        color: '#10B981',
      };
    } else if (selectedHour > 10 && selectedHour <= 18) {
      return {
        label: 'Peak Hepatic Clearance Phase (ZT4 - ZT12)',
        advice: 'Maximal CYP3A4 & xenobiotic enzyme expression. Rapid clearance; lower toxicity.',
        safetyScore: '88% BALANCED',
        color: '#06B6D4',
      };
    } else {
      return {
        label: 'Nocturnal DNA Repair Phase (ZT12 - ZT24)',
        advice: 'Cellular mitotic arrest and DNA damage repair window. Avoid high cytotoxic dosing.',
        safetyScore: 'CAUTION // ELEVATED TOXICITY',
        color: '#EF4444',
      };
    }
  }, [selectedHour]);

  // Format hour into HH:MM
  const formatTime = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    const padH = String(hours).padStart(2, '0');
    const padM = String(mins).padStart(2, '0');
    return `${padH}:${padM}`;
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0B0F17]/90 backdrop-blur-2xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
      {/* Background Subtle Solar Radial */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: therapeuticStatus.color }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/10 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: therapeuticStatus.color }} />
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#06B6D4] font-bold">
              CHRONOBASE CIRCADIAN ENGINE
            </h2>
          </div>
          <p className="font-mono text-[11px] text-white/50 tracking-wider mt-1">
            TRANSCRIPTION-TRANSLATION FEEDBACK LOOP (TTFL) PHARMACOLOGY SIMULATOR
          </p>
        </div>

        {/* Current Time Display */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
            CIRCADIAN TIME (ZT):
          </span>
          <span className="font-mono text-xl font-bold text-white tracking-wider">
            {formatTime(selectedHour)}
          </span>
        </div>
      </div>

      {/* Interactive Time Scrubber Slider */}
      <div className="my-8 relative z-10">
        <div className="flex justify-between font-mono text-[10px] uppercase text-white/40 mb-2">
          <span>00:00 (MIDNIGHT)</span>
          <span>06:00 (DAWN / ZT0)</span>
          <span>12:00 (SOLAR NOON)</span>
          <span>18:00 (DUSK / ZT12)</span>
          <span>24:00</span>
        </div>

        <input
          type="range"
          min="0"
          max="24"
          step="0.25"
          value={selectedHour}
          onChange={(e) => setSelectedHour(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-ew-resize accent-[#06B6D4]"
        />
      </div>

      {/* Oscillating Gene Expression Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8 relative z-10">
        {genes.map((gene) => (
          <div
            key={gene.name}
            className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-white tracking-tight">{gene.name}</span>
              <span className="font-mono text-[11px] font-bold" style={{ color: gene.color }}>
                {gene.expression}%
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${gene.expression}%`,
                  backgroundColor: gene.color,
                }}
              />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block">
              {gene.role} · Peak ZT{gene.peakHour}
            </span>
          </div>
        ))}
      </div>

      {/* Chronotherapeutic Recommendation Card */}
      <div
        className="p-5 rounded-xl border relative z-10 transition-all duration-500"
        style={{
          borderColor: `${therapeuticStatus.color}40`,
          backgroundColor: `${therapeuticStatus.color}0D`,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="font-mono text-xs uppercase font-bold tracking-wider" style={{ color: therapeuticStatus.color }}>
            {therapeuticStatus.label}
          </span>
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border" style={{ borderColor: therapeuticStatus.color, color: therapeuticStatus.color }}>
            {therapeuticStatus.safetyScore}
          </span>
        </div>
        <p className="font-mono text-xs text-white/80 leading-relaxed">
          {therapeuticStatus.advice}
        </p>
      </div>
    </div>
  );
}
