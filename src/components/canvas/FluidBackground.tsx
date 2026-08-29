import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';

export default function FluidBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 opacity-70 mix-blend-screen transition-opacity duration-1000">
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        pointerEvents="none"
      >
        <ShaderGradient
          control="query"
          type="waterPlane"
          color1="#0a0a0a"
          color2="#101010"
          color3="#9D00FF"
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
          uSpeed={0.1}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
