"use client"

import { useRef, useMemo, type MutableRefObject } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

export interface RodProgressRef {
  opening: number // 0 → 1 during opening animation
  scroll: number // 0 → 1 as user scrolls the page
  rotation: number // accumulated rotation in radians from scroll deltas
}

interface ScrollRodProps {
  position: "top" | "bottom"
  progressRef: MutableRefObject<RodProgressRef>
}

// Geometry constants (also consumed by the host component for safe-area math)
export const ROD_WOOD_RADIUS = 0.2
export const ROD_PAPER_MIN_R = 0.42
export const ROD_PAPER_MAX_R = 1.0
export const ROD_PAPER_CLOSED_R = 1.0
// Rod center sits ROD_CENTER_Y_OFFSET world units from the viewport edge
// once the scroll is fully open. Tweak in sync with openY below.
export const ROD_CENTER_Y_OFFSET = 0.85

/**
 * A 3D scroll rod: dark wooden core with parchment paper wrapped around it.
 * Rotates around its long axis (world X) as the page scrolls, so the paper
 * visibly wraps/unwraps. 2D ornaments are rendered as HTML images by the
 * host component (ScrollExperience) for reliable visuals.
 */
export function ScrollRod({ position, progressRef }: ScrollRodProps) {
  const { viewport } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const spinGroupRef = useRef<THREE.Group>(null)
  const paperMeshRef = useRef<THREE.Mesh>(null)

  const paperTexture = useTexture("/textures/old-paper.jpg")

  // Single continuous wrap around the rod — no seam duplication.
  useMemo(() => {
    paperTexture.wrapS = THREE.RepeatWrapping
    paperTexture.wrapT = THREE.ClampToEdgeWrapping
    paperTexture.repeat.set(1, 1)
    paperTexture.offset.set(position === "top" ? 0 : 0.37, 0)
    paperTexture.rotation = 0
    paperTexture.center.set(0.5, 0.5)
    paperTexture.anisotropy = 16
    paperTexture.colorSpace = THREE.SRGBColorSpace
    paperTexture.needsUpdate = true
  }, [paperTexture, position])

  const rodLength = Math.min(viewport.width - 1.0, 28)

  // Drive all animation directly in useFrame from the ref.
  // Zero React re-renders during the opening tween -> no lag.
  useFrame(() => {
    const p = progressRef.current
    if (!groupRef.current || !spinGroupRef.current || !paperMeshRef.current) return

    const closedY = position === "top" ? 0.45 : -0.45
    const openY =
      position === "top"
        ? viewport.height / 2 - ROD_CENTER_Y_OFFSET
        : -viewport.height / 2 + ROD_CENTER_Y_OFFSET

    const y = THREE.MathUtils.lerp(closedY, openY, p.opening)
    groupRef.current.position.y = y

    const openR =
      position === "top"
        ? THREE.MathUtils.lerp(ROD_PAPER_MIN_R, ROD_PAPER_MAX_R, p.scroll)
        : THREE.MathUtils.lerp(ROD_PAPER_MAX_R, ROD_PAPER_MIN_R, p.scroll)
    const paperR = THREE.MathUtils.lerp(ROD_PAPER_CLOSED_R, openR, p.opening)

    // Scale the unit-radius cylinder to current paperR (cheaper than rebuilding geometry)
    paperMeshRef.current.scale.set(paperR / ROD_PAPER_CLOSED_R, 1, paperR / ROD_PAPER_CLOSED_R)

    const openingSpin = p.opening * Math.PI * 6
    const dir = position === "top" ? 1 : -1
    spinGroupRef.current.rotation.x = dir * openingSpin + dir * p.rotation
  })

  return (
    <group ref={groupRef}>
      <group ref={spinGroupRef}>
        {/* Dark wooden core — always behind the paper wrap */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[ROD_WOOD_RADIUS, ROD_WOOD_RADIUS, rodLength, 48]} />
          <meshStandardMaterial color="#1e0f04" roughness={0.75} metalness={0.05} />
        </mesh>

        {/* Paper roll wrapped around the rod (unit radius, scaled via useFrame) */}
        <mesh ref={paperMeshRef} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry
            args={[ROD_PAPER_CLOSED_R, ROD_PAPER_CLOSED_R, rodLength, 96, 1, false]}
          />
          <meshStandardMaterial
            map={paperTexture}
            color="#a68862"
            roughness={0.92}
            metalness={0}
          />
        </mesh>
      </group>
    </group>
  )
}
