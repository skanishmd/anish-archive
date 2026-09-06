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
          // Realistic desert sand dunes: balanced bilateral symmetry
          color1={isLight ? "#C2A888" : "#0A0A0A"} 
          color2={isLight ? "#BEA383" : "#1F2326"}
          color3={isLight ? "#D0BD9F" : "#2D3748"}
          // Center and align the mesh to ensure consistent movement on both sides
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          uSpeed={0.15}
          uStrength={isLight ? 1.8 : 1.6}
          uDensity={1.3}
          uFrequency={4.8}
          uAmplitude={isLight ? 1.0 : 1.2}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={2.8}
          cameraZoom={1.0}
          lightType="env"
          envPreset="city"
          brightness={isLight ? 0.9 : 0.8}
          reflection={isLight ? 0.02 : 0.4}
          grain="off"
          wireframe={false}
        />
      </ShaderGradientCanvas>
      
      {/* Overlay gradient to blend edges softly */}
      <div className={`absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b ${isLight ? 'opacity-0' : 'from-[#050508]/80 via-transparent to-[#050508]/90'}`}></div>
      
      {/* Tactile, monochromatic fine sand grain */}
      <div 
        className="absolute inset-0 z-[3] pointer-events-none mix-blend-overlay opacity-20" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px'
        }}
      >
      </div>
    </div>
  );
}
