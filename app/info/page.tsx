"use client"

import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { InfoSection, CopyCodeButton } from "@/components/info/info-section"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Shirt, Hotel, Car, Baby, Phone, MapPin, Calendar, ExternalLink, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InfoPage() {
  const { t, language } = useI18n()

  // Sample accommodation data - would be filled in later
  const accommodations = [
    {
      name: "Alatskivi Kõrtsitalu",
      description_et: "Hubane külalistemaja lossi lähedal",
      description_en: "Cozy guesthouse near the castle",
      distance: "0.5 km",
    },
    {
      name: "Tartu hotels",
      description_et: "Mitmeid hotelle Tartu kesklinnas",
      description_en: "Various hotels in Tartu city center",
      distance: "45 km",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-10 sm:mb-14">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-foreground mb-4">
                {t.info.title}
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {language === "et"
                  ? "Kõik, mida pead teadma meie suureks päevaks"
                  : "Everything you need to know for our big day"}
              </p>
            </div>

            {/* Quick info cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "et" ? "Kuupäev" : "Date"}</p>
                    <p className="font-medium text-foreground">{t.hero.date}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "et" ? "Tseremoonia" : "Ceremony"}</p>
                    <p className="font-medium text-foreground text-sm">{language === "et" ? "Tartu Peetri kirik" : "St. Peter's Church"}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === "et" ? "Pidu" : "Reception"}</p>
                    <p className="font-medium text-foreground">Alatskivi Loss</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info sections */}
            <div className="space-y-6">
              {/* Schedule */}
              <InfoSection icon={<Clock className="w-5 h-5" />} title={t.info.schedule.title}>
                <div className="text-muted-foreground">
                  <div className="space-y-4">
                    {/* Ceremony */}
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-14 text-sm font-medium text-primary">14:00</div>
                        <div className="text-foreground font-medium">{language === "et" ? "Tseremoonia" : "Ceremony"}</div>
                      </div>
                      <p className="text-sm ml-[68px]">
                        {language === "et" ? "Tartu Peetri kirik, Narva mnt 104, Tartu" : "St. Peter's Church, Narva mnt 104, Tartu"}
                      </p>
                    </div>
                    {/* Travel */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-4">
                      <Car className="w-4 h-4" />
                      <span>{language === "et" ? "~45 min sõitu Alatskivile" : "~45 min drive to Alatskivi"}</span>
                    </div>
                    {/* Reception */}
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-14 text-sm font-medium text-primary">~17:00</div>
                        <div className="text-foreground font-medium">{language === "et" ? "Pidu algab" : "Reception begins"}</div>
                      </div>
                      <p className="text-sm ml-[68px]">Alatskivi Loss, Lossi 1, Alatskivi</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="w-14 text-sm font-medium text-primary">TBD</div>
                      <div className="text-foreground">{language === "et" ? "Õhtusöök" : "Dinner"}</div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="w-14 text-sm font-medium text-primary">TBD</div>
                      <div className="text-foreground">{language === "et" ? "Tantsimine & pidu" : "Dancing & party"}</div>
                    </div>
                  </div>
                </div>
              </InfoSection>

              {/* Dress code */}
              <InfoSection icon={<Shirt className="w-5 h-5" />} title={t.info.dressCode.title}>
                <div className="text-muted-foreground">
                  <p>{t.info.dressCode.content}</p>
                  <div className="mt-4 p-4 rounded-lg bg-secondary/30 border border-border">
                    <p className="text-sm text-foreground font-medium">{language === "et" ? "Vihje:" : "Hint:"}</p>
                    <p className="text-sm mt-1">
                      {language === "et"
                        ? "Elegantne pidulik riietus. Täpsem info tuleb varsti."
                        : "Elegant formal attire. More details coming soon."}
                    </p>
                  </div>
                </div>
              </InfoSection>

              {/* Accommodation */}
              <InfoSection icon={<Hotel className="w-5 h-5" />} title={t.info.accommodation.title}>
                <div className="text-muted-foreground">
                  <p className="mb-4">{t.info.accommodation.content}</p>

                  <div className="space-y-3 mb-4">
                    {accommodations.map((acc, index) => (
                      <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-foreground">{acc.name}</h4>
                            <p className="text-sm mt-1">
                              {language === "et" ? acc.description_et : acc.description_en}
                            </p>
                          </div>
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                            {acc.distance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{t.info.accommodation.discountCode}:</p>
                    <CopyCodeButton
                      code="RANDMAE2026"
                      copyLabel={t.info.accommodation.copyCode}
                      copiedLabel={t.info.accommodation.copied}
                    />
                  </div>
                </div>
              </InfoSection>

              {/* Transport */}
              <InfoSection icon={<Car className="w-5 h-5" />} title={t.info.transport.title}>
                <div className="text-muted-foreground">
                  <p className="mb-4">{t.info.transport.content}</p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <h4 className="font-medium text-foreground mb-2">{language === "et" ? "Autoga" : "By car"}</h4>
                      <p className="text-sm">
                        {language === "et"
                          ? "Alatskivi Loss asub ~45 km Tartust ja ~210 km Tallinnast. Parkimine on tasuta lossi territooriumil."
                          : "Alatskivi Castle is located ~45 km from Tartu and ~210 km from Tallinn. Free parking available at the castle grounds."}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <h4 className="font-medium text-foreground mb-2">
                        {language === "et" ? "Ühistranspordiga" : "By public transport"}
                      </h4>
                      <p className="text-sm">
                        {language === "et"
                          ? "Info bussitranspordi kohta täiendatakse peagi."
                          : "Information about shuttle service will be updated soon."}
                      </p>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="mt-4 bg-transparent">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Alatskivi+Castle+Lossi+1+60201+Alatskivi+Estonia"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.venue.directions}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </InfoSection>

              {/* Children */}
              <InfoSection icon={<Baby className="w-5 h-5" />} title={t.info.children.title}>
                <div className="text-muted-foreground">
                  <p>{t.info.children.content}</p>
                </div>
              </InfoSection>

              {/* Contact */}
              <InfoSection icon={<Phone className="w-5 h-5" />} title={t.info.contact.title}>
                <div className="text-muted-foreground">
                  <p className="mb-4">{t.info.contact.content}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <span className="text-foreground font-medium">Johanna & Rannar</span>
                    </div>
                    <p className="text-sm">
                      {language === "et" ? "Kontaktandmed lisatakse peagi." : "Contact details will be added soon."}
                    </p>
                  </div>
                </div>
              </InfoSection>

              {/* Theme Palette */}
              <InfoSection icon={<Palette className="w-5 h-5" />} title={language === "et" ? "Värvipalett" : "Color Palette"}>
                <div className="text-muted-foreground">
                  <p className="mb-4">
                    {language === "et"
                      ? "Meie pulma värvipalett inspireerib elegantset ja loomulikku atmosfääri. Kasuta neid toone riietuse valimisel!"
                      : "Our wedding color palette inspires an elegant and natural atmosphere. Feel free to use these tones when choosing your outfit!"}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-lg bg-[#236130] border border-border shadow-sm" />
                      <span className="text-xs text-foreground">{language === "et" ? "Metsaroheline" : "Forest Green"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-lg bg-[#9abc06] border border-border shadow-sm" />
                      <span className="text-xs text-foreground">{language === "et" ? "Laimiroheline" : "Lime Green"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-lg bg-[#ff28b0] border border-border shadow-sm" />
                      <span className="text-xs text-foreground">{language === "et" ? "Magenta" : "Magenta"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-lg bg-[#ffffff] border border-border shadow-sm" />
                      <span className="text-xs text-foreground">{language === "et" ? "Valge" : "White"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-lg bg-[#000000] border border-border shadow-sm" />
                      <span className="text-xs text-foreground">{language === "et" ? "Must" : "Black"}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mt-4">
                    {language === "et"
                      ? "Vihje: Valge on reserveeritud pruudile!"
                      : "Hint: White is reserved for the bride!"}
                  </p>
                </div>
              </InfoSection>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                {language === "et" ? "Küsimusi? Võta meiega ühendust!" : "Questions? Get in touch!"}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/rsvp">{t.cta.rsvp}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <Link href="/">{t.common.back}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
