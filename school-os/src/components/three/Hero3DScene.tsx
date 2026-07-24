"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  OrbitControls,
  Environment,
  Torus,
  Sphere,
  Ring,
  Box,
  Icosahedron,
  Dodecahedron,
  Octahedron,
  GradientTexture,
} from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
  position,
  rotation,
  scale = 1,
  color,
  speed = 1,
  shape: Shape,
  wireframe = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color: string;
  speed?: number;
  shape: React.ComponentType<any>;
  wireframe?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.3;
      meshRef.current.rotation.y += 0.002 * speed;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2 * speed) * 0.2;
    }
  });

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <Shape args={[0.8, 0]} />
        {wireframe ? (
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.15}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            metalness={0.1}
            roughness={0.4}
            transparent
            opacity={0.5}
          />
        )}
      </mesh>
    </Float>
  );
}

function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      ringRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      ringRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={ringRef}>
      <Ring args={[2.5, 2.8, 128]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          color="#4F46E5"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </Ring>
      <Ring args={[3.0, 3.15, 128]} rotation={[Math.PI / 3, 0, 0]}>
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </Ring>
      <Ring args={[2.0, 2.1, 128]} rotation={[Math.PI / 4, 0.5, 0]}>
        <meshBasicMaterial
          color="#7C3AED"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </Ring>
    </group>
  );
}

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      );
    }
  });

  return (
    <group>
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#4F46E5"
          transparent
          opacity={0.08}
        />
      </mesh>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#4F46E5"
          metalness={0.3}
          roughness={0.2}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#4F46E5"
          metalness={0.1}
          roughness={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function Particles() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0008;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4F46E5"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContents() {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4F46E5" />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#06B6D4" />
      <pointLight position={[0, -10, 5]} intensity={0.3} color="#7C3AED" />

      <CentralOrb />
      <GlowRing />
      <Particles />

      <FloatingShape
        position={[2.5, 1.5, 0]}
        color="#06B6D4"
        shape={Dodecahedron}
        scale={0.5}
        speed={0.7}
        wireframe
      />
      <FloatingShape
        position={[-2.5, -1, 1]}
        color="#7C3AED"
        shape={Octahedron}
        scale={0.45}
        speed={0.9}
      />
      <FloatingShape
        position={[1.5, -2, 0.5]}
        color="#4F46E5"
        shape={Icosahedron}
        scale={0.4}
        speed={0.8}
      />
      <FloatingShape
        position={[-1.5, 2.2, -0.5]}
        color="#06B6D4"
        shape={Dodecahedron}
        scale={0.35}
        speed={1.1}
      />
      <FloatingShape
        position={[0, 0, 3]}
        color="#4F46E5"
        shape={Box}
        scale={0.3}
        speed={0.6}
      />
      <FloatingShape
        position={[2, -0.5, -2]}
        color="#7C3AED"
        shape={Octahedron}
        scale={0.4}
        speed={0.85}
      />
      <FloatingShape
        position={[-2.5, 0.5, -1.5]}
        color="#06B6D4"
        shape={Icosahedron}
        scale={0.3}
        speed={1}
      />

      <Torus args={[1.6, 0.02, 32, 120]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial
          color="#4F46E5"
          transparent
          opacity={0.3}
          emissive="#4F46E5"
          emissiveIntensity={0.2}
        />
      </Torus>
      <Torus args={[1.8, 0.015, 32, 120]} rotation={[Math.PI / 2.5, 0.5, 0]}>
        <meshStandardMaterial
          color="#06B6D4"
          transparent
          opacity={0.25}
          emissive="#06B6D4"
          emissiveIntensity={0.15}
        />
      </Torus>
    </>
  );
}

function MouseRotator() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    mouse.current.x += (target.current.x - mouse.current.x) * 0.05;
    mouse.current.y += (target.current.y - mouse.current.y) * 0.05;

    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 1.0 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <SceneContents />
        <MouseRotator />
      </Canvas>
    </div>
  );
}
