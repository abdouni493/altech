import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const TECH_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=70",
];

function ParticleSphere({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.2 + Math.random() * 0.5;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      arr[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      arr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      arr[i * 3 + 2] = r * Math.cos(theta);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7C3AED"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

function OrbitingImage({
  url,
  index,
  total,
}: {
  url: string;
  index: number;
  total: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, url);
  const radius = 2.4;
  const offset = (index / total) * Math.PI * 2;
  const yLevel = Math.sin(index * 1.7) * 0.8;

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.25 + offset;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        yLevel + Math.sin(t * 1.3) * 0.25,
        Math.sin(t) * radius
      );
      ref.current.lookAt(0, 0, 0);
      ref.current.rotation.y += Math.PI;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={[0.95, 0.62]} />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.02, 0.69]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Scene({ images }: { images: string[] }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <ParticleSphere />
      <Suspense fallback={null}>
        {images.map((url, i) => (
          <OrbitingImage key={i} url={url} index={i} total={images.length} />
        ))}
      </Suspense>
    </>
  );
}

export interface OrbitGalleryProps {
  images?: string[];
  className?: string;
  interactive?: boolean;
}

/** Component A — particle sphere with orbiting image planes. */
export function OrbitGallery({
  images = TECH_IMAGES,
  className,
  interactive = true,
}: OrbitGalleryProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 55 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene images={images} />
        {interactive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            rotateSpeed={0.4}
          />
        )}
      </Canvas>
    </div>
  );
}

export default OrbitGallery;
