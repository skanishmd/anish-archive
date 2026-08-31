import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export default function ShaderHero({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const isLight = theme === 'light';
  
  return (
    <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <ShaderGradient
          control="props"
          type="waterPlane"
          animate="on"
          // Light mode: Highly Saturated Iridescent
          // Dark mode: Deep Electric (Pryzm style)
          color1={isLight ? "#FF3366" : "#4F46E5"} 
          color2={isLight ? "#00C3FF" : "#06B6D4"}
          color3={isLight ? "#FFCC00" : "#C026D3"}
          uSpeed={0.25}
          uStrength={isLight ? 1.5 : 2.0}
          uDensity={1.5}
          uFrequency={5.5}
          uAmplitude={isLight ? 1.0 : 1.5}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={2.8}
          cameraZoom={1.0}
          lightType="3d"
          brightness={isLight ? 2.5 : 1.4}
          reflection={isLight ? 0.4 : 0.2}
          grain="on"
          wireframe={false}
        />
      </ShaderGradientCanvas>
      
      {/* Overlay gradient to blend edges */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-b ${isLight ? 'from-[#F6F4F0]/60 via-transparent to-[#F6F4F0]/80' : 'from-[#050508]/80 via-transparent to-[#050508]/90'}`}></div>
      
      {/* Film grain overlay for texture */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-50" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
