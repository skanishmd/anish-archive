import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame(({ pointer }) => {
    if (lightRef.current) {
      lightRef.current.position.x = (pointer.x * viewport.width) / 2;
      lightRef.current.position.y = (pointer.y * viewport.height) / 2;
      lightRef.current.position.z = 4;
    }
  });

  return <pointLight ref={lightRef} intensity={2.2} color="#FF6B4A" distance={12} />;
}

function KinaseBackbone({ mode }: { mode: 'ribbon' | 'surface' | 'pocket' }) {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);

  useFrame(({ pointer, clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Smooth inertia-damped orbital tracking
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.9 + t * 0.12,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.5,
      0.04
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main Kinase Catalytic Domain Backbone (FGFR4 PDB: 7DTC) */}
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[2.0, 0.55, 180, 36, 2, 5]} />
          <meshPhysicalMaterial
            color={mode === 'pocket' ? '#8A1C14' : '#0A5C36'}
            emissive={mode === 'pocket' ? '#2B0938' : '#042314'}
            emissiveIntensity={0.4}
            roughness={mode === 'surface' ? 0.7 : 0.25}
            metalness={mode === 'surface' ? 0.1 : 0.85}
            clearcoat={mode === 'ribbon' ? 0.8 : 0.2}
            clearcoatRoughness={0.1}
            wireframe={mode === 'ribbon'}
          />
        </mesh>

        {/* Bound Inhibitor Ligand Complex (Pharmacophore Core) */}
        <group position={[0.2, 0.3, 0.4]}>
          <mesh>
            <icosahedronGeometry args={[0.45, 2]} />
            <meshStandardMaterial
              color="#FF00FF"
              emissive="#FF00FF"
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* Key Residue Pin: Cys477 Covalent Anchor */}
          <Html position={[0.8, 0.8, 0.2]} center distanceFactor={10}>
            <div className="font-mono text-[9px] uppercase tracking-wider bg-black/80 text-[#FF00FF] px-2 py-0.5 rounded border border-[#FF00FF]/50 backdrop-blur-md pointer-events-none whitespace-nowrap shadow-lg">
              Cys477 Anchor (1.8 Å)
            </div>
          </Html>

          {/* Key Residue Pin: Hydrophobic Hinge */}
          <Html position={[-1.2, -0.6, 0.4]} center distanceFactor={10}>
            <div className="font-mono text-[9px] uppercase tracking-wider bg-black/80 text-[#00FF66] px-2 py-0.5 rounded border border-[#00FF66]/50 backdrop-blur-md pointer-events-none whitespace-nowrap shadow-lg">
              Gatekeeper Val550
            </div>
          </Html>
        </group>

        {/* Surrounding Solvation / Ion Cloud Points */}
        <points>
          <sphereGeometry args={[3.2, 32, 32]} />
          <pointsMaterial
            size={0.035}
            color="#E2D4B7"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </Float>
  );
}

export default function KinaseViewer() {
  const [renderMode, setRenderMode] = useState<'ribbon' | 'surface' | 'pocket'>('ribbon');

  return (
    <div className="relative w-full h-[480px] md:h-[560px] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-[#07090E] shadow-2xl">
      {/* HUD Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A00] animate-ping" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF2A00] font-bold">
              3D CRYSTALLOGRAPHIC VIEWPORT
            </div>
            <div className="font-mono text-[9px] text-white/50 tracking-wider">
              TARGET: FGFR4 KINASE DOMAIN · PDB ID: 7DTC
            </div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10">
          {(['ribbon', 'surface', 'pocket'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setRenderMode(m)}
              className={`font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full transition-all cursor-pointer ${
                renderMode === m
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 6, 6]} intensity={1.2} color="#FFFFFF" />
        <directionalLight position={[-6, -6, -4]} intensity={0.6} color="#0A5C36" />
        <CursorLight />
        <KinaseBackbone mode={renderMode} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>

      {/* HUD Footer Metrics */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between pointer-events-none text-white/70 font-mono text-[9px] uppercase tracking-widest border-t border-white/10 pt-3">
        <span>MM-PBSA ΔG: -42.3 ± 3.1 kcal/mol</span>
        <span>RMSD: 1.8 Å (100ns All-Atom MD)</span>
        <span className="text-[#00FF66]">Active Inhibitor Complex: AM-001</span>
      </div>
    </div>
  );
}
