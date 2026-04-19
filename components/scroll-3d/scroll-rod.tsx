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
 * A 3D scroll rod: a horizontal wooden cylinder with paper wrapped around it.
 * The whole thing rotates around the rod's own long axis (world X) so the paper
 * visibly wraps open/closed. Paper radius shrinks/grows with scroll progress.
 * During opening animation, the rod also rotates to simulate unrolling.
 */
export function ScrollRod({
  position,
  openingProgress,
  scrollProgress,
  rotationAngle,
}: ScrollRodProps) {
  const { viewport } = useThree()
  const spinGroupRef = useRef<THREE.Group>(null)

  const paperTexture = useTexture("/textures/parchment-paper-v2.jpg")

  // Single continuous paper wrap - no repeats (no seams, no vertical lines)
  useMemo(() => {
    paperTexture.wrapS = THREE.ClampToEdgeWrapping
    paperTexture.wrapT = THREE.ClampToEdgeWrapping
    paperTexture.repeat.set(1, 1)
    paperTexture.center.set(0.5, 0.5)
    // Bake random-ish rotation per position so the two rods look different
    paperTexture.rotation = position === "top" ? 0.15 : -0.22
  }, [paperTexture, position])

  // Geometry constants
  const woodRadius = 0.24
  const minPaperRadius = 0.42
  const maxPaperRadius = 1.0
  const closedPaperRadius = 1.0

  // Rod length: wide enough to reach near edges, leaves ~1.3 units for ornaments each side
  const rodLength = Math.min(viewport.width - 2.6, 25)
  const paperSectionLength = rodLength * 0.96

  // Closed (animation start) Y positions - rods stacked tightly in viewport center
  const closedY = position === "top" ? 0.5 : -0.5

  // Open (final) Y positions - at top/bottom of viewport, inside safe area
  const openY =
    position === "top"
      ? viewport.height / 2 - 0.85
      : -viewport.height / 2 + 0.85

  const y = THREE.MathUtils.lerp(closedY, openY, openingProgress)

  // Paper radius: at top of page bottom rod is full, at bottom of page top rod is full
  const openRadius =
    position === "top"
      ? THREE.MathUtils.lerp(minPaperRadius, maxPaperRadius, scrollProgress)
      : THREE.MathUtils.lerp(maxPaperRadius, minPaperRadius, scrollProgress)

  const paperRadius = THREE.MathUtils.lerp(closedPaperRadius, openRadius, openingProgress)

  // Rotation: combine opening-animation rotation with scroll rotation
  useFrame(() => {
    if (!spinGroupRef.current) return
    // Opening rotation: ~3 full turns of dramatic unrolling
    const openingSpin = openingProgress * Math.PI * 6
    // Scroll-based spin (user page scroll)
    const scrollSpin = rotationAngle
    // Direction: opposite for top vs bottom so paper unrolls coherently
    const dir = position === "top" ? 1 : -1
    spinGroupRef.current.rotation.x = dir * openingSpin + dir * scrollSpin
  })

  return (
    <group position={[0, y, 0]}>
      {/* Spin group - rotates around rod's long axis (world X) */}
      <group ref={spinGroupRef}>
        {/* Wood rod - solid dark core */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[woodRadius, woodRadius, rodLength, 48]} />
          <meshStandardMaterial
            color="#2a1608"
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>

        {/* Paper roll wrapped around rod - single continuous sheet */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry
            args={[paperRadius, paperRadius, paperSectionLength, 96, 1, false]}
          />
          <meshStandardMaterial
            map={paperTexture}
            color="#e8d9b8"
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Ornamental end caps stay still (do NOT spin with rod) */}
      <NeoGothicEndCap xOffset={-rodLength / 2} side="left" />
      <NeoGothicEndCap xOffset={rodLength / 2} side="right" />
    </group>
  )
}

/**
 * Neo-gothic chrome/silver ornamental end cap.
 * Features: silver collar, beaded ring, pointed arch, trefoil cross-like finial, spire.
 */
function NeoGothicEndCap({
  xOffset,
  side,
}: {
  xOffset: number
  side: "left" | "right"
}) {
  const dir = side === "left" ? -1 : 1

  // Chrome silver material properties
  const chromeBright = { color: "#f0f0f0", roughness: 0.12, metalness: 0.98 }
  const chromeAccent = { color: "#c8c8c8", roughness: 0.22, metalness: 0.95 }
  const chromeDark = { color: "#8a8a8a", roughness: 0.35, metalness: 0.9 }

  return (
    <group position={[xOffset, 0, 0]}>
      {/* 1. Silver collar flaring outward from paper */}
      <mesh position={[dir * 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.44, 0.34, 0.11, 32]} />
        <meshStandardMaterial {...chromeBright} />
      </mesh>

      {/* 2. Dark accent ring (groove) */}
      <mesh position={[dir * 0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.025, 32]} />
        <meshStandardMaterial {...chromeDark} />
      </mesh>

      {/* 3. Beaded silver torus */}
      <mesh position={[dir * 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.36, 0.05, 16, 48]} />
        <meshStandardMaterial {...chromeBright} />
      </mesh>

      {/* 4. Tapered gothic shaft (pointed arch base) */}
      <mesh position={[dir * 0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.34, 0.22, 32]} />
        <meshStandardMaterial {...chromeAccent} />
      </mesh>

      {/* 5. Middle silver ring */}
      <mesh position={[dir * 0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.04, 16, 32]} />
        <meshStandardMaterial {...chromeBright} />
      </mesh>

      {/* 6. Narrow gothic column */}
      <mesh position={[dir * 0.56, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.18, 0.14, 32]} />
        <meshStandardMaterial {...chromeAccent} />
      </mesh>

      {/* 7. Gothic bulb (small decorative sphere) */}
      <mesh position={[dir * 0.66, 0, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial {...chromeBright} />
      </mesh>

      {/* 8. Cross-arm / trefoil - horizontal perpendicular torus for neo-gothic feel */}
      <mesh position={[dir * 0.74, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.025, 12, 24]} />
        <meshStandardMaterial {...chromeBright} />
      </mesh>

      {/* 9. Tapered silver finial stem */}
      <mesh position={[dir * 0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.1, 0.12, 20]} />
        <meshStandardMaterial {...chromeAccent} />
      </mesh>

      {/* 10. Pointed spire (gothic spire at very end) */}
      <mesh position={[dir * 0.96, 0, 0]} rotation={[0, 0, (dir * -Math.PI) / 2]}>
        <coneGeometry args={[0.07, 0.2, 20]} />
        <meshStandardMaterial {...chromeBright} />
      </mesh>
    </group>
  )
}
