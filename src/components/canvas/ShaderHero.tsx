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
          // Sophisticated, moody, mature colors (Sulkysubject37 / Pryzm aesthetic - with rich warm sand saturation)
          color1={isLight ? "#EAD1B0" : "#0A0A0A"} 
          color2={isLight ? "#BFA077" : "#1F2326"}
          color3={isLight ? "#D8B588" : "#2D3748"}
          uSpeed={0.3}
          uStrength={isLight ? 1.5 : 1.8}
          uDensity={1.8}
          uFrequency={5.0}
          uAmplitude={isLight ? 1.1 : 1.3}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={2.8}
          cameraZoom={1.0}
          lightType="env"
          envPreset="city"
          brightness={isLight ? 1.05 : 0.8}
          reflection={isLight ? 0.2 : 0.4}
          grain="on"
          wireframe={false}
        />
      </ShaderGradientCanvas>
      
      {/* Overlay gradient to blend edges */}
      <div className={`absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b ${isLight ? 'from-[#F6F4F0]/20 via-transparent to-[#F6F4F0]/30' : 'from-[#050508]/80 via-transparent to-[#050508]/90'}`}></div>
      
      {/* Film grain overlay for texture */}
      <div className="absolute inset-0 z-[3] pointer-events-none mix-blend-overlay opacity-30" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
