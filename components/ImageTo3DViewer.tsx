'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Converts the grayscale RawImage from Depth-Anything into an HTMLCanvasElement
// so Three.js can use it as a CanvasTexture displacement map.
function rawImageToCanvas(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  channels: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const v = channels === 1 ? data[i] : data[i * channels];
    rgba[i * 4] = v;
    rgba[i * 4 + 1] = v;
    rgba[i * 4 + 2] = v;
    rgba[i * 4 + 3] = 255;
  }
  ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
  return canvas;
}

interface DepthPlaneProps {
  imageUrl: string;
  depthCanvas: HTMLCanvasElement | null;
}

function DepthPlane({ imageUrl, depthCanvas }: DepthPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorTex, setColorTex] = useState<THREE.Texture | null>(null);
  const [dispTex, setDispTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setColorTex(tex);
    });
  }, [imageUrl]);

  useEffect(() => {
    if (!depthCanvas) return;
    const tex = new THREE.CanvasTexture(depthCanvas);
    setDispTex(tex);
    return () => tex.dispose();
  }, [depthCanvas]);

  // Gentle auto-rotation so depth effect is obvious
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.25;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
  });

  if (!colorTex) return null;

  return (
    <mesh ref={meshRef}>
      {/* High vertex count so displacement map creates smooth 3D surface */}
      <planeGeometry args={[3.2, 4.0, 128, 128]} />
      <meshStandardMaterial
        map={colorTex}
        displacementMap={dispTex ?? undefined}
        displacementScale={dispTex ? 0.38 : 0}
        roughness={0.75}
        metalness={0.05}
      />
    </mesh>
  );
}

interface ImageTo3DViewerProps {
  imageUrl: string;
}

type Status = 'idle' | 'loading-model' | 'generating' | 'done' | 'error';

export function ImageTo3DViewer({ imageUrl }: ImageTo3DViewerProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [depthCanvas, setDepthCanvas] = useState<HTMLCanvasElement | null>(null);

  const run = useCallback(async () => {
    if (!imageUrl) return;
    setStatus('loading-model');
    setProgress(0);

    try {
      const { pipeline, env } = await import('@xenova/transformers');

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const estimator = await pipeline(
        'depth-estimation',
        'Xenova/depth-anything-v2-small',
        {
          progress_callback: (info: { progress?: number }) => {
            if (typeof info.progress === 'number') {
              // Model is downloading: fill up to 85%
              setProgress(Math.min(Math.round(info.progress * 0.85), 85));
            }
          },
        }
      );

      setStatus('generating');
      setProgress(90);

      // pipeline returns single output when given a single input
      const result = await estimator(imageUrl) as { depth: { data: Uint8ClampedArray; width: number; height: number; channels: number } };

      const depth = result.depth;
      const canvas = rawImageToCanvas(depth.data, depth.width, depth.height, depth.channels ?? 1);

      setDepthCanvas(canvas);
      setProgress(100);
      setStatus('done');
    } catch (err) {
      console.error('[ImageTo3DViewer] depth estimation failed:', err);
      setStatus('error');
    }
  }, [imageUrl]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px] bg-charcoal-950/40 rounded-3xl overflow-hidden border border-charcoal-800/30">
      {/* Loading / error overlay */}
      {status !== 'done' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-charcoal-950/85 backdrop-blur-sm">
          {status === 'error' ? (
            <>
              <p className="text-red-400 text-sm">Depth generation failed.</p>
              <button
                onClick={run}
                className="text-terracotta text-xs underline underline-offset-2"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <div className="w-8 h-8 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
              <p className="text-cream/60 text-sm text-center px-10">
                {status === 'loading-model'
                  ? 'Loading depth AI model…'
                  : 'Generating 3D depth map…'}
              </p>
              <div className="w-52 h-1 bg-charcoal-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-terracotta rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-cream/30 text-xs">~50 MB · cached after first use</p>
            </>
          )}
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ borderRadius: '1.5rem' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} color="#F5F0E8" />
        <pointLight position={[-4, -3, 3]} intensity={1.2} color="#D4AF37" />

        <DepthPlane imageUrl={imageUrl} depthCanvas={depthCanvas} />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enableZoom
          enablePan={false}
          minDistance={3}
          maxDistance={9}
        />
      </Canvas>

      {status === 'done' && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-charcoal-900/60 backdrop-blur-md border border-charcoal-700/30 text-[10px] text-cream/50 tracking-widest uppercase font-sans">
            AI Depth · Drag to explore
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageTo3DViewer;
