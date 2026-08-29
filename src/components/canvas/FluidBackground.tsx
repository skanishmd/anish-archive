import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';
import { useState, useEffect } from 'react';

const PALETTES = [
  { c1: '#0a0a0a', c2: '#101010', c3: '#9D00FF' }, // Midnight Purple
  { c1: '#020b14', c2: '#04162a', c3: '#0077ff' }, // Abyssal Blue
  { c1: '#051008', c2: '#0a1a0f', c3: '#00ff66' }, // Bio-Green
  { c1: '#1a0505', c2: '#2a0a0a', c3: '#ff2a00' }, // Blood Moon
  { c1: '#1a1005', c2: '#2a1a0a', c3: '#ffaa00' }, // Solar Flare
  { c1: '#0a0a0a', c2: '#1a1a1a', c3: '#ffffff' }, // Monochrome Chrome
];

export default function FluidBackground() {
  const [colors, setColors] = useState(PALETTES[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    setColors(randomPalette);
    setMounted(true);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none -z-10 mix-blend-screen transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        pointerEvents="none"
      >
        <ShaderGradient
          control="query"
          type="waterPlane"
          color1={colors.c1}
          color2={colors.c2}
          color3={colors.c3}
          cDistance={3.5}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cameraZoom={1}
          lightType="3d"
          envPreset="city"
          rotationX={0}
          rotationY={0}
          rotationZ={50}
          uStrength={1.5}
          uDensity={1.2}
          uFrequency={5.5}
          uSpeed={0.15}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
