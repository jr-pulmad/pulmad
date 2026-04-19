"use client"

import { useMemo } from "react"

interface BurntEdgeProps {
  side: "left" | "right"
}

/**
 * Dramatic burnt paper edge built entirely from SVG.
 * - Jagged irregular profile (procedurally generated zig-zag with random peaks)
 * - Multi-layered darkening: char (near-black), scorch (dark brown), singe (warm brown)
 * - No image assets so we avoid texture glitches / white areas
 */
export function BurntEdge({ side }: BurntEdgeProps) {
  const isLeft = side === "left"

  // Generate a jagged path once per mount.
  // Path is drawn over a 120 × 1000 viewBox, stretched vertically.
  const { jaggedPath, charPath, embers } = useMemo(() => {
    const height = 1000
    const rowCount = 90 // number of jagged points
    const base = isLeft ? 60 : 60 // middle of 120px wide viewbox for the main burn line
    const charBase = isLeft ? 28 : 92 // deeper burn (closer to edge)

    // Seed from side so left/right look different but stable between renders
    let seed = isLeft ? 1337 : 4711
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    // Main scorched line - wider, softer
    const points: string[] = []
    for (let i = 0; i <= rowCount; i++) {
      const y = (i / rowCount) * height
      const noise = (rand() - 0.5) * 60 + Math.sin(i * 0.7) * 18 + Math.sin(i * 0.19) * 28
      const x = isLeft ? Math.max(10, base + noise) : Math.min(110, base - noise)
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }

    // Reset seed for the char layer so it doesn't align exactly with outer
    seed = isLeft ? 91 : 271
    const charPoints: string[] = []
    for (let i = 0; i <= rowCount; i++) {
      const y = (i / rowCount) * height
      const noise = (rand() - 0.5) * 40 + Math.sin(i * 0.9 + 1) * 16 + Math.sin(i * 0.27) * 20
      const x = isLeft ? Math.max(2, charBase + noise) : Math.min(118, charBase - noise)
      charPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    }

    // Ember holes: small irregular black patches away from the edge that look like burn-through
    seed = isLeft ? 5555 : 7777
    const emberList: Array<{ cx: number; cy: number; r: number; rx: number; ry: number }> = []
    for (let i = 0; i < 8; i++) {
      const cy = rand() * height
      const offset = rand() * 35 + 15
      const cx = isLeft ? offset : 120 - offset
      const rx = rand() * 10 + 4
      const ry = rand() * 14 + 5
      emberList.push({ cx, cy, r: rx, rx, ry })
    }

    const outerEdge = isLeft
      ? `M0,0 L${points.join(" L")} L0,${height} Z`
      : `M120,0 L${points.join(" L")} L120,${height} Z`

    const charEdge = isLeft
      ? `M0,0 L${charPoints.join(" L")} L0,${height} Z`
      : `M120,0 L${charPoints.join(" L")} L120,${height} Z`

    return { jaggedPath: outerEdge, charPath: charEdge, embers: emberList }
  }, [isLeft])

  const positionStyle = isLeft ? { left: 0 } : { right: 0 }

  return (
    <div
      className="fixed top-0 bottom-0 pointer-events-none"
      style={{
        ...positionStyle,
        width: "120px",
        zIndex: 30,
      }}
      aria-hidden
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 120 1000"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <defs>
          {/* Outer scorch gradient - warm brown fading into paper */}
          <linearGradient
            id={`scorch-${side}`}
            x1={isLeft ? "0" : "1"}
            y1="0"
            x2={isLeft ? "1" : "0"}
            y2="0"
          >
            <stop offset="0" stopColor="#1a0a02" stopOpacity="1" />
            <stop offset="0.25" stopColor="#3a1f0c" stopOpacity="0.98" />
            <stop offset="0.55" stopColor="#5c3418" stopOpacity="0.85" />
            <stop offset="0.8" stopColor="#7a4a24" stopOpacity="0.45" />
            <stop offset="1" stopColor="#8a5a30" stopOpacity="0" />
          </linearGradient>

          {/* Inner char gradient - nearly pure black */}
          <linearGradient
            id={`char-${side}`}
            x1={isLeft ? "0" : "1"}
            y1="0"
            x2={isLeft ? "1" : "0"}
            y2="0"
          >
            <stop offset="0" stopColor="#000000" stopOpacity="1" />
            <stop offset="0.6" stopColor="#0a0502" stopOpacity="0.95" />
            <stop offset="1" stopColor="#1a0a02" stopOpacity="0" />
          </linearGradient>

          {/* Subtle noise filter for texture on char */}
          <filter id={`noise-${side}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={isLeft ? 3 : 9} />
            <feColorMatrix
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.55 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* Outer scorched zone - wide, jagged */}
        <path d={jaggedPath} fill={`url(#scorch-${side})`} />

        {/* Inner deep char zone - smaller, darker */}
        <path d={charPath} fill={`url(#char-${side})`} />

        {/* Noise overlay on char for grainy texture */}
        <path
          d={charPath}
          fill="#000"
          opacity="0.6"
          filter={`url(#noise-${side})`}
        />

        {/* Ember burn holes for extra irregularity */}
        {embers.map((e, idx) => (
          <ellipse
            key={idx}
            cx={e.cx}
            cy={e.cy}
            rx={e.rx}
            ry={e.ry}
            fill="#0a0502"
            opacity="0.85"
          />
        ))}
      </svg>
    </div>
  )
}
