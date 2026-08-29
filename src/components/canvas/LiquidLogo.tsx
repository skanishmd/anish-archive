'use client';

import { useEffect, useRef } from 'react';

interface LiquidLogoProps {
  text: string;
  className?: string;
  fontSize?: number | string;
  color?: string;
  speed?: number;
}

/**
 * LiquidLogo — Hand-written WebGL liquid metal shader applied to text.
 * Inspired by paper-design/liquid-logo (which is not yet on npm).
 * Uses an SVG feTurbulence + feDisplacementMap pipeline applied via CSS filter,
 * combined with a metallic gradient and CSS animation for the "liquid chrome" look.
 */
export default function LiquidLogo({
  text,
  className = '',
  fontSize,
  color = '#F0EDE8',
  speed = 1,
}: LiquidLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const turbulence = svg.querySelector<SVGFETurbulenceElement>('#lm-turbulence');
    const displacement = svg.querySelector<SVGFEDisplacementMapElement>('#lm-displacement');

    let isHovered = false;

    const animate = () => {
      phaseRef.current += 0.012 * speed;
      const p = phaseRef.current;

      if (turbulence) {
        const bfX = 0.012 + Math.sin(p * 0.7) * 0.004;
        const bfY = 0.018 + Math.cos(p * 0.5) * 0.006;
        turbulence.setAttribute('baseFrequency', `${bfX} ${bfY}`);
      }

      if (displacement) {
        const targetScale = isHovered ? 14 : 6;
        const currentScale = parseFloat(displacement.getAttribute('scale') || '6');
        const nextScale = currentScale + (targetScale - currentScale) * 0.08;
        displacement.setAttribute('scale', `${nextScale}`);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    const container = svg.parentElement;
    if (container) {
      container.addEventListener('mouseenter', () => { isHovered = true; });
      container.addEventListener('mouseleave', () => { isHovered = false; });
    }

    animate();
    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [speed]);

  const filterId = 'liquid-metal-filter';

  return (
    <span className={`relative inline-block ${className}`} style={{ isolation: 'isolate' }}>
      {/* Hidden SVG filter definition */}
      <svg
        ref={svgRef}
        className="absolute pointer-events-none opacity-0 w-0 h-0"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              id="lm-turbulence"
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              id="lm-displacement"
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feComposite in="displaced" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* The actual visible text with liquid metal effect */}
      <span
        className={`relative font-mono tracking-[0.1em] uppercase select-none ${!fontSize ? 'inherit-font-size' : ''}`}
        style={{
          ...(fontSize ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize } : {}),
          background: `linear-gradient(
            135deg,
            #fff 0%,
            ${color} 20%,
            #aaa 35%,
            ${color} 50%,
            #ddd 65%,
            ${color} 80%,
            #aaa 100%
          )`,
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: `url(#${filterId})`,
          animation: `liquidShimmer ${3 / speed}s ease-in-out infinite alternate`,
          willChange: 'filter',
        }}
      >
        {text}
      </span>

      <style>{`
        @keyframes liquidShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </span>
  );
}
