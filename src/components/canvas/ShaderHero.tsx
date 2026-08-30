import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export default function ShaderHero() {
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
          color1="#4F46E5" // Electric Indigo
          color2="#06B6D4" // Cyber Teal
          color3="#C026D3" // Neon Magenta (Pryzm style)
          uSpeed={0.25}    // Slightly faster
          uStrength={2.0}  // Higher waves
          uDensity={1.5}
          uFrequency={5.5}
          uAmplitude={1.5}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={2.8}  // Closer camera
          cameraZoom={1.0}
          lightType="3d"
          brightness={1.4} // Brighter
          reflection={0.2}
          grain="on"
          wireframe={false}
        />
      </ShaderGradientCanvas>
      {/* Dark overlay gradient to ensure text remains readable over the bright 3D waves */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/80 via-transparent to-[#050508]/90 z-0"></div>
      
      {/* Film grain overlay for texture */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-50" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
