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
 */
export function ScrollRod({
  position,
  openingProgress,
  scrollProgress,
  rotationAngle,
}: ScrollRodProps) {
  const { viewport } = useThree()
  const spinGroupRef = useRef<THREE.Group>(null)

  const [woodTexture, paperTexture] = useTexture([
    "/textures/dark-wood-v2.jpg",
    "/textures/parchment-paper-v2.jpg",
  ])

  // Configure textures once - memoize to avoid reconfiguring each frame
  useMemo(() => {
    woodTexture.wrapS = THREE.RepeatWrapping
    woodTexture.wrapT = THREE.RepeatWrapping
    woodTexture.repeat.set(6, 1)

    // Paper: tile many times around the circumference so the rotation shows as
    // visible texture seams/lines sweeping past.
    paperTexture.wrapS = THREE.RepeatWrapping
    paperTexture.wrapT = THREE.RepeatWrapping
    paperTexture.repeat.set(1, 6) // along cylinder height × around circumference
  }, [woodTexture, paperTexture])

  // Geometry constants
  const woodRadius = 0.22
  const minPaperRadius = 0.42
  const maxPaperRadius = 1.05
  const closedPaperRadius = 1.05
  const rodLength = Math.min(viewport.width * 0.94, 26)

  // Closed (animation start) Y positions - rods stacked tightly in viewport center
  const closedY = position === "top" ? 0.6 : -0.6

  // Open (final) Y positions - at top/bottom of viewport
  const openY =
    position === "top"
      ? viewport.height / 2 - 0.9
      : -viewport.height / 2 + 0.9

  const y = THREE.MathUtils.lerp(closedY, openY, openingProgress)

  // Paper radius: at top of page bottom rod is full, at bottom of page top rod is full
  const openRadius =
    position === "top"
      ? THREE.MathUtils.lerp(minPaperRadius, maxPaperRadius, scrollProgress)
      : THREE.MathUtils.lerp(maxPaperRadius, minPaperRadius, scrollProgress)

  const paperRadius = THREE.MathUtils.lerp(closedPaperRadius, openRadius, openingProgress)

  // Rotation: opposing directions so paper appears to unroll from top onto bottom
  useFrame(() => {
    if (spinGroupRef.current) {
      const spin = position === "top" ? rotationAngle : -rotationAngle
      // Rotate around world X - that's the rod's long axis (paper wraps/unwraps)
      spinGroupRef.current.rotation.x = spin
    }
  })

  return (
    <group position={[0, y, 0]}>
      {/* Spin group - rotates around rod's long axis (world X) */}
      <group ref={spinGroupRef}>
        {/* Wood rod */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[woodRadius, woodRadius, rodLength, 32]} />
          <meshStandardMaterial
            map={woodTexture}
            color="#4a2f1a"
            roughness={0.55}
            metalness={0.1}
          />
        </mesh>

        {/* Paper roll wrapped around rod */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[paperRadius, paperRadius, rodLength * 0.94, 64, 1, false]} />
          <meshStandardMaterial
            map={paperTexture}
            color="#e8d8b8"
            roughness={0.92}
            metalness={0}
          />
        </mesh>

        {/* Decorative ink bands on the paper roll - clearly show rotation */}
        <InkBand paperRadius={paperRadius} rodLength={rodLength} offset={-rodLength * 0.28} />
        <InkBand paperRadius={paperRadius} rodLength={rodLength} offset={0} thick />
        <InkBand paperRadius={paperRadius} rodLength={rodLength} offset={rodLength * 0.28} />

        {/* Wax seal on the front surface of the paper roll - rotates visibly */}
        <WaxSeal paperRadius={paperRadius} />

        {/* Spiral layer end-caps (the rolled paper edge at each end) */}
        <mesh position={[rodLength * 0.47, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <ringGeometry args={[woodRadius + 0.005, paperRadius - 0.002, 48]} />
          <meshStandardMaterial color="#8a6f4a" roughness={1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-rodLength * 0.47, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[woodRadius + 0.005, paperRadius - 0.002, 48]} />
          <meshStandardMaterial color="#8a6f4a" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Ornamental end knobs stay still (do NOT spin with rod) */}
      <OrnateEndCap xOffset={-rodLength / 2} side="left" woodTexture={woodTexture} />
      <OrnateEndCap xOffset={rodLength / 2} side="right" woodTexture={woodTexture} />
    </group>
  )
}

/**
 * A thin dark ink band painted around the paper roll circumference.
 * Rotates with the roll so the rotation is obviously visible.
 */
function InkBand({
  paperRadius,
  rodLength,
  offset,
  thick = false,
}: {
  paperRadius: number
  rodLength: number
  offset: number
  thick?: boolean
}) {
  const bandWidth = thick ? 0.06 : 0.025
  return (
    <mesh position={[offset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry
        args={[paperRadius + 0.004, paperRadius + 0.004, bandWidth, 64, 1, false]}
      />
      <meshStandardMaterial color={thick ? "#4a2318" : "#6b3d24"} roughness={0.8} metalness={0} />
    </mesh>
  )
}

/**
 * A red wax seal on the paper surface at the front (+Z) - rotates with paper.
 * Used to make rotation unambiguously visible.
 */
function WaxSeal({ paperRadius }: { paperRadius: number }) {
  // Sits on the +Z surface of the cylinder (visible to viewer when open)
  return (
    <group>
      {/* Wax blob */}
      <mesh position={[0, 0, paperRadius + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.03, 24]} />
        <meshStandardMaterial color="#7a1f1f" roughness={0.4} metalness={0.15} />
      </mesh>
      {/* Wax inner stamp ring */}
      <mesh position={[0, 0, paperRadius + 0.026]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.11, 32]} />
        <meshStandardMaterial color="#4a1010" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/**
 * Elaborate end cap with multiple wood + silver stacked elements, viewed from the side.
 */
function OrnateEndCap({
  xOffset,
  side,
  woodTexture,
}: {
  xOffset: number
  side: "left" | "right"
  woodTexture: THREE.Texture
}) {
  const dir = side === "left" ? -1 : 1

  return (
    <group position={[xOffset, 0, 0]}>
      {/* 1. Inner silver collar butting against paper */}
      <mesh position={[dir * 0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.46, 0.38, 0.08, 32]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.22} metalness={0.95} />
      </mesh>

      {/* 2. Fine silver beading ring */}
      <mesh position={[dir * 0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.04, 16, 48]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.18} metalness={0.98} />
      </mesh>

      {/* 3. Wooden tapered spool */}
      <mesh position={[dir * 0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.4, 0.18, 32]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#3d2817"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* 4. Silver middle ring */}
      <mesh position={[dir * 0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 32]} />
        <meshStandardMaterial color="#d8d8d8" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* 5. Second wooden knob (narrower) */}
      <mesh position={[dir * 0.44, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.3, 0.12, 32]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#3d2817"
          roughness={0.55}
          metalness={0.1}
        />
      </mesh>

      {/* 6. Silver decorative bead - torus */}
      <mesh position={[dir * 0.54, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.24, 0.05, 16, 32]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.15} metalness={0.98} />
      </mesh>

      {/* 7. Tapered silver finial */}
      <mesh position={[dir * 0.64, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.24, 0.1, 32]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.22} metalness={0.95} />
      </mesh>

      {/* 8. Silver ball cap */}
      <mesh position={[dir * 0.74, 0, 0]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#dadada" roughness={0.18} metalness={0.98} />
      </mesh>

      {/* 9. Silver pointed spike at very end */}
      <mesh position={[dir * 0.86, 0, 0]} rotation={[0, 0, (dir * -Math.PI) / 2]}>
        <coneGeometry args={[0.09, 0.16, 20]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.2} metalness={0.97} />
      </mesh>
    </group>
  )
}
