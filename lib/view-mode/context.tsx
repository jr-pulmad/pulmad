"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ViewMode = "full" | "ceremony"

interface ViewModeContextType {
  viewMode: ViewMode
}

const ViewModeContext = createContext<ViewModeContextType>({ viewMode: "full" })

function readViewModeCookie(): ViewMode {
  if (typeof document === "undefined") return "full"
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("wedding-view="))
  return match?.split("=")[1] === "ceremony" ? "ceremony" : "full"
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("full")

  useEffect(() => {
    setViewMode(readViewModeCookie())
  }, [])

  return (
    <ViewModeContext.Provider value={{ viewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  return useContext(ViewModeContext)
}
