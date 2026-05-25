'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, useGLTF } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const ImageTo3DViewer = dynamic(() => import('./ImageTo3DViewer'), { ssr: false });

interface Product3DViewerProps {
  color?: string;
  name?: string;
  modelUrl?: string;
  imageUrl?: string;
}

// Sub-component to load and render real GLB/GLTF models uploaded to Sanity
function SanityModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Smooth rotation for imported models
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  // Ensure children of loaded GLB model have shadows enabled
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={[1.6, 1.6, 1.6]}
      position={[0, -0.9, 0]}
    />
  );
}

// Inner component to access R3F hooks like useFrame
function FloatingKnot({ color = '#D4AF37' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Smoothly rotate the knot to display premium metallic reflections
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.25;
      meshRef.current.rotation.x = time * 0.15;
      // Subtle hovering animation
      meshRef.current.position.y = Math.sin(time * 0.7) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow scale={[0.9, 0.9, 0.9]}>
      {/* TorusKnot represents a complex, premium Afro-futuristic sculpture */}
      <torusKnotGeometry args={[1, 0.35, 180, 16, 3, 4]} />
      {/* MeshPhysicalMaterial gives a luxury, ultra-polished lacquer and metallic finish */}
      <meshPhysicalMaterial
        color={color}
        metalness={0.9}
        roughness={0.18}
        clearcoat={0.9}
        clearcoatRoughness={0.1}
        reflectivity={1.0}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

// Custom Loader that displays a gorgeous loading overlay inside the 3D Canvas
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-charcoal-900/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-charcoal-700/50 shadow-2xl min-w-[140px] transition-all">
        <Loader2 className="w-6 h-6 text-terracotta animate-spin mb-2" />
        <span className="text-xs text-cream/70 font-sans tracking-widest uppercase">
          Loading {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

export function Product3DViewer({ color = '#D4AF37', name, modelUrl, imageUrl }: Product3DViewerProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent SSR execution issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-charcoal-950/40 rounded-3xl flex items-center justify-center border border-charcoal-800/30">
        <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
      </div>
    );
  }

  const isRealSanityModel = !!(
    modelUrl &&
    modelUrl.startsWith('http') &&
    !modelUrl.includes('placeholder')
  );

  // If no uploaded GLB but we have a product image, use AI depth viewer
  if (!isRealSanityModel && imageUrl) {
    return <ImageTo3DViewer imageUrl={imageUrl} />;
  }

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] bg-charcoal-950/40 rounded-3xl overflow-hidden border border-charcoal-800/30 shadow-inner group">
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[-6, 6, -6]} intensity={2.5} color="#E05936" castShadow />
        <pointLight position={[5, -3, 5]} intensity={3.0} color="#D4AF37" distance={15} />
        <directionalLight position={[6, 3, 2]} intensity={1.2} color="#1B4332" />
        <spotLight
          position={[0, 10, 5]}
          intensity={2.0}
          angle={0.4}
          penumbra={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          color="#F5F0E8"
        />

        <Suspense fallback={<CanvasLoader />}>
          {isRealSanityModel ? (
            <SanityModel url={modelUrl} />
          ) : (
            <FloatingKnot color={color} />
          )}
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          autoRotate={!isRealSanityModel}
          autoRotateSpeed={0.8}
          minDistance={2.5}
          maxDistance={6.0}
          enableZoom
          enablePan={false}
        />
      </Canvas>

      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <div className="px-3 py-1.5 rounded-full bg-charcoal-900/60 backdrop-blur-md border border-charcoal-700/30 text-[10px] text-cream/50 tracking-widest uppercase font-sans">
          {isRealSanityModel ? 'Bantu Garment 3D' : 'Interactive 3D Experience'}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none opacity-60 group-hover:opacity-20 transition-opacity duration-300">
        <span className="text-[10px] text-cream/40 tracking-widest uppercase font-sans bg-charcoal-950/80 px-4 py-1.5 rounded-full border border-charcoal-800/30 shadow-lg whitespace-nowrap">
          Drag to rotate • Pinch to zoom
        </span>
      </div>
    </div>
  );
}

export default Product3DViewer;

