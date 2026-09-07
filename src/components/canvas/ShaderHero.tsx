import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

function FiveToneShader({ theme }: { theme: 'light' | 'dark' }) {
  const { scene } = useThree();

  useEffect(() => {
    if (theme === 'light') return;

    let timeoutId: any;
    const patchMaterial = () => {
      const mesh = scene.getObjectByName('shadergradient-mesh') as THREE.Mesh;
      if (!mesh || !mesh.material) {
        timeoutId = setTimeout(patchMaterial, 30);
        return;
      }

      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      mat.customProgramCacheKey = () => 'five-tone-joker-patch-v2';

      const originalOnBeforeCompile = mat.onBeforeCompile;
      mat.onBeforeCompile = (shader, renderer) => {
        if (originalOnBeforeCompile) {
          originalOnBeforeCompile(shader, renderer);
        }

        // Equal representation for all 5 colors in the WebGL fragment shader:
        // 1. Royal Violet (#6A1B9A)
        // 2. Crimson Rust (#B53A18)
        // 3. Amber Gold (#F29900)
        // 4. Toxic Emerald (#006E51)
        // 5. Midnight Obsidian (#08040C)
        shader.fragmentShader = shader.fragmentShader.replace(
          /vec4\s+diffuseColor\s*=\s*vec4\([\s\S]*?vPos\.z\),\s*1\);/,
          `
          // Calibrated Representation:
          // 35% Royal Velvet (#6A1B9A)
          // 35% Toxic Emerald (#006E51)
          // 15% Crimson Rust (#B53A18)
          // 15% Amber Gold (#F29900)
          // Depth Troughs: Midnight Obsidian (#08040C)
          vec3 cVelvet   = vec3(0.416, 0.106, 0.604); // #6A1B9A
          vec3 cRust     = vec3(0.710, 0.227, 0.094); // #B53A18
          vec3 cGold     = vec3(0.949, 0.600, 0.000); // #F29900
          vec3 cEmerald  = vec3(0.000, 0.431, 0.318); // #006E51
          vec3 cObsidian = vec3(0.031, 0.016, 0.047); // #08040C

          // Omnidirectional, non-linear organic fluid field
          // Multi-axis harmonic interference perturbed by live 3D wave elevation (vPos.z)
          // Completely eliminates any directional "left/right/top/bottom" confinement!
          float f1 = sin(vPos.x * 0.72 + vPos.y * 0.48 + vPos.z * 1.7);
          float f2 = cos(vPos.x * 0.42 - vPos.y * 0.78 + vPos.z * 1.3);
          float f3 = sin((vPos.x + vPos.y) * 0.58 - vPos.z * 1.5);
          float rawFluid = (f1 + f2 + f3) / 3.0; // range ~ [-1.0, 1.0]

          // Normalized scalar field t in [0.0, 1.0]
          float t = clamp(rawFluid * 0.5 + 0.5, 0.0, 1.0);

          // Calibrated Distribution:
          // [0.00 - 0.35] -> Royal Velvet (35%)
          // [0.35 - 0.50] -> Crimson Rust (15%)
          // [0.50 - 0.65] -> Amber Gold   (15%)
          // [0.65 - 1.00] -> Toxic Emerald (35%)
          vec3 fluidColor;
          if (t < 0.35) {
            float p = smoothstep(0.22, 0.35, t);
            fluidColor = mix(cVelvet, cRust, p * 0.5);
          } else if (t < 0.50) {
            float p = smoothstep(0.35, 0.50, t);
            fluidColor = mix(cRust, cGold, p);
          } else if (t < 0.65) {
            float p = smoothstep(0.50, 0.65, t);
            fluidColor = mix(cGold, cEmerald, p);
          } else {
            float p = smoothstep(0.65, 0.80, t);
            fluidColor = mix(cEmerald, cVelvet, p * 0.35);
          }

          // Dynamic crest luster: Amber Gold catches high 3D wave ridges across the dunes
          float crest = smoothstep(0.35, 0.85, vPos.z);
          fluidColor = mix(fluidColor, cGold, crest * 0.30);

          // Depth sculpting: Midnight Obsidian grounds the wave troughs & shadow contours
          float depthFactor = smoothstep(-0.55, 0.30, vPos.z);
          vec3 finalSurface = mix(cObsidian, fluidColor, depthFactor);

          vec4 diffuseColor = vec4(finalSurface, 1.0);
          `
        );
      };

      mat.needsUpdate = true;
    };

    patchMaterial();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [scene, theme]);

  return null;
}

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
          // Dark Mode Fallback: 30% Velvet, 30% Emerald, 20% Rust
          color1={isLight ? "#BFB5A9" : "#6A1B9A"} 
          color2={isLight ? "#B7ADA1" : "#006E51"} 
          color3={isLight ? "#C5BCB0" : "#B53A18"} 
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
        <FiveToneShader theme={theme} />
      </ShaderGradientCanvas>
      
      {/* 35/35/15/15 Organic Fluid Atmosphere (Dark Mode) */}
      {!isLight && (
        <div 
          className="absolute inset-0 z-[2] pointer-events-none mix-blend-screen opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 60% at 28% 35%, rgba(106, 27, 154, 0.50) 0%, transparent 72%),
              radial-gradient(ellipse 70% 60% at 72% 65%, rgba(0, 110, 81, 0.50) 0%, transparent 72%),
              radial-gradient(ellipse 45% 40% at 65% 30%, rgba(181, 58, 24, 0.32) 0%, transparent 60%),
              radial-gradient(ellipse 45% 40% at 35% 70%, rgba(242, 153, 0, 0.30) 0%, transparent 60%)
            `
          }}
        />
      )}

      {/* Overlay gradient to blend edges softly and protect typography contrast */}
      <div className={`absolute inset-0 z-[3] pointer-events-none bg-gradient-to-b ${isLight ? 'opacity-0' : 'from-[#050508]/40 via-transparent to-[#050508]/65'}`}></div>
      
      {/* Subtle fine film grain overlay */}
      <div className="absolute inset-0 z-[4] pointer-events-none mix-blend-overlay opacity-[0.07]" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
