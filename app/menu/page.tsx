import { redirect } from "next/navigation"

// Menu selection is now combined with RSVP
export default function MenuPage() {
  redirect("/rsvp")
}
