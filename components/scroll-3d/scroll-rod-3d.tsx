"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader, RepeatWrapping, type Mesh, type Group } from "three"
import * as THREE from "three"

interface ScrollRod3DProps {
  position: "top" | "bottom"
  paperRollAmount: number // 0 to 1, how much paper is rolled
}

function WoodenRod({ position, paperRollAmount }: ScrollRod3DProps) {
  const groupRef = useRef<Group>(null)
  const paperRollRef = useRef<Mesh>(null)
  
  // Load textures
  const woodTexture = useLoader(TextureLoader, "/textures/dark-wood.jpg")
  const paperTexture = useLoader(TextureLoader, "/textures/old-paper.jpg")
  
  // Configure textures
  useMemo(() => {
    woodTexture.wrapS = woodTexture.wrapT = RepeatWrapping
    woodTexture.repeat.set(4, 1)
    paperTexture.wrapS = paperTexture.wrapT = RepeatWrapping
    paperTexture.repeat.set(8, 1)
  }, [woodTexture, paperTexture])

  // Animate paper roll based on scroll
  useFrame(() => {
    if (paperRollRef.current) {
      // Scale the paper roll based on how much paper is "rolled up"
      const baseRadius = 0.08
      const maxAdditionalRadius = 0.25
      const targetRadius = baseRadius + (paperRollAmount * maxAdditionalRadius)
      
      paperRollRef.current.scale.set(1, targetRadius / baseRadius, targetRadius / baseRadius)
    }
  })

  const yPos = position === "top" ? 2.2 : -2.2
  const paperYOffset = position === "top" ? -0.15 : 0.15

  return (
    <group ref={groupRef} position={[0, yPos, 0]}>
      {/* Main wooden rod - horizontal cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 8, 32]} />
        <meshStandardMaterial 
          map={woodTexture}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Left ornamental knob - viewed from side */}
      <group position={[-4.2, 0, 0]}>
        {/* Knob base ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.12, 0.1, 32]} />
          <meshStandardMaterial 
            color="#3d2d1f"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        {/* Knob sphere */}
        <mesh position={[-0.15, 0, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial 
            color="#2d2318"
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        {/* Silver accent ring */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.05, 0, 0]}>
          <torusGeometry args={[0.1, 0.015, 16, 32]} />
          <meshStandardMaterial 
            color="#a8a8a8"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Finial tip */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.3, 0, 0]}>
          <coneGeometry args={[0.06, 0.12, 16]} />
          <meshStandardMaterial 
            color="#4a3a2a"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* Right ornamental knob - viewed from side */}
      <group position={[4.2, 0, 0]}>
        {/* Knob base ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.12, 0.1, 32]} />
          <meshStandardMaterial 
            color="#3d2d1f"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        {/* Knob sphere */}
        <mesh position={[0.15, 0, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial 
            color="#2d2318"
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        {/* Silver accent ring */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.05, 0, 0]}>
          <torusGeometry args={[0.1, 0.015, 16, 32]} />
          <meshStandardMaterial 
            color="#a8a8a8"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Finial tip */}
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.3, 0, 0]}>
          <coneGeometry args={[0.06, 0.12, 16]} />
          <meshStandardMaterial 
            color="#4a3a2a"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* Paper roll wrapped around rod */}
      <mesh 
        ref={paperRollRef}
        rotation={[0, 0, Math.PI / 2]} 
        position={[0, paperYOffset, 0]}
      >
        <cylinderGeometry args={[0.08, 0.08, 7.8, 32, 1, true]} />
        <meshStandardMaterial 
          map={paperTexture}
          side={THREE.DoubleSide}
          roughness={0.9}
          metalness={0}
          color="#e8dcc8"
        />
      </mesh>

      {/* Shadow underneath the rod */}
      <mesh 
        position={[0, position === "top" ? -0.3 : 0.3, -0.1]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[8, 0.5]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

interface ScrollRodsSceneProps {
  topRollAmount: number
  bottomRollAmount: number
}

function ScrollRodsScene({ topRollAmount, bottomRollAmount }: ScrollRodsSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 3, 5]} intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={0.3} />

      {/* Top wooden rod */}
      <WoodenRod position="top" paperRollAmount={topRollAmount} />
      
      {/* Bottom wooden rod */}
      <WoodenRod position="bottom" paperRollAmount={bottomRollAmount} />
    </>
  )
}

interface ScrollRod3DCanvasProps {
  topRollAmount: number
  bottomRollAmount: number
  className?: string
}

export function ScrollRod3DCanvas({ topRollAmount, bottomRollAmount, className }: ScrollRod3DCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: "transparent" }}
      >
        <ScrollRodsScene 
          topRollAmount={topRollAmount} 
          bottomRollAmount={bottomRollAmount} 
        />
      </Canvas>
    </div>
  )
}
