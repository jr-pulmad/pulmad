"use client"

import { useRef, useMemo } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

interface ScrollRodProps {
  position: "top" | "bottom"
  openingProgress: number
  scrollProgress: number
  rotationAngle: number
}

/**
 * A 3D scroll rod: a wooden cylinder with paper wrapped around it.
 * Rotates around its long axis (world X) so paper visibly wraps open/closed.
 */
export function ScrollRod({
  position,
  openingProgress,
  scrollProgress,
  rotationAngle,
}: ScrollRodProps) {
  const { viewport } = useThree()
  const spinGroupRef = useRef<THREE.Group>(null)

  const paperTexture = useTexture("/textures/parchment-detailed.jpg")

  // Seamless wrap: RepeatWrapping on the circumferential axis (S), clamped on length (T).
  // NO rotation — rotation + clamp creates a diagonal glitch seam.
  // Different offset per rod so the two look different without creating new seams.
  useMemo(() => {
    paperTexture.wrapS = THREE.RepeatWrapping
    paperTexture.wrapT = THREE.ClampToEdgeWrapping
    paperTexture.repeat.set(1, 1)
    paperTexture.rotation = 0
    paperTexture.center.set(0.5, 0.5)
    paperTexture.offset.set(position === "top" ? 0 : 0.37, 0)
    paperTexture.anisotropy = 16
    paperTexture.needsUpdate = true
  }, [paperTexture, position])

  // Geometry constants
  const woodRadius = 0.24
  const minPaperRadius = 0.42
  const maxPaperRadius = 1.0
  const closedPaperRadius = 1.0

  const rodLength = Math.min(viewport.width - 2.6, 25)
  const paperSectionLength = rodLength * 0.96

  const closedY = position === "top" ? 0.5 : -0.5
  const openY =
    position === "top"
      ? viewport.height / 2 - 0.85
      : -viewport.height / 2 + 0.85

  const y = THREE.MathUtils.lerp(closedY, openY, openingProgress)

  const openRadius =
    position === "top"
      ? THREE.MathUtils.lerp(minPaperRadius, maxPaperRadius, scrollProgress)
      : THREE.MathUtils.lerp(maxPaperRadius, minPaperRadius, scrollProgress)

  const paperRadius = THREE.MathUtils.lerp(closedPaperRadius, openRadius, openingProgress)

  useFrame(() => {
    if (!spinGroupRef.current) return
    const openingSpin = openingProgress * Math.PI * 6
    const scrollSpin = rotationAngle
    const dir = position === "top" ? 1 : -1
    spinGroupRef.current.rotation.x = dir * openingSpin + dir * scrollSpin
  })

  return (
    <group position={[0, y, 0]}>
      {/* Spinning core — rod + paper wrap */}
      <group ref={spinGroupRef}>
        {/* Dark wooden core */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[woodRadius, woodRadius, rodLength, 48]} />
          <meshStandardMaterial color="#1e0f04" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Paper roll wrapped around rod — darker cream parchment */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry
            args={[paperRadius, paperRadius, paperSectionLength, 96, 1, false]}
          />
          <meshStandardMaterial
            map={paperTexture}
            color="#b89870"
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Stationary marble ornaments — do not spin */}
      <MarbleEndCap xOffset={-rodLength / 2} side="left" />
      <MarbleEndCap xOffset={rodLength / 2} side="right" />
    </group>
  )
}

/**
 * White marble ornamental end cap with silver accent rings.
 * Flat-colored (no metalness) so it renders reliably without env maps.
 * Neo-gothic tiered shape with a rounded spherical terminus.
 */
function MarbleEndCap({
  xOffset,
  side,
}: {
  xOffset: number
  side: "left" | "right"
}) {
  const dir = side === "left" ? -1 : 1

  // White marble - flat color, no metalness so it doesn't need env reflection
  const marble = { color: "#f4ede0", roughness: 0.45, metalness: 0 }
  const marbleShade = { color: "#d8d0c0", roughness: 0.5, metalness: 0 }
  // Silver accent - low metalness so it reads even without env map
  const silver = { color: "#c8c8c8", roughness: 0.5, metalness: 0.25 }
  const silverDark = { color: "#6c6c6c", roughness: 0.55, metalness: 0.2 }

  return (
    <group position={[xOffset, 0, 0]}>
      {/* 1. Wide marble collar next to paper */}
      <mesh position={[dir * 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.46, 0.36, 0.12, 32]} />
        <meshStandardMaterial {...marble} />
      </mesh>

      {/* 2. Silver accent groove */}
      <mesh position={[dir * 0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
        <meshStandardMaterial {...silverDark} />
      </mesh>

      {/* 3. Tiered marble tier 1 */}
      <mesh position={[dir * 0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.42, 0.12, 32]} />
        <meshStandardMaterial {...marble} />
      </mesh>

      {/* 4. Silver ring */}
      <mesh position={[dir * 0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.04, 16, 32]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 5. Marble tier 2 - slimmer */}
      <mesh position={[dir * 0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.28, 0.18, 32]} />
        <meshStandardMaterial {...marbleShade} />
      </mesh>

      {/* 6. Silver middle band */}
      <mesh position={[dir * 0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 28]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 7. Marble tier 3 - narrow column */}
      <mesh position={[dir * 0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.21, 0.1, 28]} />
        <meshStandardMaterial {...marble} />
      </mesh>

      {/* 8. Decorative marble bulb */}
      <mesh position={[dir * 0.72, 0, 0]}>
        <sphereGeometry args={[0.2, 28, 28]} />
        <meshStandardMaterial {...marble} />
      </mesh>

      {/* 9. Silver narrow band between bulbs */}
      <mesh position={[dir * 0.86, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 10. Rounded terminus - marble sphere (not a pointy spire) */}
      <mesh position={[dir * 0.98, 0, 0]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial {...marble} />
      </mesh>
    </group>
  )
}
