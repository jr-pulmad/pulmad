"use client"

import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink } from "lucide-react"

export function VenuePreview() {
  const { t } = useI18n()

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Alatskivi+Castle+Lossi+1+60201+Alatskivi+Estonia"

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <MapPin className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase">{t.venue.title}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-foreground">Alatskivi Loss</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Map embed */}
            <Card className="overflow-hidden border-border bg-card/50">
              <div className="aspect-[4/3] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2100!2d27.1231!3d58.5967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eb8d91d2f9f2a5%3A0x4b80f7d5c28d0c38!2sAlatskivi%20Castle!5e0!3m2!1sen!2see!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(90%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Alatskivi Castle location"
                  className="w-full h-full"
                />
              </div>
            </Card>

            {/* Venue info */}
            <div className="flex flex-col justify-center">
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-foreground mb-2">Alatskivi Loss</h3>
                      <p className="text-sm text-muted-foreground">{t.venue.address}</p>
                    </div>
                  </div>

                  {/* Venue image */}
                  <div className="relative rounded-xl overflow-hidden mb-6 aspect-video">
                    <img src="/alatskivi-castle-estonia.jpg" alt="Alatskivi Castle" className="w-full h-full object-cover" />
                  </div>

                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      {t.venue.directions}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
