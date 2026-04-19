"use client"

import { useEffect, useState, type ReactNode } from "react"

interface PaperScrollFrameProps {
  children: ReactNode
}

export function PaperScrollFrame({ children }: PaperScrollFrameProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScrollY = window.scrollY
      const progress = scrollHeight > 0 ? Math.min(Math.max(currentScrollY / scrollHeight, 0), 1) : 0
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // As you scroll down: top rod gets thicker (more paper wrapped), bottom rod gets thinner (less paper remaining)
  // Scale from 0.85 (thin rod) to 1.15 (thick with paper)
  const topRodScale = 0.85 + scrollProgress * 0.3
  const bottomRodScale = 1.15 - scrollProgress * 0.3

  return (
    <div className="relative min-h-screen">
      {/* Top photorealistic scroll rod - fixed at top of viewport */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{ 
          height: "var(--scroll-safe-top)",
          zIndex: 100,
        }}
        aria-hidden="true"
      >
        {/* Dark backdrop to hide content edge */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #000 0%, #0a0604 40%, rgba(15,8,2,0.5) 80%, transparent 100%)"
          }}
        />
        {/* Photorealistic rod image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("/textures/scroll-rod-top.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: `scaleY(${topRodScale})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
            filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.6))",
          }}
        />
        {/* Subtle shadow under rod */}
        <div 
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            bottom: -25,
            height: 25,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)"
          }}
        />
      </div>

      {/* Left burnt/charred edge - black irregular burns */}
      <div
        className="fixed left-0 pointer-events-none"
        style={{
          top: "var(--scroll-safe-top)",
          bottom: "var(--scroll-safe-bottom)",
          width: 28,
          zIndex: 99,
        }}
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, 
              rgba(0,0,0,0.95) 0%,
              rgba(8,4,0,0.75) 25%,
              rgba(20,10,2,0.4) 55%,
              rgba(35,20,5,0.15) 80%,
              transparent 100%
            )`,
          }}
        />
        <svg 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 28 200"
        >
          <defs>
            <linearGradient id="burnGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="50%" stopColor="#0a0502" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#1a0f05" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1a0f05" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0 0 Q10 2 4 5 Q16 8 3 11 Q18 14 6 17 Q14 20 7 24 Q20 27 3 31 Q17 34 8 37 Q12 40 9 44 Q22 47 4 50 Q15 54 6 57 Q18 60 7 64 Q14 67 10 71 Q21 74 5 77 Q16 81 8 84 Q19 87 6 91 Q13 94 9 97 Q20 101 4 104 Q17 107 7 111 Q15 114 9 117 Q22 121 5 124 Q14 127 8 131 Q18 134 6 137 Q16 141 10 144 Q23 147 4 150 Q15 154 7 157 Q19 160 8 164 Q13 167 10 170 Q21 174 5 177 Q17 180 7 184 Q14 187 9 190 Q18 194 6 197 Q16 200 3 200 L0 200 Z"
            fill="url(#burnGradLeft)"
          />
        </svg>
        <svg 
          className="absolute inset-0 w-full h-full opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 28 200"
        >
          <path 
            d="M0 10 Q6 11 2 14 Q9 17 3 20 Q7 23 4 26 Q11 30 2 33 Q8 37 5 40 Q10 44 4 47 Q13 51 3 54 Q9 58 5 61 Q7 65 6 68 Q12 72 3 75 Q10 79 4 82 Q8 86 5 89 Q11 93 2 96 Q7 100 4 103 Q9 107 5 110 Q12 114 3 117 Q6 121 7 124 Q13 128 2 131 Q9 135 4 138 Q8 142 5 145 Q11 149 3 152 Q7 156 4 159 Q10 163 5 166 Q13 170 3 173 Q9 177 5 180 Q8 184 6 187 Q11 191 2 194 Q7 198 4 200 L0 200 Z"
            fill="#000000"
          />
        </svg>
      </div>

      {/* Right burnt/charred edge - black irregular burns */}
      <div
        className="fixed right-0 pointer-events-none"
        style={{
          top: "var(--scroll-safe-top)",
          bottom: "var(--scroll-safe-bottom)",
          width: 28,
          zIndex: 99,
        }}
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(-90deg, 
              rgba(0,0,0,0.95) 0%,
              rgba(8,4,0,0.75) 25%,
              rgba(20,10,2,0.4) 55%,
              rgba(35,20,5,0.15) 80%,
              transparent 100%
            )`,
          }}
        />
        <svg 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 28 200"
        >
          <defs>
            <linearGradient id="burnGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="50%" stopColor="#0a0502" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#1a0f05" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1a0f05" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M28 0 Q18 2 24 5 Q12 8 25 11 Q10 14 22 17 Q14 20 21 24 Q8 27 25 31 Q11 34 20 37 Q16 40 19 44 Q6 47 24 50 Q13 54 22 57 Q10 60 21 64 Q14 67 18 71 Q7 74 23 77 Q12 81 20 84 Q9 87 22 91 Q15 94 19 97 Q8 101 24 104 Q11 107 21 111 Q13 114 19 117 Q6 121 23 124 Q14 127 20 131 Q10 134 22 137 Q12 141 18 144 Q5 147 24 150 Q13 154 21 157 Q9 160 20 164 Q15 167 18 170 Q7 174 23 177 Q11 180 21 184 Q14 187 19 190 Q10 194 22 197 Q12 200 25 200 L28 200 Z"
            fill="url(#burnGradRight)"
          />
        </svg>
        <svg 
          className="absolute inset-0 w-full h-full opacity-80"
          preserveAspectRatio="none"
          viewBox="0 0 28 200"
        >
          <path 
            d="M28 10 Q22 11 26 14 Q19 17 25 20 Q21 23 24 26 Q17 30 26 33 Q20 37 23 40 Q18 44 24 47 Q15 51 25 54 Q19 58 23 61 Q21 65 22 68 Q16 72 25 75 Q18 79 24 82 Q20 86 23 89 Q17 93 26 96 Q21 100 24 103 Q19 107 23 110 Q16 114 25 117 Q22 121 21 124 Q15 128 26 131 Q19 135 24 138 Q20 142 23 145 Q17 149 25 152 Q21 156 24 159 Q18 163 23 166 Q15 170 25 173 Q19 177 23 180 Q20 184 22 187 Q17 191 26 194 Q21 198 24 200 L28 200 Z"
            fill="#000000"
          />
        </svg>
      </div>

      {/* Bottom photorealistic scroll rod - fixed at bottom of viewport */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{ 
          height: "var(--scroll-safe-bottom)",
          zIndex: 100,
        }}
        aria-hidden="true"
      >
        {/* Dark backdrop to hide content edge */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #000 0%, #0a0604 40%, rgba(15,8,2,0.5) 80%, transparent 100%)"
          }}
        />
        {/* Photorealistic rod image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("/textures/scroll-rod-bottom.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: `scaleY(${bottomRodScale})`,
            transformOrigin: "bottom center",
            transition: "transform 0.15s ease-out",
            filter: "drop-shadow(0 -8px 12px rgba(0,0,0,0.6))",
          }}
        />
        {/* Subtle shadow above rod */}
        <div 
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: -25,
            height: 25,
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)"
          }}
        />
      </div>

      {/* Subtle paper texture overlay on content area */}
      <div 
        className="fixed pointer-events-none"
        style={{
          top: "var(--scroll-safe-top)",
          bottom: "var(--scroll-safe-bottom)",
          left: 28,
          right: 28,
          backgroundImage: `url("/textures/parchment-paper-v2.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
          mixBlendMode: "multiply",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Main content wrapper - pushed into safe area */}
      <div 
        className="relative"
        style={{
          paddingTop: "var(--scroll-safe-top)",
          paddingBottom: "var(--scroll-safe-bottom)",
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  )
}
