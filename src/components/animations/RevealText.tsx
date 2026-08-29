import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@lib/gsap-register';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealText({ children, className = '', delay = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from(containerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
