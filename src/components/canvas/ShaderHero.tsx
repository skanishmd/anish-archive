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
          // Subtly Desaturated & Dimmed Calibrated Representation:
          // 35% Royal Velvet
          // 35% Toxic Emerald
          // 15% Crimson Rust
          // 15% Amber Gold
          // Depth Troughs: Midnight Obsidian
          vec3 cVelvet   = vec3(0.25, 0.08, 0.36); // #40145C muted velvet
          vec3 cRust     = vec3(0.40, 0.14, 0.06); // #66240F subtle dim rust
          vec3 cGold     = vec3(0.48, 0.30, 0.04); // #7A4D0A soft antique gold
          vec3 cEmerald  = vec3(0.01, 0.24, 0.18); // #033D2E deep subtle emerald
          vec3 cObsidian = vec3(0.018, 0.012, 0.024); // #050306 deep abyss

          // Omnidirectional, non-linear organic fluid field
          // Multi-axis harmonic interference perturbed by live 3D wave elevation (vPos.z)
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

          // Subtle desaturation and dimming
          float lum = dot(fluidColor, vec3(0.299, 0.587, 0.114));
          fluidColor = mix(vec3(lum), fluidColor, 0.65);
          fluidColor *= 0.72;

          // Soft crest luster (reduced intensity to avoid blazing glare)
          float crest = smoothstep(0.40, 0.90, vPos.z);
          fluidColor = mix(fluidColor, cGold, crest * 0.10);

          // Depth sculpting: Midnight Obsidian grounds the wave troughs
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
          color1={isLight ? "#BFB5A9" : "#3D1456"} 
          color2={isLight ? "#B7ADA1" : "#004030"} 
          color3={isLight ? "#C5BCB0" : "#551D10"} 
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          uSpeed={0.2}
          uStrength={isLight ? 1.2 : 1.4}
          uDensity={1.8}
          uFrequency={4.8}
          uAmplitude={isLight ? 0.8 : 1.0}
          cAzimuthAngle={180}
          cPolarAngle={90}
          cDistance={2.8}
          cameraZoom={1.0}
          lightType="env"
          envPreset="city"
          brightness={isLight ? 0.9 : 0.55}
          reflection={isLight ? 0.05 : 0.15}
          grain="on"
          wireframe={false}
        />
        <FiveToneShader theme={theme} />
      </ShaderGradientCanvas>
      
      {/* Dim, subtle organic fluid atmosphere (Dark Mode) */}
      {!isLight && (
        <div 
          className="absolute inset-0 z-[2] pointer-events-none mix-blend-screen opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 60% at 28% 35%, rgba(106, 27, 154, 0.25) 0%, transparent 72%),
              radial-gradient(ellipse 70% 60% at 72% 65%, rgba(0, 110, 81, 0.25) 0%, transparent 72%),
              radial-gradient(ellipse 45% 40% at 65% 30%, rgba(181, 58, 24, 0.16) 0%, transparent 60%),
              radial-gradient(ellipse 45% 40% at 35% 70%, rgba(242, 153, 0, 0.14) 0%, transparent 60%)
            `
          }}
        />
      )}

      {/* Dimming overlay gradient to ensure floating typography has perfect contrast */}
      <div className={`absolute inset-0 z-[3] pointer-events-none bg-gradient-to-b ${isLight ? 'opacity-0' : 'from-[#06050A]/70 via-[#06050A]/40 to-[#06050A]/85'}`}></div>
      
      {/* Subtle fine film grain overlay */}
      <div className="absolute inset-0 z-[4] pointer-events-none mix-blend-overlay opacity-[0.06]" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
