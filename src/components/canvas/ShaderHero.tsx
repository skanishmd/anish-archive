import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export default function ShaderHero() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none mix-blend-screen opacity-70">
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
          color1="#0F172A" // Deep navy void
          color2="#4338CA" // Electric indigo
          color3="#06B6D4" // Cyber teal
          uSpeed={0.15}    // Very slow, ambient breathing
          uStrength={1.5}
          uDensity={1.3}
          uFrequency={5.5}
          uAmplitude={1.0}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={3.2}
          cameraZoom={1.0}
          lightType="3d"
          brightness={1.2}
          reflection={0.1}
          grain="on"
          wireframe={false}
        />
      </ShaderGradientCanvas>
      {/* Film grain overlay for texture */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
