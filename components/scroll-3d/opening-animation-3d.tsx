"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader, RepeatWrapping, type Mesh, type Group, DoubleSide } from "three"

interface OpeningAnimation3DProps {
  openProgress: number // 0 = closed (scrolls at center), 1 = fully open
}

function ScrollRodAnimated({ 
  position, 
  yOffset 
}: { 
  position: "top" | "bottom"
  yOffset: number 
}) {
  const groupRef = useRef<Group>(null)
  
  const woodTexture = useLoader(TextureLoader, "/textures/dark-wood.jpg")
  const paperTexture = useLoader(TextureLoader, "/textures/parchment-paper.jpg")
  
  useMemo(() => {
    woodTexture.wrapS = woodTexture.wrapT = RepeatWrapping
    woodTexture.repeat.set(6, 1)
    paperTexture.wrapS = paperTexture.wrapT = RepeatWrapping
    paperTexture.repeat.set(10, 2)
  }, [woodTexture, paperTexture])

  // More paper rolled when closer to center
  const distFromCenter = Math.abs(yOffset)
  const paperRollRadius = 0.065 + Math.max(0, (1 - distFromCenter / 2.5) * 0.18)

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Main wooden rod */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 12, 32]} />
        <meshStandardMaterial 
          map={woodTexture}
          roughness={0.55}
          metalness={0.12}
        />
      </mesh>

      {/* Left ornamental knob */}
      <group position={[-6.2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.08, 0.12, 32]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.18, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.22, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.12, 0, 0]}>
          <torusGeometry args={[0.1, 0.018, 16, 32]} />
          <meshStandardMaterial color="#9a9a9a" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[-0.35, 0, 0]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.48, 0, 0]}>
          <coneGeometry args={[0.045, 0.09, 16]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.45} metalness={0.2} />
        </mesh>
      </group>

      {/* Right ornamental knob */}
      <group position={[6.2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.08, 0.12, 32]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.22, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.12, 0, 0]}>
          <torusGeometry args={[0.1, 0.018, 16, 32]} />
          <meshStandardMaterial color="#9a9a9a" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[0.35, 0, 0]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial color="#1f1610" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.48, 0, 0]}>
          <coneGeometry args={[0.045, 0.09, 16]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.45} metalness={0.2} />
        </mesh>
      </group>

      {/* Paper roll */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[paperRollRadius, paperRollRadius, 11.8, 32, 1, false]} />
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

function PaperSheetRevealing({ openProgress }: { openProgress: number }) {
  const meshRef = useRef<Mesh>(null)
  const paperTexture = useLoader(TextureLoader, "/textures/parchment-paper.jpg")
  
  useMemo(() => {
    paperTexture.wrapS = paperTexture.wrapT = RepeatWrapping
    paperTexture.repeat.set(2, 4)
  }, [paperTexture])

  const paperHeight = openProgress * 5

  if (paperHeight < 0.05) return null

  return (
    <mesh ref={meshRef} position={[0, 0, -0.08]}>
      <planeGeometry args={[11.5, paperHeight]} />
      <meshStandardMaterial 
        map={paperTexture}
        roughness={0.92}
        metalness={0}
        color="#f2e8d8"
        side={DoubleSide}
      />
    </mesh>
  )
}

function BurntEdgesRevealing({ openProgress }: { openProgress: number }) {
  const paperHeight = openProgress * 5
  
  if (paperHeight < 0.1) return null

  return (
    <>
      {/* Left burnt edge - black/charred */}
      <mesh position={[-5.9, 0, -0.07]}>
        <planeGeometry args={[0.4, paperHeight]} />
        <meshBasicMaterial 
          color="#080200"
          transparent
          opacity={0.85}
          side={DoubleSide}
        />
      </mesh>
      {/* Left edge gradient overlay */}
      <mesh position={[-5.6, 0, -0.06]}>
        <planeGeometry args={[0.4, paperHeight]} />
        <meshBasicMaterial 
          color="#1a0a02"
          transparent
          opacity={0.5}
          side={DoubleSide}
        />
      </mesh>
      
      {/* Right burnt edge - black/charred */}
      <mesh position={[5.9, 0, -0.07]}>
        <planeGeometry args={[0.4, paperHeight]} />
        <meshBasicMaterial 
          color="#080200"
          transparent
          opacity={0.85}
          side={DoubleSide}
        />
      </mesh>
      {/* Right edge gradient overlay */}
      <mesh position={[5.6, 0, -0.06]}>
        <planeGeometry args={[0.4, paperHeight]} />
        <meshBasicMaterial 
          color="#1a0a02"
          transparent
          opacity={0.5}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
}

function OpeningScene({ openProgress }: { openProgress: number }) {
  const topY = openProgress * 2.7
  const bottomY = -openProgress * 2.7

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight 
        position={[4, 6, 8]} 
        intensity={0.9} 
        castShadow
      />
      <directionalLight position={[-4, 3, 6]} intensity={0.45} />
      <pointLight position={[0, 0, 4]} intensity={0.35} color="#fff5e6" />
      
      <PaperSheetRevealing openProgress={openProgress} />
      <BurntEdgesRevealing openProgress={openProgress} />
      <ScrollRodAnimated position="top" yOffset={topY} />
      <ScrollRodAnimated position="bottom" yOffset={bottomY} />
    </>
  )
}

export function OpeningAnimation3D({ openProgress }: OpeningAnimation3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        shadows
        style={{ background: "#0f0a06" }}
      >
        <Suspense fallback={null}>
          <OpeningScene openProgress={openProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
