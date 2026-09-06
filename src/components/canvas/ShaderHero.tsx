import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export default function ShaderHero({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const isLight = theme === 'light';

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
          enableTransition={false}
          // Light Mode: Balanced warm desert sand
          // Dark Mode: Joker Theme (Royal Violet on Left, Toxic Emerald on Right, Midnight Obsidian in Troughs)
          color1={isLight ? "#BFB5A9" : "#6A1B9A"} 
          color2={isLight ? "#B7ADA1" : "#006E51"} 
          color3={isLight ? "#C5BCB0" : "#08040C"} 
          // Centered horizontally & vertically for balanced bilateral movement
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          uSpeed={0.2}
          uStrength={isLight ? 1.2 : 1.5}
          uDensity={1.8}
          uFrequency={4.8}
          uAmplitude={isLight ? 0.8 : 1.1}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={2.8}
          cameraZoom={1.0}
          lightType="env"
          envPreset="city"
          brightness={isLight ? 0.9 : 0.85}
          reflection={isLight ? 0.05 : 0.25}
          grain="on"
          wireframe={false}
        />
      </ShaderGradientCanvas>
      
      {/* Overlay gradient to blend edges softly */}
      <div className={`absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b ${isLight ? 'opacity-0' : 'from-[#050508]/40 via-transparent to-[#050508]/60'}`}></div>
      
      {/* Subtle fine film grain overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none mix-blend-overlay opacity-[0.07]" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
