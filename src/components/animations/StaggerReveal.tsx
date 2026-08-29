import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@lib/gsap-register';

interface Props {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  selector?: string;
}

export default function StaggerReveal({ children, className = '', stagger = 0.05, selector = ':scope > *' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const elements = containerRef.current?.querySelectorAll(selector);
      if (!elements || elements.length === 0) return;

      gsap.from(elements, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger,
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
