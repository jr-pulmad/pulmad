"use client"

import { useMemo } from "react"

interface BurntEdgeProps {
  side: "left" | "right"
  width?: number
}

/**
 * Realistic burnt paper edge built from SVG.
 * - Subtle irregular profile (small natural variations, not zigzag)
 * - Multi-layered darkening: scorch → char → burnt edge
 * - Sparse ember glow sparks (~1% of area) for realism
 * - Grain noise for texture
 */
export function BurntEdge({ side, width = 70 }: BurntEdgeProps) {
  const isLeft = side === "left"

  const { scorchPath, charPath, embers, ashSpecks } = useMemo(() => {
    const VB_H = 1000
    const VB_W = 120 // viewBox width (the svg scales to the real width)
    const rowCount = 140 // many small variations instead of few big zigzags

    // Char edge sits near the outer side
    const charBase = isLeft ? 30 : VB_W - 30 // deeper burn position
    const scorchBase = isLeft ? 62 : VB_W - 62 // subtler brown transition

    // Deterministic seeded random
    let seed = isLeft ? 1337 : 4711
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    // Scorch (outer, wider, softer) - small natural undulation
    const scorchPoints: string[] = []
    for (let i = 0; i <= rowCount; i++) {
      const y = (i / rowCount) * VB_H
      const noise =
        (rand() - 0.5) * 14 +
        Math.sin(i * 0.11) * 10 +
        Math.sin(i * 0.53) * 5
      const x = isLeft ? scorchBase + noise : scorchBase - noise
      scorchPoints.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    }

    // Char (inner, smaller, darker) - slightly more irregular
    seed = isLeft ? 91 : 271
    const charPoints: string[] = []
    for (let i = 0; i <= rowCount; i++) {
      const y = (i / rowCount) * VB_H
      const noise =
        (rand() - 0.5) * 10 +
        Math.sin(i * 0.17 + 1) * 6 +
        Math.sin(i * 0.61) * 3
      const x = isLeft ? charBase + noise : charBase - noise
      charPoints.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    }

    // Ember sparks - tiny warm glowing dots near the char (~1% of the edge area)
    seed = isLeft ? 5555 : 7777
    const emberList: Array<{ cx: number; cy: number; r: number; color: string }> = []
    const emberCount = 10
    for (let i = 0; i < emberCount; i++) {
      const cy = rand() * VB_H
      const xOffset = rand() * 16 + 8
      const cx = isLeft ? xOffset + charBase - 12 : VB_W - (xOffset + (VB_W - charBase) - 12)
      // Mix of hot orange, red, and yellow-orange
      const colorRoll = rand()
      const color =
        colorRoll < 0.5
          ? "#ff7a20" // bright orange
          : colorRoll < 0.85
          ? "#ffc040" // yellow-orange
          : "#ff3a10" // deep red
      emberList.push({
        cx,
        cy,
        r: rand() * 1.2 + 0.6,
        color,
      })
    }

    // Tiny ash specks (grey) inside the char area for grain
    seed = isLeft ? 3321 : 9813
    const ashList: Array<{ cx: number; cy: number; r: number }> = []
    for (let i = 0; i < 40; i++) {
      const cy = rand() * VB_H
      const xOffset = rand() * 26
      const cx = isLeft ? xOffset : VB_W - xOffset
      ashList.push({ cx, cy, r: rand() * 0.5 + 0.2 })
    }

    const scorchEdge = isLeft
      ? `M0,0 L${scorchPoints.join(" L")} L0,${VB_H} Z`
      : `M${VB_W},0 L${scorchPoints.join(" L")} L${VB_W},${VB_H} Z`
    const charEdge = isLeft
      ? `M0,0 L${charPoints.join(" L")} L0,${VB_H} Z`
      : `M${VB_W},0 L${charPoints.join(" L")} L${VB_W},${VB_H} Z`

    return {
      scorchPath: scorchEdge,
      charPath: charEdge,
      embers: emberList,
      ashSpecks: ashList,
    }
  }, [isLeft])

  // Anchor at the INNER edge of the ornament knobs, not the viewport edge,
  // so burnt edges sit on the paper (between the knobs) as an overlay.
  const positionStyle = isLeft
    ? { left: "var(--scroll-safe-x, 0)" }
    : { right: "var(--scroll-safe-x, 0)" }

  return (
    <div
      className="fixed top-0 bottom-0 pointer-events-none"
      style={{
        ...positionStyle,
        width: `${width}px`,
        zIndex: 5,
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
            <stop offset="0.35" stopColor="#3a1f0c" stopOpacity="0.95" />
            <stop offset="0.65" stopColor="#6a3a18" stopOpacity="0.65" />
            <stop offset="0.88" stopColor="#8a5a30" stopOpacity="0.22" />
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
            <stop offset="0.6" stopColor="#0a0502" stopOpacity="0.9" />
            <stop offset="1" stopColor="#1a0a02" stopOpacity="0" />
          </linearGradient>

          {/* Subtle noise filter for char texture */}
          <filter id={`noise-${side}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.95"
              numOctaves="2"
              seed={isLeft ? 3 : 9}
            />
            <feColorMatrix
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.5 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          {/* Radial glow for embers */}
          <radialGradient id={`ember-glow-${side}`}>
            <stop offset="0" stopColor="#ffdc60" stopOpacity="1" />
            <stop offset="0.3" stopColor="#ff7a20" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff3a10" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer scorched zone - warm brown transition */}
        <path d={scorchPath} fill={`url(#scorch-${side})`} />

        {/* Inner deep char zone - blackest part */}
        <path d={charPath} fill={`url(#char-${side})`} />

        {/* Noise grain over char */}
        <path
          d={charPath}
          fill="#000"
          opacity="0.55"
          filter={`url(#noise-${side})`}
        />

        {/* Ash specks inside the char area */}
        {ashSpecks.map((a, idx) => (
          <circle
            key={`ash-${idx}`}
            cx={a.cx}
            cy={a.cy}
            r={a.r}
            fill="#6a5a48"
            opacity="0.6"
          />
        ))}

        {/* Ember sparks with glow - small hot dots (~1%) */}
        {embers.map((e, idx) => (
          <g key={`ember-${idx}`}>
            {/* Soft outer glow */}
            <circle
              cx={e.cx}
              cy={e.cy}
              r={e.r * 4}
              fill={`url(#ember-glow-${side})`}
              opacity="0.65"
            />
            {/* Hot core */}
            <circle cx={e.cx} cy={e.cy} r={e.r} fill={e.color} opacity="0.95" />
          </g>
        ))}
      </svg>
    </div>
  )
}
