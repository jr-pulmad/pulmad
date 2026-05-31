"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { InfoSection, CopyCodeButton } from "@/components/info/info-section"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Shirt, Hotel, Car, Baby, MapPin, Calendar, ExternalLink, Palette, Mail, Copy, Check, Navigation, Bus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InfoPage() {
  const { t, language } = useI18n()
  const [copiedEmail, setCopiedEmail] = useState(false)
  
  const email = "kirjaordu@gmail.com"
  
  const copyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    })
  }

  // Sample accommodation data - would be filled in later
  const accommodations = [
    {
      name: "Alatskivi Kõrtsitalu",
      description_et: "Hubane külalistemaja lossi lähedal",
      description_en: "Cozy guesthouse near the castle",
      distance: "0.5 km",
      link: "https://www.kortsitalu.ee/",
    },
    {
      name: "Peipsi Veski Puhkemaja",
      description_et: "Maalilises asukohas puhkemaja Peipsi järve ääres",
      description_en: "Scenic guesthouse by Lake Peipsi",
      distance: "15 km",
      link: "https://www.booking.com/hotel/ee/peipsi-veski-puhkemaja.html",
    },
    {
      name: "Tartu hotels",
      description_et: "Mitmeid hotelle Tartu kesklinnas",
      description_en: "Various hotels in Tartu city center",
      distance: "45 km",
      link: "https://www.booking.com/city/ee/tartu.html",
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
                    <p className="text-sm text-muted-foreground">{language === "et" ? "Laulatus" : "Ceremony"}</p>
                    <p className="font-medium text-foreground text-sm">{language === "et" ? "Maarja-Magdaleena kirik" : "Maarja-Magdaleena Church"}</p>
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
                        <div className="text-foreground font-medium">{language === "et" ? "Laulatus" : "Ceremony"}</div>
                      </div>
                      <p className="text-sm ml-[68px]">
                        {language === "et" ? "Maarja-Magdaleena kirik, Maarja-Magdaleena küla, Tartu vald" : "Maarja-Magdaleena Church, Maarja-Magdaleena küla, Tartu vald"}
                      </p>
                    </div>
                    {/* Travel */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-4">
                      <Car className="w-4 h-4" />
                      <span>{language === "et" ? "~30 min sõitu Alatskivi lossini" : "~30 min drive to Alatskivi"}</span>
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
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="w-14 text-sm font-medium text-primary">22:00</div>
                      <div className="text-foreground">{language === "et" ? "Järelpidu" : "Afterparty"}</div>
                    </div>
                  </div>
                </div>
              </InfoSection>

              {/* Dress code */}
              <InfoSection icon={<Shirt className="w-5 h-5" />} title={t.info.dressCode.title}>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    {language === "et"
                      ? "Palume kanda pidulikku riietust, mis sobib elegantse pulmapäeva atmosfääriga. Riietusstiil: formaalne."
                      : "We kindly ask you to wear formal attire suited to an elegant wedding celebration. Dress code: formal."}
                  </p>

                  <p className="text-xs text-muted-foreground/70">
                    {language === "et" ? "Näited:" : "Examples:"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-lg">👗</span>
                      <span className="text-sm">{language === "et" ? "Pikk kleit, elegantne kostüüm, formaalsed kingad" : "Long dress, elegant suit, formal footwear"}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      <span className="text-lg">🤵</span>
                      <span className="text-sm">{language === "et" ? "Tume ülikond, hele särk, lips, formaalsed kingad" : "Dark suit, light shirt, tie, formal shoes"}</span>
                    </div>
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
                            <a
                              href={acc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                            >
                              {language === "et" ? "Vaata" : "View"}
                              <ExternalLink className="w-3 h-3" />
                            </a>
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
                      code="RANDMÄED26"
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

                  <div className="space-y-4">
                    {/* Church transport */}
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {language === "et" ? "Maarja-Magdaleena kirik (laulatus)" : "Maarja-Magdaleena Church (ceremony)"}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{language === "et" ? "~25 km Tartust" : "~25 km from Tartu"}</span>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                              <a
                                href="https://www.google.com/maps/dir/?api=1&destination=Maarja-Magdaleena+kirik+Estonia"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Navigation className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Bus className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{language === "et" ? "Peatus: Maarja-Magdaleena" : "Stop: Maarja-Magdaleena"}</span>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                              <a
                                href="https://peatus.ee/#route_search/to_name/Maarja-Magdaleena"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Castle transport */}
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {language === "et" ? "Alatskivi Loss (pidu)" : "Alatskivi Castle (reception)"}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{language === "et" ? "~45 km Tartust, tasuta parkimine" : "~45 km from Tartu, free parking"}</span>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                              <a
                                href="https://www.google.com/maps/dir/?api=1&destination=Alatskivi+Castle+Lossi+1+60201+Alatskivi+Estonia"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Navigation className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Bus className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{language === "et" ? "Peatus: Alatskivi" : "Stop: Alatskivi"}</span>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                              <a
                                href="https://peatus.ee/#route_search/to_name/Alatskivi"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </InfoSection>

              {/* Children */}
              <InfoSection icon={<Baby className="w-5 h-5" />} title={t.info.children.title}>
                <div className="text-muted-foreground">
                  <p>
                    {language === "et"
                      ? "Lapsed on teretulnud laulatusel kirikus. Õhtune pidustus lossis on planeeritud täiskasvanute üritusena."
                      : "Children are welcome at the church ceremony. The evening reception at the castle is planned as an adults-only event."}
                  </p>
                </div>
              </InfoSection>

              {/* Contact */}
              <InfoSection icon={<Mail className="w-5 h-5" />} title={t.info.contact.title}>
                <div className="text-muted-foreground space-y-3">
                  <p>
                    {language === "et"
                      ? "Võta meiega ühendust — oleme rõõmuga valmis vastama kõikidele küsimustele."
                      : "Reach out to us — we are happy to answer any questions you may have."}
                  </p>
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors group">
                    <a
                      href={`mailto:${email}`}
                      className="flex-1 flex items-center gap-3 cursor-pointer"
                    >
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium group-hover:text-primary transition-colors">{email}</span>
                    </a>
                    <button
                      onClick={copyEmail}
                      className="flex-shrink-0 p-2 rounded hover:bg-foreground/10 transition-colors"
                      title={language === "et" ? "Kopeeri" : "Copy"}
                    >
                      {copiedEmail ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === "et" ? "Kliki e-posti avamiseks või kopeeri aadress" : "Click to open email or copy address"}
                  </p>
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
