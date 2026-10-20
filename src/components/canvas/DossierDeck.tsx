import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface DossierCard {
  id: string;
  number: string;
  title: string;
  domain: string;
  meta: string;
  abstract: string;
  href: string;
  accent: string;
  accentBg: string;
  tagColor: string;
}

const DOSSIER_CARDS: DossierCard[] = [
  {
    id: 'fgfr4',
    number: '01',
    title: 'FGFR4 Inhibitor Discovery',
    domain: 'COMPUTATIONAL ONCOLOGY',
    meta: 'PDB: 7DTC · 100ns MD · ML VIRTUAL SCREEN',
    abstract: 'Novel selective kinase inhibitors for Hepatocellular Carcinoma targeting the FGF19-FGFR4 axis.',
    href: '/archive/research/fgfr4-hcc-discovery',
    accent: '#FF2A00',
    accentBg: 'rgba(255, 42, 0, 0.12)',
    tagColor: 'text-[#FF2A00] border-[#FF2A00]/40',
  },
  {
    id: 'chronobase',
    number: '02',
    title: 'ChronoBase Platform',
    domain: 'CHRONOTHERAPEUTICS · AI',
    meta: 'MULTI-OMICS · JTK_CYCLE · PK/PD OPTIMIZER',
    abstract: 'Platform for optimizing medication timing: efficacy vs toxicity based on circadian gene oscillation.',
    href: '/archive/projects/chronobase',
    accent: '#0055FF',
    accentBg: 'rgba(0, 85, 255, 0.12)',
    tagColor: 'text-[#0055FF] border-[#0055FF]/40',
  },
  {
    id: 'bluff',
    number: '03',
    title: 'The Architecture of the Bluff',
    domain: 'EMPIRICAL ESSAY · BEHAVIORAL',
    meta: '101 PEER-REVIEWED CITATIONS · VERIFIED',
    abstract: 'An exhaustive investigative broadsheet dismantling corporate posturing through clinical evidence.',
    href: '/archive/writing/the-architecture-of-the-bluff',
    accent: '#00FF66',
    accentBg: 'rgba(0, 255, 102, 0.12)',
    tagColor: 'text-[#00FF66] border-[#00FF66]/40',
  },
  {
    id: 'ghazal',
    number: '04',
    title: 'Ghazal on Discovery',
    domain: 'POETRY × MOLECULAR INQUIRY',
    meta: 'URDU GHAZAL · SCIENCE HUMANISM',
    abstract: 'Two languages for one truth: mapping kinase domains by midnight and writing verse by morning.',
    href: '/archive/creative/ghazal-on-discovery',
    accent: '#FFAA00',
    accentBg: 'rgba(255, 170, 0, 0.12)',
    tagColor: 'text-[#FFAA00] border-[#FFAA00]/40',
  },
  {
    id: 'chronicle',
    number: '05',
    title: 'Career & Research Chronicle',
    domain: 'EVIDENCE DOSSIER · TIMELINE',
    meta: 'MAKAUT 2024–2027 · TIER-1 / PHD TARGET',
    abstract: 'Academic milestones, computational oncology benchmarks, and publications trajectory.',
    href: '/timeline',
    accent: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.12)',
    tagColor: 'text-[#A855F7] border-[#A855F7]/40',
  },
];

export default function DossierDeck() {
  const [isFanned, setIsFanned] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const totalCards = DOSSIER_CARDS.length;

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    const cards = cardsRef.current.filter(Boolean) as HTMLAnchorElement[];

    if (!cards.length) return;

    if (isFanned && isDesktop) {
      // Fan out cards along a polar arc
      cards.forEach((card, i) => {
        const offset = i - (totalCards - 1) / 2; // -2, -1, 0, 1, 2
        const rotZ = offset * 6.5; // -13°, -6.5°, 0°, +6.5°, +13°
        const transX = offset * 115; // -230px, -115px, 0, +115px, +230px
        const transY = Math.abs(offset) * 14 - 25; // Slight arched lift

        gsap.to(card, {
          x: transX,
          y: transY,
          rotationZ: rotZ,
          scale: activeCard === i ? 1.08 : 1,
          zIndex: activeCard === i ? 50 : 20 + i,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
    } else if (!isFanned && isDesktop) {
      // Stacked deck at rest
      cards.forEach((card, i) => {
        const offset = i - (totalCards - 1) / 2;
        gsap.to(card, {
          x: offset * 14,
          y: i * 4,
          rotationZ: offset * 2.2,
          scale: 1,
          zIndex: 10 + i,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
    } else {
      // Mobile: Horizontal Scroll / Natural Flow
      cards.forEach((card) => {
        gsap.set(card, { x: 0, y: 0, rotationZ: 0, scale: 1 });
      });
    }
  }, [isFanned, activeCard, totalCards]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    if (window.innerWidth < 768) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // 3D perspective tilt
    gsap.to(card, {
      rotateX: -y * 0.08,
      rotateY: x * 0.08,
      duration: 0.2,
      ease: 'power1.out',
      transformPerspective: 800,
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) return;
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center select-none"
      onMouseEnter={() => setIsFanned(true)}
      onMouseLeave={() => {
        setIsFanned(false);
        setActiveCard(null);
      }}
    >
      {/* Toggle Pill / Deck Indicator */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsFanned(!isFanned)}
          className="group px-4 py-1.5 rounded-full border border-black/15 dark:border-white/15 bg-white/30 dark:bg-black/30 backdrop-blur-xl hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black dark:text-white font-medium">
            {isFanned ? 'CLOSE ARCHIVE DOSSIER' : 'EXPAND ARCHIVE WORLDS [05]'}
          </span>
          <span className="text-[10px] text-black/50 dark:text-white/50 font-mono transition-transform duration-300 group-hover:translate-x-0.5">
            {isFanned ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {/* The 3D Polar Arc Deck Container */}
      <div className="relative w-full max-w-4xl h-[260px] md:h-[280px] flex items-center justify-center overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-4 md:px-0">
        <div className="flex md:block items-center gap-4 md:gap-0 shrink-0">
          {DOSSIER_CARDS.map((card, idx) => {
            const isHovered = activeCard === idx;

            return (
              <a
                key={card.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                href={card.href}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onMouseLeave={handleCardMouseLeave}
                className="relative md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 w-[240px] md:w-[260px] h-[250px] md:h-[270px] rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-colors duration-300 backdrop-blur-2xl border shadow-xl will-change-transform shrink-0 text-left no-underline"
                style={{
                  background: isHovered
                    ? `linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(245,243,238,0.95) 100%)`
                    : `linear-gradient(145deg, rgba(255,255,255,0.78) 0%, rgba(240,238,232,0.85) 100%)`,
                  borderColor: isHovered ? card.accent : 'rgba(0, 0, 0, 0.1)',
                  boxShadow: isHovered
                    ? `0 24px 48px -12px ${card.accent}33, 0 8px 24px -6px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.9)`
                    : '0 12px 28px -8px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.7)',
                }}
              >
                {/* Dark Mode Gradient Override (via inline dark class or wrapper) */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 dark:block hidden"
                  style={{
                    background: isHovered
                      ? `linear-gradient(145deg, #18151D 0%, #0E0C12 100%)`
                      : `linear-gradient(145deg, #141118 0%, #0A080E 100%)`,
                    border: `1px solid ${isHovered ? card.accent : 'rgba(255, 255, 255, 0.12)'}`,
                    boxShadow: isHovered
                      ? `0 24px 48px -12px ${card.accent}55, 0 0 20px ${card.accent}22`
                      : '0 12px 28px -8px rgba(0,0,0,0.6)',
                  }}
                />

                {/* Top: Serial Number & Domain Tag */}
                <div className="relative z-10 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                  <span className="font-mono text-[11px] font-bold text-black/80 dark:text-white/90">
                    NO. {card.number}
                  </span>
                  <span
                    className={`font-mono text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${card.tagColor} bg-black/5 dark:bg-white/5 font-semibold`}
                  >
                    {card.domain.split('·')[0]}
                  </span>
                </div>

                {/* Middle: Title & Meta */}
                <div className="relative z-10 my-auto py-2">
                  <h3 className="font-cinematic text-lg md:text-xl font-bold leading-snug text-black dark:text-white tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <div
                    className="font-mono text-[8.5px] uppercase tracking-[0.15em] mb-2 font-medium"
                    style={{ color: card.accent }}
                  >
                    {card.meta}
                  </div>
                  <p className="font-literary text-xs leading-relaxed text-black/70 dark:text-white/70 line-clamp-3">
                    {card.abstract}
                  </p>
                </div>

                {/* Bottom: Action Cue */}
                <div className="relative z-10 flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white transition-colors">
                    ENTER UNIVERSE
                  </span>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
                    style={{
                      backgroundColor: card.accent,
                      transform: isHovered ? 'translateX(3px) scale(1.1)' : 'none',
                    }}
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
