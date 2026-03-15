"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, ChevronDown, Church, PartyPopper } from "lucide-react"
import { cn } from "@/lib/utils"

export function VenuePreview() {
  const { t, language } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)

  const castleGoogleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Alatskivi+Castle+Lossi+1+60201+Alatskivi+Estonia"
  const churchGoogleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Tartu+Peetri+kirik+Estonia"

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <MapPin className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase">{t.venue.title}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-foreground">
              {language === "et" ? "Tseremoonia & Pidu" : "Ceremony & Reception"}
            </h2>
          </div>

          {/* Two venue cards */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Ceremony - Tartu Peetri Church */}
            <Card className="overflow-hidden border-border bg-card/50">
              <CardContent className="p-0">
                <div className="p-5 sm:p-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Church className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {language === "et" ? "Tseremoonia" : "Ceremony"}
                      </p>
                      <h3 className="font-serif text-xl font-medium text-foreground">
                        {language === "et" ? "Tartu Peetri kirik" : "Tartu St. Peter's Church"}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "et" 
                      ? "Narva mnt 104, 51008 Tartu" 
                      : "Narva mnt 104, 51008 Tartu"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-medium">{language === "et" ? "Algus:" : "Start:"}</span>
                    <span>14:00</span>
                  </div>
                </div>
                <div className="aspect-[16/10] w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2100!2d26.7387!3d58.3776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eb36e3d4e8f5e5%3A0x4b80f7d5c28d0c38!2sTartu%20Peetri%20kirik!5e0!3m2!1sen!2see!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Tartu Peetri Church location"
                    className="w-full h-full grayscale dark:invert dark:contrast-90"
                  />
                </div>
                <div className="p-4">
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <a href={churchGoogleMapsUrl} target="_blank" rel="noopener noreferrer">
                      {t.venue.directions}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reception - Alatskivi Castle */}
            <Card className="overflow-hidden border-border bg-card/50">
              <CardContent className="p-0">
                <div className="p-5 sm:p-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <PartyPopper className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {language === "et" ? "Pidu" : "Reception"}
                      </p>
                      <h3 className="font-serif text-xl font-medium text-foreground">Alatskivi Loss</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{t.venue.address}</p>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-medium">{language === "et" ? "Algus:" : "Start:"}</span>
                    <span>~17:00</span>
                  </div>
                </div>
                
                {/* Castle image and map side by side on larger screens */}
                <div className="grid sm:grid-cols-2">
                  <div className="aspect-[4/3] sm:aspect-auto sm:h-full relative overflow-hidden">
                    <img 
                      src="/alatskivi-castle-estonia.jpg" 
                      alt="Alatskivi Castle" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] sm:aspect-auto sm:h-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2100!2d27.1231!3d58.5967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46eb8d91d2f9f2a5%3A0x4b80f7d5c28d0c38!2sAlatskivi%20Castle!5e0!3m2!1sen!2see!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Alatskivi Castle location"
                      className="w-full h-full min-h-[200px] grayscale dark:invert dark:contrast-90"
                    />
                  </div>
                </div>

                {/* Expandable section */}
                <div className="border-t border-border">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {language === "et" ? "Loe lossist rohkem" : "Read more about the castle"}
                    </span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                  
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="p-4 pt-0 text-sm text-muted-foreground space-y-3">
                      <p>
                        {language === "et"
                          ? "Alatskivi loss on 19. sajandi lõpus ehitatud uusgooti stiilis mõisahoone Tartumaal. Loss on inspireeritud Šotimaal asuvast Balmoral Castle'ist ja on üks Eesti kaunimaid mõisahooneid."
                          : "Alatskivi Castle is a neo-Gothic manor house built in the late 19th century in Tartu County. The castle was inspired by Balmoral Castle in Scotland and is one of the most beautiful manor houses in Estonia."}
                      </p>
                      <p>
                        {language === "et"
                          ? "Loss on tänapäeval avatud külastajatele ning pakub unikaalset keskkonda erinevateks sündmusteks. Lossi ümbritsev park ja järve vaated loovad romantilise atmosfääri."
                          : "Today, the castle is open to visitors and provides a unique environment for various events. The surrounding park and lake views create a romantic atmosphere."}
                      </p>
                      <Button asChild variant="link" size="sm" className="p-0 h-auto text-primary">
                        <a href="https://www.alatskiviloss.ee" target="_blank" rel="noopener noreferrer">
                          {language === "et" ? "Külasta lossi veebilehte" : "Visit castle website"}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <a href={castleGoogleMapsUrl} target="_blank" rel="noopener noreferrer">
                      {t.venue.directions}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Travel info note */}
          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm text-muted-foreground text-center">
                {language === "et"
                  ? "Tartu Peetri kirikust on Alatskivi lossini ~45 km (~45 min autoga). Soovitame pärast tseremooniat liikuda otse toimumispaika."
                  : "From Tartu St. Peter's Church to Alatskivi Castle is ~45 km (~45 min by car). We recommend heading directly to the venue after the ceremony."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
