import React, { useEffect, useState, useRef } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export default function ShaderHero({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const isLight = theme === 'light';

  // Dynamic motion state driven strictly by user scrolling & movement
  const [motion, setMotion] = useState({
    uSpeed: 0.0,
    rotationX: 0,
    rotationY: 0,
    positionX: 0,
    positionY: 0,
    cAzimuthAngle: 180,
  });

  const stateRef = useRef({
    targetSpeed: 0,
    currentSpeed: 0,
    targetRotX: 0,
    currentRotX: 0,
    targetRotY: 0,
    currentRotY: 0,
    targetPosX: 0,
    currentPosX: 0,
    targetPosY: 0,
    currentPosY: 0,
    targetAzimuth: 180,
    currentAzimuth: 180,
    lastScrollY: 0,
    lastScrollX: 0,
    scrollTimeout: null as any,
  });

  useEffect(() => {
    stateRef.current.lastScrollY = window.scrollY;
    stateRef.current.lastScrollX = window.scrollX;

    let animId: number;

    const handleScroll = () => {
      const curY = window.scrollY;
      const curX = window.scrollX;
      const deltaY = curY - stateRef.current.lastScrollY;
      const deltaX = curX - stateRef.current.lastScrollX;

      stateRef.current.lastScrollY = curY;
      stateRef.current.lastScrollX = curX;

      // When scrolling vertically: dynamically flow dunes proportional to scroll velocity
      const scrollSpeed = Math.max(-0.45, Math.min(0.45, deltaY * 0.025));
      stateRef.current.targetSpeed = scrollSpeed !== 0 ? scrollSpeed : 0.25;

      // Vertical tilt & displacement with scroll
      stateRef.current.targetRotX = Math.max(-14, Math.min(14, -deltaY * 0.45));
      stateRef.current.targetPosY = Math.max(-0.8, Math.min(0.8, -deltaY * 0.02));

      // Horizontal tilt if horizontal scrolling
      if (Math.abs(deltaX) > 0.5) {
        stateRef.current.targetRotY = Math.max(-25, Math.min(25, deltaX * 0.6));
        stateRef.current.targetPosX = Math.max(-1.5, Math.min(1.5, deltaX * 0.04));
        stateRef.current.targetAzimuth = 180 + Math.max(-30, Math.min(30, deltaX * 1.5));
      }

      // Reset to resting/static state when scrolling stops
      clearTimeout(stateRef.current.scrollTimeout);
      stateRef.current.scrollTimeout = setTimeout(() => {
        stateRef.current.targetSpeed = 0;
        stateRef.current.targetRotX = 0;
        stateRef.current.targetPosY = 0;
      }, 150);
    };

    const handlePointerMove = (e: MouseEvent) => {
      // Left/right dynamic parallax when mouse moves across the screen
      const normX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      stateRef.current.targetRotY = normX * 16;
      stateRef.current.targetPosX = normX * 0.6;
      stateRef.current.targetAzimuth = 180 + normX * 24;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Smooth lerp loop
    const loop = () => {
      const s = stateRef.current;

      // Smoothly interpolate towards target
      s.currentSpeed += (s.targetSpeed - s.currentSpeed) * 0.1;
      s.currentRotX += (s.targetRotX - s.currentRotX) * 0.08;
      s.currentRotY += (s.targetRotY - s.currentRotY) * 0.06;
      s.currentPosX += (s.targetPosX - s.currentPosX) * 0.06;
      s.currentPosY += (s.targetPosY - s.currentPosY) * 0.06;
      s.currentAzimuth += (s.targetAzimuth - s.currentAzimuth) * 0.06;

      if (Math.abs(s.currentSpeed) < 0.001) s.currentSpeed = 0;

      setMotion((prev) => {
        const speedDiff = Math.abs(prev.uSpeed - s.currentSpeed);
        const rotXDiff = Math.abs(prev.rotationX - s.currentRotX);
        const rotYDiff = Math.abs(prev.rotationY - s.currentRotY);
        const posDiff = Math.abs(prev.positionX - s.currentPosX);

        if (speedDiff > 0.003 || rotXDiff > 0.08 || rotYDiff > 0.08 || posDiff > 0.01) {
          return {
            uSpeed: Number(s.currentSpeed.toFixed(3)),
            rotationX: Number(s.currentRotX.toFixed(2)),
            rotationY: Number(s.currentRotY.toFixed(2)),
            positionX: Number(s.currentPosX.toFixed(3)),
            positionY: Number(s.currentPosY.toFixed(3)),
            cAzimuthAngle: Number(s.currentAzimuth.toFixed(1)),
          };
        }
        return prev;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      cancelAnimationFrame(animId);
      clearTimeout(stateRef.current.scrollTimeout);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <ShaderGradient
          control="props"
          type="waterPlane"
          animate="on"
          // Refined, muted warm sand palette (restrained luxury saturation)
          color1={isLight ? "#E6DFD5" : "#0A0A0A"} 
          color2={isLight ? "#C5B9AA" : "#1F2326"}
          color3={isLight ? "#D4C7B5" : "#2D3748"}
          uSpeed={motion.uSpeed}
          uStrength={isLight ? 1.5 : 1.8}
          uDensity={1.8}
          uFrequency={5.0}
          uAmplitude={isLight ? 1.1 : 1.3}
          positionX={motion.positionX}
          positionY={motion.positionY}
          rotationX={motion.rotationX}
          rotationY={motion.rotationY}
          cAzimuthAngle={motion.cAzimuthAngle}
          cPolarAngle={90}
          cDistance={2.8}
          cameraZoom={1.0}
          lightType="env"
          envPreset="city"
          brightness={isLight ? 1.0 : 0.8}
          reflection={isLight ? 0.2 : 0.4}
          grain="on"
          wireframe={false}
        />
      </ShaderGradientCanvas>
      
      {/* Overlay gradient to blend edges softly */}
      <div className={`absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b ${isLight ? 'from-[#F7F5F0]/20 via-transparent to-[#F7F5F0]/30' : 'from-[#050508]/80 via-transparent to-[#050508]/90'}`}></div>
      
      {/* Film grain overlay for texture */}
      <div className="absolute inset-0 z-[3] pointer-events-none mix-blend-overlay opacity-30" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
