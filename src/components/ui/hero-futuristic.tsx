import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isWebGLSupported } from "@/components/three/webgpu";
import { OrbitGallery } from "./3d-orbit-gallery";

/* ------------------------------------------------------------------ */
/* Animated depth-grid terrain with a moving scan line (WebGL/TSL-free) */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 1.6 + uTime * 0.8) * 0.25
               + cos(pos.y * 1.4 + uTime * 0.6) * 0.25
               + sin((pos.x + pos.y) * 0.9 - uTime) * 0.18;
    pos.z += wave;
    vElevation = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // grid lines
    vec2 grid = abs(fract(vUv * 26.0 - 0.5) - 0.5) / fwidth(vUv * 26.0);
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);

    // moving scan line
    float scan = smoothstep(0.012, 0.0, abs(fract(vUv.y - uTime * 0.12) - 0.5) - 0.0);
    float scanGlow = smoothstep(0.08, 0.0, abs(vUv.y - fract(uTime * 0.12)));

    vec3 violet = vec3(0.486, 0.227, 0.929);
    vec3 cyan = vec3(0.024, 0.714, 0.831);
    vec3 col = mix(violet, cyan, vUv.y + vElevation * 0.6);

    float alpha = line * 0.6 + scanGlow * 0.5 + scan * 0.8;
    alpha *= smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.5, vUv.y) + 0.25;
    col += scanGlow * vec3(0.3, 0.5, 0.6);

    gl_FragColor = vec4(col, alpha * 0.9);
  }
`;

function GridTerrain() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2.35, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[18, 18, 90, 90]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        wireframe={false}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 600 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
      const arr = ref.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += 0.004;
        if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = 0;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#06B6D4"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 5.5], fov: 60 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#0A0A0F", 6, 14]} />
      <GridTerrain />
      <FloatingParticles />
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/* Public hero component                                               */
/* ------------------------------------------------------------------ */

export interface HeroFuturisticProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Component B — Futuristic hero.
 * Renders an animated depth-grid + scan line scene behind overlaid content.
 * Gracefully falls back to the OrbitGallery (Component A) when 3D is unavailable.
 */
export function HeroFuturistic({ children, className }: HeroFuturisticProps) {
  const canRender3D = isWebGLSupported();

  return (
    <div className={className}>
      <div className="absolute inset-0">
        {canRender3D ? <HeroScene /> : <OrbitGallery interactive={false} className="h-full w-full" />}
      </div>
      {children}
    </div>
  );
}

export default HeroFuturistic;
