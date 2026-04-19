"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader, RepeatWrapping, type Mesh, type Group } from "three"
import * as THREE from "three"

interface OpeningAnimation3DProps {
  openProgress: number // 0 = closed (scrolls at center), 1 = fully open
}

function ScrollRod({ 
  position, 
  yOffset 
}: { 
  position: "top" | "bottom"
  yOffset: number 
}) {
  const groupRef = useRef<Group>(null)
  
  // Load wood texture
  const woodTexture = useLoader(TextureLoader, "/textures/dark-wood.jpg")
  const paperTexture = useLoader(TextureLoader, "/textures/old-paper.jpg")
  
  useMemo(() => {
    woodTexture.wrapS = woodTexture.wrapT = RepeatWrapping
    woodTexture.repeat.set(4, 1)
    paperTexture.wrapS = paperTexture.wrapT = RepeatWrapping
    paperTexture.repeat.set(6, 1)
  }, [woodTexture, paperTexture])

  // Calculate paper roll radius based on how far open (inverse relationship)
  // When scroll is at center (yOffset = 0), lots of paper rolled up
  // When scroll is at edge (yOffset = max), minimal paper rolled
  const paperRollRadius = 0.08 + Math.max(0, (1 - Math.abs(yOffset) / 2.5) * 0.2)

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Main wooden rod - horizontal cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 10, 32]} />
        <meshStandardMaterial 
          map={woodTexture}
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* Left ornamental knob assembly */}
      <group position={[-5.3, 0, 0]}>
        {/* Transition ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.12, 0.15, 32]} />
          <meshStandardMaterial color="#3d2d1f" roughness={0.4} metalness={0.25} />
        </mesh>
        {/* Main knob body */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 32]} />
          <meshStandardMaterial color="#2d2318" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Silver ring accent */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.15, 0, 0]}>
          <torusGeometry args={[0.14, 0.02, 16, 32]} />
          <meshStandardMaterial color="#b8b8b8" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Finial sphere */}
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#2d2318" roughness={0.35} metalness={0.3} />
        </mesh>
        {/* Finial tip */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.55, 0, 0]}>
          <coneGeometry args={[0.05, 0.1, 16]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Right ornamental knob assembly */}
      <group position={[5.3, 0, 0]}>
        {/* Transition ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.12, 0.15, 32]} />
          <meshStandardMaterial color="#3d2d1f" roughness={0.4} metalness={0.25} />
        </mesh>
        {/* Main knob body */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 32]} />
          <meshStandardMaterial color="#2d2318" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Silver ring accent */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.15, 0, 0]}>
          <torusGeometry args={[0.14, 0.02, 16, 32]} />
          <meshStandardMaterial color="#b8b8b8" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Finial sphere */}
        <mesh position={[0.4, 0, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#2d2318" roughness={0.35} metalness={0.3} />
        </mesh>
        {/* Finial tip */}
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.55, 0, 0]}>
          <coneGeometry args={[0.05, 0.1, 16]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* Paper roll wrapped around rod */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[paperRollRadius, paperRollRadius, 9.8, 32, 1, false]} />
        <meshStandardMaterial 
          map={paperTexture}
          roughness={0.85}
          metalness={0}
          color="#e8dcc8"
        />
      </mesh>
    </group>
  )
}

function PaperSheet({ openProgress }: { openProgress: number }) {
  const meshRef = useRef<Mesh>(null)
  
  const paperTexture = useLoader(TextureLoader, "/textures/old-paper.jpg")
  
  useMemo(() => {
    paperTexture.wrapS = paperTexture.wrapT = RepeatWrapping
    paperTexture.repeat.set(2, 3)
  }, [paperTexture])

  // Paper height grows as scroll opens
  const paperHeight = openProgress * 4.5

  return (
    <mesh ref={meshRef} position={[0, 0, -0.05]}>
      <planeGeometry args={[9.5, paperHeight]} />
      <meshStandardMaterial 
        map={paperTexture}
        roughness={0.9}
        metalness={0}
        color="#f0e6d6"
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function BurntEdges({ openProgress }: { openProgress: number }) {
  const paperHeight = openProgress * 4.5
  
  if (paperHeight < 0.1) return null

  return (
    <>
      {/* Left burnt edge */}
      <mesh position={[-4.85, 0, 0]}>
        <planeGeometry args={[0.3, paperHeight]} />
        <meshBasicMaterial 
          color="#1a0a02"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Right burnt edge */}
      <mesh position={[4.85, 0, 0]}>
        <planeGeometry args={[0.3, paperHeight]} />
        <meshBasicMaterial 
          color="#1a0a02"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

function ScrollScene({ openProgress }: { openProgress: number }) {
  // Calculate Y positions based on open progress
  // At progress=0, both rods at center (y=0)
  // At progress=1, top rod at y=2.5, bottom rod at y=-2.5
  const topY = openProgress * 2.5
  const bottomY = -openProgress * 2.5

  return (
    <>
      {/* Lighting for dramatic effect */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 10]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 4, 8]} intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={0.4} color="#fff5e6" />
      
      {/* Subtle spotlight on paper */}
      <spotLight
        position={[0, 0, 4]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.3}
        color="#fff8f0"
      />

      {/* Paper sheet that reveals as scroll opens */}
      <PaperSheet openProgress={openProgress} />
      
      {/* Burnt edges */}
      <BurntEdges openProgress={openProgress} />

      {/* Top scroll rod */}
      <ScrollRod position="top" yOffset={topY} />
      
      {/* Bottom scroll rod */}
      <ScrollRod position="bottom" yOffset={bottomY} />
    </>
  )
}

export function OpeningAnimation3D({ openProgress }: OpeningAnimation3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        shadows
        style={{ background: "#1a1510" }}
      >
        <ScrollScene openProgress={openProgress} />
      </Canvas>
    </div>
  )
}
