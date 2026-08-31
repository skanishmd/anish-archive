import React, { useEffect, useRef } from 'react';

interface ShapeProps {
  type: 'circle' | 'square' | 'hexagon' | 'clover';
  color: string;
  size: number;
  initialPosition: { top: string; left: string };
  delay: number;
  rotationSpeed?: number;
}

const FloatingShape = ({ type, color, size, initialPosition, delay, rotationSpeed = 1 }: ShapeProps) => {
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shapeRef.current) return;
    
    // Simple floating animation using Web Animations API for performance
    const float = shapeRef.current.animate(
      [
        { transform: `translateY(0px) rotate(0deg)` },
        { transform: `translateY(-30px) rotate(${15 * rotationSpeed}deg)` },
        { transform: `translateY(0px) rotate(0deg)` }
      ],
      {
        duration: 6000 + Math.random() * 4000, // 6-10s
        iterations: Infinity,
        easing: 'ease-in-out',
        delay: delay * 1000,
      }
    );

    return () => float.cancel();
  }, [delay, rotationSpeed]);

  const baseStyle = {
    position: 'absolute' as const,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    top: initialPosition.top,
    left: initialPosition.left,
    zIndex: 0,
    filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.05))'
  };

  const renderShape = () => {
    switch (type) {
      case 'circle':
        return <div ref={shapeRef} style={{ ...baseStyle, borderRadius: '50%' }} />;
      case 'square':
        return <div ref={shapeRef} style={{ ...baseStyle, borderRadius: '24px' }} />;
      case 'hexagon':
        return (
          <div ref={shapeRef} style={{ ...baseStyle, backgroundColor: 'transparent' }}>
            <svg viewBox="0 0 100 100" style={{ fill: color, width: '100%', height: '100%' }}>
              <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" />
            </svg>
          </div>
        );
      case 'clover':
        return (
          <div ref={shapeRef} style={{ ...baseStyle, backgroundColor: 'transparent' }}>
            <svg viewBox="0 0 100 100" style={{ fill: color, width: '100%', height: '100%' }}>
              <path d="M50,15 C50,-5 85,-5 85,15 C85,30 50,50 50,50 C50,50 85,30 85,15 Z" transform="rotate(0 50 50)" />
              <path d="M50,15 C50,-5 85,-5 85,15 C85,30 50,50 50,50 C50,50 85,30 85,15 Z" transform="rotate(90 50 50)" />
              <path d="M50,15 C50,-5 85,-5 85,15 C85,30 50,50 50,50 C50,50 85,30 85,15 Z" transform="rotate(180 50 50)" />
              <path d="M50,15 C50,-5 85,-5 85,15 C85,30 50,50 50,50 C50,50 85,30 85,15 Z" transform="rotate(270 50 50)" />
              <circle cx="50" cy="50" r="10" fill={color} />
            </svg>
          </div>
        );
    }
  };

  return renderShape();
};

export default function GoogleLabsGeometry() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-[#F6F4F0]">
      {/* Google Labs inspired bright, bold, floating geometric primitives */}
      
      {/* Giant Orange Hexagon (Top Left) */}
      <FloatingShape 
        type="hexagon" 
        color="#FF8A5B" 
        size={350} 
        initialPosition={{ top: '-5%', left: '5%' }} 
        delay={0}
        rotationSpeed={0.5}
      />
      
      {/* Neon Green Diamond/Square (Bottom Left) */}
      <FloatingShape 
        type="square" 
        color="#4BFF8C" 
        size={280} 
        initialPosition={{ top: '60%', left: '15%' }} 
        delay={1.2}
        rotationSpeed={1.5}
      />
      
      {/* Pink Square (Bottom far left) */}
      <FloatingShape 
        type="square" 
        color="#FF9EEA" 
        size={200} 
        initialPosition={{ top: '75%', left: '-5%' }} 
        delay={0.5}
      />

      {/* Blue Circle (Right center) */}
      <FloatingShape 
        type="circle" 
        color="#5B8AFF" 
        size={400} 
        initialPosition={{ top: '30%', left: '70%' }} 
        delay={2.1}
      />

      {/* Yellow Clover (Center Right) */}
      <FloatingShape 
        type="clover" 
        color="#FACC15" 
        size={320} 
        initialPosition={{ top: '25%', left: '55%' }} 
        delay={0.8}
        rotationSpeed={-1}
      />

      {/* Light Green Hexagon (Bottom Right) */}
      <FloatingShape 
        type="hexagon" 
        color="#5BFFB0" 
        size={250} 
        initialPosition={{ top: '70%', left: '60%' }} 
        delay={1.5}
      />
    </div>
  );
}
