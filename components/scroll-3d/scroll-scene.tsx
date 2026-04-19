"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture, Environment } from "@react-three/drei"
import { useRef, useEffect, useMemo, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

// The paper scroll mesh with realistic unrolling
function PaperScroll({ 
  progress, 
  paperTexture 
}: { 
  progress: number
  paperTexture: THREE.Texture 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  // Create curved paper geometry that updates based on progress
  const geometry = useMemo(() => {
    const width = viewport.width * 1.1
    const height = viewport.height * 1.2
    const segments = 64
    
    const geo = new THREE.PlaneGeometry(width, height, segments, segments)
    return geo
  }, [viewport.width, viewport.height])

  useFrame(() => {
    if (!meshRef.current) return
    const geo = meshRef.current.geometry as THREE.BufferGeometry
    const positions = geo.attributes.position
    const originalPositions = geometry.attributes.position
    
    for (let i = 0; i < positions.count; i++) {
      const y = originalPositions.getY(i)
      const normalizedY = (y / (viewport.height * 0.6)) + 0.5 // 0 to 1
      
      // Create curl effect at top and bottom based on progress
      const topCurl = Math.max(0, normalizedY - progress) * 2
      const bottomCurl = Math.max(0, (1 - normalizedY) - progress) * 2
      const curl = Math.max(topCurl, bottomCurl)
      
      // Apply curl to Z position
      const z = curl * curl * 0.5
      positions.setZ(i, z)
      
      // Compress Y based on curl (paper rolling up)
      const compressionTop = topCurl > 0 ? -topCurl * 0.3 : 0
      const compressionBottom = bottomCurl > 0 ? bottomCurl * 0.3 : 0
      positions.setY(i, originalPositions.getY(i) + compressionTop + compressionBottom)
    }
    
    positions.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        map={paperTexture}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.0}
        color="#f5efe6"
      />
    </mesh>
  )
}

// Wooden scroll rod with ornaments
function ScrollRod({ 
  position, 
  woodTexture,
  isTop 
}: { 
  position: [number, number, number]
  woodTexture: THREE.Texture
  isTop: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  
  const rodLength = viewport.width * 1.15
  const rodRadius = 0.08
  
  return (
    <group ref={groupRef} position={position}>
      {/* Main rod */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[rodRadius, rodRadius, rodLength, 32]} />
        <meshStandardMaterial
          map={woodTexture}
          roughness={0.6}
          metalness={0.1}
          color="#4a3728"
        />
      </mesh>
      
      {/* Left ornament finial */}
      <group position={[-rodLength / 2 - 0.1, 0, 0]}>
        {/* Base sphere */}
        <mesh>
          <sphereGeometry args={[rodRadius * 1.5, 16, 16]} />
          <meshStandardMaterial
            color="#3d2d1f"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        {/* Silver ring */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[rodRadius * 1.2, rodRadius * 0.2, 8, 24]} />
          <meshStandardMaterial
            color="#a8a8a8"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Tip */}
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[rodRadius * 0.8, 0.12, 8]} />
          <meshStandardMaterial
            color="#3d2d1f"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>
      
      {/* Right ornament finial */}
      <group position={[rodLength / 2 + 0.1, 0, 0]}>
        {/* Base sphere */}
        <mesh>
          <sphereGeometry args={[rodRadius * 1.5, 16, 16]} />
          <meshStandardMaterial
            color="#3d2d1f"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
        {/* Silver ring */}
        <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[rodRadius * 1.2, rodRadius * 0.2, 8, 24]} />
          <meshStandardMaterial
            color="#a8a8a8"
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Tip */}
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[rodRadius * 0.8, 0.12, 8]} />
          <meshStandardMaterial
            color="#3d2d1f"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>
      
      {/* Rolled paper on rod */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[rodRadius * 2.5, rodRadius * 2.5, rodLength * 0.98, 32]} />
        <meshStandardMaterial
          color="#e8dcc8"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}

// Burnt edge overlay effect
function BurntEdges() {
  const { viewport } = useThree()
  
  return (
    <>
      {/* Left burnt edge */}
      <mesh position={[-viewport.width / 2 + 0.05, 0, 0.01]}>
        <planeGeometry args={[0.15, viewport.height * 1.2]} />
        <meshBasicMaterial
          color="#1a1005"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Right burnt edge */}
      <mesh position={[viewport.width / 2 - 0.05, 0, 0.01]}>
        <planeGeometry args={[0.15, viewport.height * 1.2]} />
        <meshBasicMaterial
          color="#1a1005"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

// Main scene content
function ScrollContent({ 
  animationProgress,
  onAnimationComplete 
}: { 
  animationProgress: number
  onAnimationComplete?: () => void
}) {
  const { viewport } = useThree()
  const topRodRef = useRef<THREE.Group>(null)
  const bottomRodRef = useRef<THREE.Group>(null)
  
  // Load textures
  const paperTexture = useTexture("/textures/old-paper.jpg")
  const woodTexture = useTexture("/textures/dark-wood.jpg")
  
  // Configure textures
  useEffect(() => {
    paperTexture.wrapS = paperTexture.wrapT = THREE.RepeatWrapping
    paperTexture.repeat.set(2, 3)
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping
    woodTexture.repeat.set(4, 1)
  }, [paperTexture, woodTexture])
  
  // Calculate positions based on animation progress
  const topY = viewport.height / 2 * (1 - animationProgress) + (viewport.height / 2 + 0.15) * animationProgress
  const bottomY = -viewport.height / 2 * (1 - animationProgress) + (-viewport.height / 2 - 0.15) * animationProgress
  
  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 2, 4]} intensity={0.3} />
      
      {/* Environment for realistic reflections */}
      <Environment preset="apartment" />
      
      {/* Paper scroll */}
      <PaperScroll progress={animationProgress} paperTexture={paperTexture} />
      
      {/* Burnt edges */}
      <BurntEdges />
      
      {/* Top scroll rod */}
      <group position={[0, topY, 0.1]}>
        <ScrollRod position={[0, 0, 0]} woodTexture={woodTexture} isTop={true} />
      </group>
      
      {/* Bottom scroll rod */}
      <group position={[0, bottomY, 0.1]}>
        <ScrollRod position={[0, 0, 0]} woodTexture={woodTexture} isTop={false} />
      </group>
    </>
  )
}

// Animation controller
function AnimationController({ 
  onProgress,
  onComplete,
  shouldAnimate
}: { 
  onProgress: (progress: number) => void
  onComplete: () => void
  shouldAnimate: boolean
}) {
  const progressRef = useRef({ value: 0 })
  
  useEffect(() => {
    if (!shouldAnimate) {
      onProgress(1)
      onComplete()
      return
    }
    
    // Create GSAP animation
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete()
      }
    })
    
    // Initial pause
    tl.to(progressRef.current, { duration: 0.5 })
    
    // Unroll animation (5 seconds with realistic easing)
    tl.to(progressRef.current, {
      value: 1,
      duration: 5,
      ease: "power2.inOut",
      onUpdate: () => {
        onProgress(progressRef.current.value)
      }
    })
    
    return () => {
      tl.kill()
    }
  }, [shouldAnimate, onProgress, onComplete])
  
  return null
}

// Main exported component
export function Scroll3DScene({ 
  onAnimationComplete,
  shouldAnimate = true
}: { 
  onAnimationComplete?: () => void
  shouldAnimate?: boolean
}) {
  const [progress, setProgress] = useState(shouldAnimate ? 0 : 1)
  const [isComplete, setIsComplete] = useState(!shouldAnimate)
  
  const handleComplete = () => {
    setIsComplete(true)
    onAnimationComplete?.()
  }
  
  return (
    <div className="w-full h-screen" style={{ background: "#2a2520" }}>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <AnimationController 
          onProgress={setProgress}
          onComplete={handleComplete}
          shouldAnimate={shouldAnimate}
        />
        <ScrollContent 
          animationProgress={progress}
          onAnimationComplete={onAnimationComplete}
        />
      </Canvas>
    </div>
  )
}
