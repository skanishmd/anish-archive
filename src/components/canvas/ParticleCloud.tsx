import React, { useEffect, useRef, useMemo } from 'react';

export default function ParticleCloud({ color = '#3B82F6', density = 200, size = 400 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Generate random particles in a sphere/circle
    const particles = Array.from({ length: density }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = (Math.random() * 0.8 + 0.2) * (size / 2);
      return {
        baseX: size / 2 + Math.cos(angle) * radius,
        baseY: size / 2 + Math.sin(angle) * radius,
        offset: Math.random() * 100,
        speed: 0.01 + Math.random() * 0.02,
        size: Math.random() * 1.5 + 0.5,
      };
    });

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, size, size);
      
      ctx.fillStyle = color;
      
      particles.forEach(p => {
        // Orbit math
        const x = p.baseX + Math.sin(time * p.speed + p.offset) * 10;
        const y = p.baseY + Math.cos(time * p.speed + p.offset) * 10;
        
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, density, size]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        className="w-full h-full opacity-60 mix-blend-screen"
        style={{ filter: 'blur(0.5px)' }}
      />
    </div>
  );
}
