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

export function ScrollRod({
  position,
  openingProgress,
  scrollProgress,
  rotationAngle,
}: ScrollRodProps) {
  const { viewport } = useThree()
  const rotateRef = useRef<THREE.Group>(null)

  const [woodTexture, paperTexture] = useTexture([
    "/textures/dark-wood-v2.jpg",
    "/textures/parchment-paper-v2.jpg",
  ])

  // Configure textures - memoized so we don't reconfigure each frame
  useMemo(() => {
    woodTexture.wrapS = THREE.RepeatWrapping
    woodTexture.wrapT = THREE.RepeatWrapping
    woodTexture.repeat.set(6, 1)
    paperTexture.wrapS = THREE.RepeatWrapping
    paperTexture.wrapT = THREE.RepeatWrapping
    paperTexture.repeat.set(8, 1)
  }, [woodTexture, paperTexture])

  // Geometry constants
  const woodRadius = 0.22
  const minPaperRadius = 0.4
  const maxPaperRadius = 1.0
  const closedPaperRadius = 1.0
  const rodLength = Math.min(viewport.width * 0.9, 22)

  // Closed (animation start) Y positions - rods stacked tightly in viewport center
  const closedY = position === "top" ? 0.55 : -0.55

  // Open (final) Y positions - at top/bottom of viewport
  const openY =
    position === "top"
      ? viewport.height / 2 - 0.85
      : -viewport.height / 2 + 0.85

  const y = THREE.MathUtils.lerp(closedY, openY, openingProgress)

  // Paper radius: when scrollProgress is 0 (top of page), bottom rod is full
  // When scrollProgress is 1 (bottom of page), top rod is full
  const openRadius =
    position === "top"
      ? THREE.MathUtils.lerp(minPaperRadius, maxPaperRadius, scrollProgress)
      : THREE.MathUtils.lerp(maxPaperRadius, minPaperRadius, scrollProgress)

  const paperRadius = THREE.MathUtils.lerp(closedPaperRadius, openRadius, openingProgress)

  // Rotation: spin opposite directions so the paper "unrolls" from top, "rolls" onto bottom
  // when scrolling DOWN
  useFrame(() => {
    if (rotateRef.current) {
      const spin = position === "top" ? rotationAngle : -rotationAngle
      rotateRef.current.rotation.y = spin
    }
  })

  return (
    <group position={[0, y, 0]}>
      {/* Group that spins around the rod's own axis (Y intrinsically, then rotated to X) */}
      <group ref={rotateRef}>
        {/* Wood rod (visible only when paper is thin) */}
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
          <cylinderGeometry args={[paperRadius, paperRadius, rodLength * 0.96, 64, 1, false]} />
          <meshStandardMaterial
            map={paperTexture}
            color="#ddc9a3"
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Darker spiral end caps on paper to suggest rolled layers */}
        <mesh position={[rodLength * 0.48, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <ringGeometry args={[woodRadius + 0.01, paperRadius - 0.005, 48]} />
          <meshStandardMaterial color="#8a6f4a" roughness={1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-rodLength * 0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[woodRadius + 0.01, paperRadius - 0.005, 48]} />
          <meshStandardMaterial color="#8a6f4a" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Ornaments stay still (don't spin with rod) */}
      <Ornament xOffset={-rodLength / 2} side="left" />
      <Ornament xOffset={rodLength / 2} side="right" />
    </group>
  )
}

function Ornament({ xOffset, side }: { xOffset: number; side: "left" | "right" }) {
  const dir = side === "left" ? -1 : 1

  return (
    <group position={[xOffset, 0, 0]}>
      {/* Inner silver collar - butts up against paper roll end */}
      <mesh position={[dir * 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.36, 0.1, 32]} />
        <meshStandardMaterial color="#b8b8b8" roughness={0.25} metalness={0.95} />
      </mesh>

      {/* Wooden spool widening */}
      <mesh position={[dir * 0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.36, 0.16, 32]} />
        <meshStandardMaterial color="#3d2817" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Decorative silver ring */}
      <mesh position={[dir * 0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 32]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Wooden knob */}
      <mesh position={[dir * 0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.32, 0.18, 32]} />
        <meshStandardMaterial color="#3d2817" roughness={0.55} metalness={0.1} />
      </mesh>

      {/* Silver finial cap */}
      <mesh position={[dir * 0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.26, 0.1, 32]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.25} metalness={0.95} />
      </mesh>

      {/* Final pointed sphere */}
      <mesh position={[dir * 0.74, 0, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.2} metalness={0.95} />
      </mesh>
    </group>
  )
}
