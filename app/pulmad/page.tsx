import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * /pulmad — ceremony-only landing.
 * Sets a session cookie that marks this browser session as "ceremony-only".
 * Then redirects to the homepage, which reads the cookie and hides party
 * info, RSVP, and flowers sections.
 */
export default async function PulmadPage() {
  const cookieStore = await cookies()
  cookieStore.set("wedding-view", "ceremony", {
    path: "/",
    httpOnly: false,   // needs to be readable client-side via document.cookie
    sameSite: "lax",
    // No maxAge → session cookie; clears when the browser tab/session closes.
  })
  redirect("/")
}
