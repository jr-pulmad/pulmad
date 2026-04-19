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

  // Single continuous wrap around the rod — no repeat, no seam duplication.
  // RepeatWrapping on S allows clean UV wrap at the back seam.
  useMemo(() => {
    paperTexture.wrapS = THREE.RepeatWrapping
    paperTexture.wrapT = THREE.ClampToEdgeWrapping
    paperTexture.repeat.set(1, 1)
    paperTexture.offset.set(0, 0)
    paperTexture.rotation = 0
    paperTexture.center.set(0.5, 0.5)
    paperTexture.anisotropy = 16
    paperTexture.needsUpdate = true
  }, [paperTexture])

  // Geometry constants
  const woodRadius = 0.2
  const minPaperRadius = 0.42
  const maxPaperRadius = 1.0
  const closedPaperRadius = 1.0

  // Make rod wider so paper reaches ornaments; ornaments extend further outward.
  const rodLength = Math.min(viewport.width - 1.4, 26)
  // Paper covers the FULL rod length so wooden rod isn't visible at the sides.
  const paperSectionLength = rodLength

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
          <meshStandardMaterial color="#1e0f04" roughness={0.75} metalness={0.05} />
        </mesh>

        {/* Paper roll wrapped around rod */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry
            args={[paperRadius, paperRadius, paperSectionLength, 128, 1, false]}
          />
          <meshStandardMaterial
            map={paperTexture}
            color="#b89870"
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Stationary dark sandalwood ornaments — do not spin */}
      <SandalwoodEndCap xOffset={-rodLength / 2} side="left" />
      <SandalwoodEndCap xOffset={rodLength / 2} side="right" />
    </group>
  )
}

/**
 * Dark sandalwood ornamental end cap with silver accent bands.
 * Shape tapers from narrow (inner, touching paper) to large (outer, rounded bulb).
 * Multiple tiers with carved rings create the neo-gothic engraved look.
 */
function SandalwoodEndCap({
  xOffset,
  side,
}: {
  xOffset: number
  side: "left" | "right"
}) {
  const dir = side === "left" ? -1 : 1

  // Dark aged sandalwood materials (reddish-brown, highly detailed)
  const wood = { color: "#3a1a08", roughness: 0.72, metalness: 0.05 }
  const woodDark = { color: "#220d03", roughness: 0.82, metalness: 0.05 }
  const woodMid = { color: "#4a2410", roughness: 0.7, metalness: 0.05 }
  // Silver engraving accents
  const silver = { color: "#b8b8b8", roughness: 0.48, metalness: 0.3 }
  const silverDark = { color: "#6a6a6a", roughness: 0.6, metalness: 0.2 }

  // Shape progression (inner → outer):
  // Each tier's radius grows toward the outer tip. Outer end is the largest round bulb.
  return (
    <group position={[xOffset, 0, 0]}>
      {/* 1. Narrow inner flange (touches paper) */}
      <mesh position={[dir * 0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.22, 0.12, 32]} />
        <meshStandardMaterial {...wood} />
      </mesh>

      {/* 2. Silver inlay ring — engraved groove accent */}
      <mesh position={[dir * 0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.035, 32]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 3. Tier 1 — stepped wood shoulder (larger than inner flange) */}
      <mesh position={[dir * 0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.27, 0.1, 32]} />
        <meshStandardMaterial {...woodMid} />
      </mesh>

      {/* 4. Decorative silver beaded torus (gothic bead-work) */}
      <mesh position={[dir * 0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.32, 0.045, 16, 40]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 5. Carved wood tier — slight cone (neo-gothic tapered shaft) */}
      <mesh position={[dir * 0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.38, 0.16, 32]} />
        <meshStandardMaterial {...wood} />
      </mesh>

      {/* 6. Silver carved band with dark shadow groove */}
      <mesh position={[dir * 0.51, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.04, 32]} />
        <meshStandardMaterial {...silverDark} />
      </mesh>
      <mesh position={[dir * 0.54, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 32]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 7. Wide ornamental shoulder — continues growing outward */}
      <mesh position={[dir * 0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.46, 0.48, 0.12, 32]} />
        <meshStandardMaterial {...woodDark} />
      </mesh>

      {/* 8. Silver engraved collar near bulb */}
      <mesh position={[dir * 0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.48, 0.04, 16, 40]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 9. Inner stem supporting the bulb */}
      <mesh position={[dir * 0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.38, 0.08, 32]} />
        <meshStandardMaterial {...wood} />
      </mesh>

      {/* 10. Large rounded terminus bulb — OUTER end, biggest element */}
      <mesh position={[dir * 0.96, 0, 0]}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <meshStandardMaterial {...woodMid} />
      </mesh>

      {/* 11. Silver cross-band engraving on the bulb (neo-gothic) */}
      <mesh position={[dir * 0.96, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.52, 0.025, 12, 40]} />
        <meshStandardMaterial {...silver} />
      </mesh>
      <mesh position={[dir * 0.96, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.025, 12, 40]} />
        <meshStandardMaterial {...silver} />
      </mesh>

      {/* 12. Small decorative final pip at tip — rounded not pointy */}
      <mesh position={[dir * 1.3, 0, 0]}>
        <sphereGeometry args={[0.18, 28, 28]} />
        <meshStandardMaterial {...wood} />
      </mesh>
    </group>
  )
}
