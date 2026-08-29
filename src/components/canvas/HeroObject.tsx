import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Generate DNA double helix geometry
function createHelixPoints(strand: 1 | -1, turns = 4, pointsPerTurn = 20): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const totalPoints = turns * pointsPerTurn;
  for (let i = 0; i <= totalPoints; i++) {
    const t = (i / totalPoints) * turns * Math.PI * 2;
    const y = (i / totalPoints) * 6 - 3; // height from -3 to 3
    const x = Math.cos(t + (strand === -1 ? Math.PI : 0)) * 0.8;
    const z = Math.sin(t + (strand === -1 ? Math.PI : 0)) * 0.8;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

// Crossbar rungs connecting the two strands
function HelixRungs() {
  const rungs: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
  const turns = 4;
  const rungsPerTurn = 6;
  const total = turns * rungsPerTurn;

  for (let i = 0; i < total; i++) {
    const t = (i / total) * turns * Math.PI * 2;
    const y = (i / total) * 6 - 3;
    const x1 = Math.cos(t) * 0.8;
    const z1 = Math.sin(t) * 0.8;
    const x2 = Math.cos(t + Math.PI) * 0.8;
    const z2 = Math.sin(t + Math.PI) * 0.8;
    rungs.push({
      start: new THREE.Vector3(x1, y, z1),
      end: new THREE.Vector3(x2, y, z2),
    });
  }

  return (
    <>
      {rungs.map((rung, i) => {
        const dir = rung.end.clone().sub(rung.start);
        const len = dir.length();
        const mid = rung.start.clone().add(rung.end).multiplyScalar(0.5);
        return (
          <mesh key={i} position={mid}>
            <cylinderGeometry args={[0.015, 0.015, len, 4]} />
            <meshStandardMaterial
              color={i % 4 < 2 ? '#4A90E2' : '#E24A90'}
              emissive={i % 4 < 2 ? '#001a40' : '#400011'}
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        );
      })}
    </>
  );
}

function HelixStrand({ strand }: { strand: 1 | -1 }) {
  const points = useMemo(() => createHelixPoints(strand), [strand]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 200, 0.04, 8, false),
    [curve]
  );

  return (
    <mesh ref={tubeRef} geometry={geometry}>
      <meshStandardMaterial
        color={strand === 1 ? '#9D00FF' : '#00FFCC'}
        emissive={strand === 1 ? '#2a0040' : '#004033'}
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      // Gentle sway
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
        <HelixStrand strand={1} />
        <HelixStrand strand={-1} />
        <HelixRungs />
        {/* Glowing core particle effect */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  Array.from({ length: 150 }, () => [
                    (Math.random() - 0.5) * 3,
                    Math.random() * 6 - 3,
                    (Math.random() - 0.5) * 3,
                  ]).flat()
                ),
                3,
              ]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.025}
            color="#9D00FF"
            transparent
            opacity={0.5}
            sizeAttenuation
          />
        </points>
      </group>
    </Float>
  );
}

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame(({ pointer }) => {
    if (lightRef.current) {
      lightRef.current.position.x = pointer.x * (viewport.width / 2);
      lightRef.current.position.y = pointer.y * (viewport.height / 2);
    }
  });

  return <pointLight ref={lightRef} position={[0, 0, 4]} intensity={2} color="#F0EDE8" />;
}

export default function HeroObject() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} color="#0a0a0a" />
        <CursorLight />
        <pointLight position={[-3, 3, 3]} intensity={1.5} color="#9D00FF" />
        <pointLight position={[3, -3, 2]} intensity={1.0} color="#00FFCC" />
        <DNAHelix />
      </Canvas>
    </div>
  );
}
