"use client"

import { useEffect } from "react"

/**
 * Scrolls to the element referenced by the URL hash after the page has mounted.
 * The Next.js App Router does not reliably scroll to a hash when navigating
 * from another route, because the target element is often not yet in the DOM
 * when the browser attempts the initial scroll. This retries briefly to catch
 * elements that mount slightly later (e.g. client components with data).
 */
export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const id = decodeURIComponent(hash.slice(1))
    let attempts = 0

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        return
      }
      if (attempts < 20) {
        attempts += 1
        window.setTimeout(tryScroll, 100)
      }
    }

    // Wait a tick so the layout settles before the first attempt.
    const timeout = window.setTimeout(tryScroll, 50)
    return () => window.clearTimeout(timeout)
  }, [])

  return null
}
