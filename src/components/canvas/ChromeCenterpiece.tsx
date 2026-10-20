import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Dynamic cursor light tracking mouse pointer in 3D space
function CursorSpecularLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame(({ pointer }) => {
    if (lightRef.current) {
      lightRef.current.position.x = (pointer.x * viewport.width) / 1.8;
      lightRef.current.position.y = (pointer.y * viewport.height) / 1.8;
      lightRef.current.position.z = 4.5;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={3.5}
      distance={14}
      color="#FFFFFF"
      decay={2}
    />
  );
}

// Organic Liquid Chrome Sculpture
function LiquidChromeSculpture({ pulse }: { pulse: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const prevPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef(0);

  useFrame(({ pointer, clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Calculate mouse velocity for ripple excitation
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    velocity.current = THREE.MathUtils.lerp(velocity.current, speed * 8.0, 0.1);
    prevPointer.current = { x: pointer.x, y: pointer.y };

    // Fluid distortion response: base wave + mouse velocity + click pulse
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        0.35 + Math.min(velocity.current * 0.4, 0.45) + (pulse > 0 ? 0.3 : 0),
        0.08
      );
      materialRef.current.speed = THREE.MathUtils.lerp(
        materialRef.current.speed,
        1.8 + velocity.current * 4.0,
        0.08
      );
    }

    // Natural fluid rotation with cursor tilt
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      pointer.x * 0.75 + t * 0.2,
      0.05
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -pointer.y * 0.6 + Math.sin(t * 0.5) * 0.15,
      0.05
    );
  });

  return (
    <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Complex organic molecular toroid geometry */}
        <torusKnotGeometry args={[1.75, 0.58, 220, 36, 3, 5]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#E8E8E8"
          emissive="#0B1320"
          emissiveIntensity={0.15}
          metalness={0.96}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          distort={0.35}
          speed={2.0}
        />
      </mesh>
    </Float>
  );
}

// Orbiting Specular Satellites (Circadian Micro-Nodes)
function OrbitingNodes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.35;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  const nodes = useMemo(
    () => [
      { radius: 2.8, angle: 0, size: 0.14, color: '#00FF66' }, // Toxic Emerald
      { radius: 3.1, angle: (Math.PI * 2) / 3, size: 0.12, color: '#FF2A00' }, // Signal Red
      { radius: 2.9, angle: (Math.PI * 4) / 3, size: 0.15, color: '#A855F7' }, // Circadian Violet
    ],
    []
  );

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => {
        const x = Math.cos(node.angle) * node.radius;
        const z = Math.sin(node.angle) * node.radius;
        return (
          <mesh key={i} position={[x, Math.sin(node.angle * 2) * 0.5, z]}>
            <sphereGeometry args={[node.size, 24, 24]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Depth Stardust Field
function AmbientDust() {
  const points = useMemo(() => {
    const coords = new Float32Array(450 * 3);
    for (let i = 0; i < 450 * 3; i += 3) {
      coords[i] = (Math.random() - 0.5) * 16;
      coords[i + 1] = (Math.random() - 0.5) * 16;
      coords[i + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return coords;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FFFFFF"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ChromeCenterpiece() {
  const [pulse, setPulse] = useState(0);

  const handleClick = () => {
    setPulse((p) => p + 1);
    setTimeout(() => setPulse(0), 600);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-[520px] md:h-[640px] lg:h-[720px] cursor-grab active:cursor-grabbing select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 6.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        {/* Studio Lighting Environment */}
        <ambientLight intensity={0.6} />
        
        {/* Key Light */}
        <directionalLight position={[6, 8, 5]} intensity={2.0} color="#FFFFFF" />
        
        {/* Emerald Rim Light */}
        <directionalLight position={[-6, -4, -3]} intensity={1.8} color="#0A5C36" />
        
        {/* Violet Fill Light */}
        <directionalLight position={[0, -6, 4]} intensity={1.2} color="#8B5CF6" />
        
        {/* Cyan Specular Edge */}
        <directionalLight position={[5, -5, -4]} intensity={1.5} color="#06B6D4" />

        {/* Dynamic Interactive Cursor Specular */}
        <CursorSpecularLight />

        {/* Main 3D Objects */}
        <LiquidChromeSculpture pulse={pulse} />
        <OrbitingNodes />
        <AmbientDust />

        {/* Subtle orbit damping */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Floating Micro Interaction Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md opacity-60 hover:opacity-100 transition-opacity">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-black dark:text-white">
          DRAG TO ROTATE · CLICK TO PULSE
        </span>
      </div>
    </div>
  );
}
