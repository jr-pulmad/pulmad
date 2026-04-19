"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader, RepeatWrapping, type Mesh, type Group, DoubleSide } from "three"

interface SingleRodProps {
  paperRollAmount: number // 0 = no paper rolled, 1 = max paper rolled
}

function SingleScrollRod({ paperRollAmount }: SingleRodProps) {
  const groupRef = useRef<Group>(null)
  const paperRollRef = useRef<Mesh>(null)
  
  // Load textures
  const woodTexture = useLoader(TextureLoader, "/textures/dark-wood.jpg")
  const paperTexture = useLoader(TextureLoader, "/textures/parchment-paper.jpg")
  
  useMemo(() => {
    woodTexture.wrapS = woodTexture.wrapT = RepeatWrapping
    woodTexture.repeat.set(6, 1)
    paperTexture.wrapS = paperTexture.wrapT = RepeatWrapping
    paperTexture.repeat.set(10, 2)
  }, [woodTexture, paperTexture])

  // Animate paper roll smoothly
  useFrame(() => {
    if (paperRollRef.current) {
      const baseScale = 1
      const maxScale = 3.5
      const targetScale = baseScale + (paperRollAmount * (maxScale - baseScale))
      const currentScale = paperRollRef.current.scale.y
      // Smooth lerp
      paperRollRef.current.scale.y = currentScale + (targetScale - currentScale) * 0.1
      paperRollRef.current.scale.z = paperRollRef.current.scale.y
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main wooden rod - horizontal cylinder viewed from side */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 12, 32]} />
        <meshStandardMaterial 
          map={woodTexture}
          roughness={0.55}
          metalness={0.12}
        />
      </mesh>

      {/* Left end - ornamental knob viewed from side */}
      <group position={[-6.2, 0, 0]}>
        {/* Collar ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.08, 0.12, 32]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Main knob barrel */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.18, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.22, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.35} metalness={0.25} />
        </mesh>
        {/* Silver accent band */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.12, 0, 0]}>
          <torusGeometry args={[0.1, 0.018, 16, 32]} />
          <meshStandardMaterial color="#9a9a9a" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* End cap sphere */}
        <mesh position={[-0.35, 0, 0]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Finial point */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.48, 0, 0]}>
          <coneGeometry args={[0.045, 0.09, 16]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.45} metalness={0.2} />
        </mesh>
      </group>

      {/* Right end - ornamental knob viewed from side */}
      <group position={[6.2, 0, 0]}>
        {/* Collar ring */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.08, 0.12, 32]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Main knob barrel */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.22, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.35} metalness={0.25} />
        </mesh>
        {/* Silver accent band */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.12, 0, 0]}>
          <torusGeometry args={[0.1, 0.018, 16, 32]} />
          <meshStandardMaterial color="#9a9a9a" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* End cap sphere */}
        <mesh position={[0.35, 0, 0]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Finial point */}
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.48, 0, 0]}>
          <coneGeometry args={[0.045, 0.09, 16]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.45} metalness={0.2} />
        </mesh>
      </group>

      {/* Paper roll wrapped around rod */}
      <mesh 
        ref={paperRollRef}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.065, 0.065, 11.8, 32, 1, false]} />
        <meshStandardMaterial 
          map={paperTexture}
          roughness={0.88}
          metalness={0}
          color="#e5dac5"
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}

function RodScene({ paperRollAmount }: { paperRollAmount: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 2, 5]} intensity={0.7} />
      <directionalLight position={[-2, 1, 3]} intensity={0.35} />
      <SingleScrollRod paperRollAmount={paperRollAmount} />
    </>
  )
}

interface TopScrollRodCanvasProps {
  paperRollAmount: number
  className?: string
}

export function TopScrollRodCanvas({ paperRollAmount, className }: TopScrollRodCanvasProps) {
  return (
    <div className={className}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 35 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          style={{ background: "transparent" }}
        >
          <RodScene paperRollAmount={paperRollAmount} />
        </Canvas>
      </Suspense>
    </div>
  )
}

export function BottomScrollRodCanvas({ paperRollAmount, className }: TopScrollRodCanvasProps) {
  return (
    <div className={className}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 35 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          style={{ background: "transparent" }}
        >
          <RodScene paperRollAmount={paperRollAmount} />
        </Canvas>
      </Suspense>
    </div>
  )
}
