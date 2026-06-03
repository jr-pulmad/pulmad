"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { InfoSection } from "@/components/info/info-section"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Shirt, Hotel, Car, Baby, MapPin, Calendar, ExternalLink, Palette, Mail, Copy, Check, Navigation, Bus, Dices, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InfoPage() {
  const { t, language } = useI18n()
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [womenOutfitIndex, setWomenOutfitIndex] = useState(0)
  const [menOutfitIndex, setMenOutfitIndex] = useState(0)
  const [womenSpinning, setWomenSpinning] = useState(false)
  const [menSpinning, setMenSpinning] = useState(false)
  
  const email = "kirjaordu@gmail.com"
  
  const copyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    })
  }

  // Outfit suggestions for the dress code randomizer
  const womenOutfits = [
    { et: "Smaragdroheline siidkleit ja kuldsed sandaalid", en: "Emerald green silk dress with gold sandals" },
    { et: "Puuderroosa midi-kleit ja pärlkõrvarõngad", en: "Blush midi dress with pearl earrings" },
    { et: "Tumesinine õhtukleit ja hõbedased kontsad", en: "Navy blue evening gown with silver heels" },
    { et: "Salveiroheline satiinkleit ja kuldne pidukott", en: "Sage green satin dress with gold clutch" },
    { et: "Bordoopunane maksikleit ja elegantsed sandaalid", en: "Burgundy maxi dress with elegant sandals" },
    { et: "Kreemjas pitskleit ja pärlkaelakee", en: "Cream lace dress with pearl necklace" },
    { et: "Tuhmroosa A-lõikeline kleit ja kuldne vöö", en: "Dusty rose A-line dress with gold belt" },
    { et: "Šampanjavärvi siidkleit ja hõbedased kõrvarõngad", en: "Champagne silk dress with silver earrings" },
    { et: "Sinakasroheline maksikleit ja kuldsed aksessuaarid", en: "Teal maxi dress with gold accessories" },
    { et: "Lavendlililla õhtukleit ja pärlkäevõru", en: "Lavender evening dress with pearl bracelet" },
  ]

  const menOutfits = [
    { et: "Tumeroheline ülikond, valge särk ja kuldne lips", en: "Dark green suit, white shirt, and gold tie" },
    { et: "Tumesinine ülikond, helesinine särk ja hõbedane lipsunõel", en: "Navy suit, light blue shirt, and silver tie pin" },
    { et: "Antratsiithall ülikond, valge särk ja smaragdroheline lips", en: "Charcoal suit, white shirt, and emerald tie" },
    { et: "Beež linane ülikond ja valge lahtise kraega särk", en: "Beige linen suit with white open-collar shirt" },
    { et: "Must klassikaline ülikond ja bordoopunane lips", en: "Classic black suit with burgundy tie" },
    { et: "Tumepruun ülikond, kreemjas särk ja kuldne rinnataskurätt", en: "Dark brown suit, cream shirt, and gold pocket square" },
    { et: "Tumehall kolmeosaline ülikond ja hõbedane lips", en: "Dark grey three-piece suit with silver tie" },
    { et: "Metsaroheline pintsak, mustad püksid ja tumesinine lips", en: "Forest green blazer, black trousers, and navy tie" },
    { et: "Tumesinine smoking ja must kikilips", en: "Navy tuxedo with black bow tie" },
    { et: "Oliivroheline ülikond, valge särk ja pruun nahkvöö", en: "Olive suit, white shirt, and brown leather belt" },
  ]

  const randomizeWomenOutfit = () => {
    setWomenSpinning(true)
    let count = 0
    const currentIndex = womenOutfitIndex
    const interval = setInterval(() => {
      // Ensure we don't land on the same outfit
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * womenOutfits.length)
      } while (newIndex === currentIndex && womenOutfits.length > 1)
      setWomenOutfitIndex(newIndex)
      count++
      if (count > 8) {
        clearInterval(interval)
        setWomenSpinning(false)
      }
    }, 100)
  }

  const randomizeMenOutfit = () => {
    setMenSpinning(true)
    let count = 0
    const currentIndex = menOutfitIndex
    const interval = setInterval(() => {
      // Ensure we don't land on the same outfit
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * menOutfits.length)
      } while (newIndex === currentIndex && menOutfits.length > 1)
      setMenOutfitIndex(newIndex)
      count++
      if (count > 8) {
        clearInterval(interval)
        setMenSpinning(false)
      }
    }, 100)
  }

  // Accommodation options near the venue
  const accommodations = [
    {
      name: "Sepikoja Külalistemaja",
      description_et: "Hubane külalistemaja lossi kõrval",
      description_en: "Cozy guesthouse next to the castle",
      distance: "0.2 km",
      link: "https://www.booking.com/hotel/ee/sepikoja-ka1-4lalistemaja.et.html",
    },
    {
      name: "Peipsi Lake House",
      description_et: "Moodne puhkemaja Peipsi järve ääres",
      description_en: "Modern holiday house by Lake Peipsi",
      distance: "20 km",
      link: "https://www.booking.com/hotel/ee/peipsi-lake-house.et.html",
    },
    {
      name: "Hostel Laguun",
      description_et: "Soodne hostel Peipsi ääres",
      description_en: "Budget-friendly hostel by Lake Peipsi",
      distance: "25 km",
      link: "https://laguun.xtadia.com/index.php",
    },
    {
      name: "Tartu hotellid",
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
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{language === "et" ? "Kuupäev" : "Date"}</p>
                      <p className="font-medium text-foreground">{t.hero.date}</p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1.5 transition-all duration-200"
                      onClick={() => {
                        const ua = navigator.userAgent
                        const isIOS = /iPad|iPhone|iPod/.test(ua)
                        const isAndroid = /Android/.test(ua)
                        const isMacSafari = /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua)

                        if (isIOS || isMacSafari) {
                          window.location.href = `/api/calendar?lang=${language}`
                        } else if (isAndroid) {
                          window.location.href = `/api/calendar?lang=${language}`
                        } else {
                          const link = document.createElement("a")
                          link.href = `/api/calendar?lang=${language}`
                          link.download = "johanna-rannar-pulmad.ics"
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }
                      }}
                    >
                      <CalendarPlus className="w-4 h-4" />
                      {language === "et" ? "Lisa kalendrisse" : "Add to Calendar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "et" ? "Laulatus" : "Ceremony"}
                      </p>
                      <p className="font-medium text-foreground text-sm">
                        {language === "et"
                          ? "Maarja-Magdaleena kirik"
                          : "Maarja-Magdaleena Church"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          
              <Card className="bg-secondary/30 border-border">
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "et" ? "Pidu" : "Reception"}
                      </p>
                      <p className="font-medium text-foreground">
                        Alatskivi Loss
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info sections */}
            <div className="space-y-6">
              {/* Schedule */}
              <InfoSection icon={<Clock className="w-5 h-5" />} title={t.info.schedule.title} animatedIcon="clock">
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
                    {/* Reception ends - highlighted */}
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-14 text-sm font-medium text-primary">23:00</div>
                        <div className="text-foreground font-medium">{language === "et" ? "Pulmapeo lõpp" : "Reception ends"}</div>
                      </div>
                      <p className="text-sm ml-[68px]">Alatskivi Loss</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="w-14 text-sm font-medium text-primary">23:00</div>
                      <div className="text-foreground">{language === "et" ? "Järelpidu" : "Afterparty"}</div>
                    </div>
                  </div>
                </div>
              </InfoSection>

              {/* Dress code */}
              <InfoSection icon={<Shirt className="w-5 h-5" />} title={t.info.dressCode.title} animatedIcon="shirt">
                <div className="text-muted-foreground space-y-4">
                  <p>
                    {language === "et"
                      ? "Palume kanda pidulikku riietust, mis sobib elegantse pulmapäeva atmosfääriga. Riietusstiil: formaalne."
                      : "We kindly ask you to wear formal attire suited to an elegant wedding celebration. Dress code: formal."}
                  </p>

                  <p className="text-xs text-muted-foreground/70">
                    {language === "et" ? "Vajad inspiratsiooni? Proovi meie riietusgeneraatorit!" : "Need inspiration? Try our outfit generator!"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Women's outfit randomizer */}
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👗</span>
                          <span className="text-sm font-medium text-foreground">{language === "et" ? "Naistele" : "For Women"}</span>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={randomizeWomenOutfit}
                          disabled={womenSpinning}
                          className={`gap-1.5 transition-all duration-200 ${womenSpinning ? 'scale-95' : 'hover:scale-105'}`}
                        >
                          <Dices className={`w-4 h-4 ${womenSpinning ? 'animate-bounce' : ''}`} />
                          {language === "et" ? "Vali uus!" : "Roll!"}
                        </Button>
                      </div>
                      <div className={`min-h-[60px] flex items-center transition-all duration-150 ${womenSpinning ? 'opacity-50 blur-[1px]' : ''}`}>
                        <p className="text-sm text-foreground">
                          {language === "et" ? womenOutfits[womenOutfitIndex].et : womenOutfits[womenOutfitIndex].en}
                        </p>
                      </div>
                    </div>

                    {/* Men's outfit randomizer */}
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🤵</span>
                          <span className="text-sm font-medium text-foreground">{language === "et" ? "Meestele" : "For Men"}</span>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={randomizeMenOutfit}
                          disabled={menSpinning}
                          className={`gap-1.5 transition-all duration-200 ${menSpinning ? 'scale-95' : 'hover:scale-105'}`}
                        >
                          <Dices className={`w-4 h-4 ${menSpinning ? 'animate-bounce' : ''}`} />
                          {language === "et" ? "Vali uus!" : "Roll!"}
                        </Button>
                      </div>
                      <div className={`min-h-[60px] flex items-center transition-all duration-150 ${menSpinning ? 'opacity-50 blur-[1px]' : ''}`}>
                        <p className="text-sm text-foreground">
                          {language === "et" ? menOutfits[menOutfitIndex].et : menOutfits[menOutfitIndex].en}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </InfoSection>

              {/* Accommodation */}
              <InfoSection icon={<Hotel className="w-5 h-5" />} title={t.info.accommodation.title} animatedIcon="hotel">
                <div className="text-muted-foreground">
                  <p className="mb-4">
                    {language === "et"
                      ? "Majutust me ise ei korralda, kuid soovitame järgmisi võimalusi:"
                      : "We do not arrange accommodation ourselves, but we recommend the following options:"}
                  </p>

                  <div className="space-y-3">
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
                </div>
              </InfoSection>

              {/* Transport */}
              <InfoSection icon={<Car className="w-5 h-5" />} title={t.info.transport.title} animatedIcon="car">
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
                              <Car className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{language === "et" ? "~30 km Alatskivi lossini" : "~30 km to Alatskivi Castle"}</span>
                            </div>
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
                              <span className="text-sm">{language === "et" ? "~45 km Tartust" : "~45 km from Tartu"}</span>
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
              <InfoSection icon={<Baby className="w-5 h-5" />} title={t.info.children.title} animatedIcon="baby">
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
                <InfoSection
                  icon={<Palette className="w-5 h-5" />}
                  title={language === "et" ? "Värvipalett" : "Color Palette"}
                >
                  <div className="text-muted-foreground">
                    <p className="mb-4">
                      {language === "et"
                        ? "Meie pulma värvipalett loob elegantse ja looduslähedase meeleolu. Kaaluge nende toonide kasutamist ka riietuse valimisel."
                        : "Our wedding color palette creates an elegant and natural atmosphere. Feel free to use these tones when choosing your outfit!"}
                    </p>
                
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full aspect-square rounded-lg bg-[#ffbdf7] border border-border shadow-sm" />
                        <span className="text-xs text-foreground">
                          {language === "et" ? "Heleroosa" : "Light Pink"}
                        </span>
                      </div>
                
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full aspect-square rounded-lg bg-[#ff7af6] border border-border shadow-sm" />
                        <span className="text-xs text-foreground">
                          {language === "et" ? "Roosa" : "Pink"}
                        </span>
                      </div>
                
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full aspect-square rounded-lg bg-[#c2dd45] border border-border shadow-sm" />
                        <span className="text-xs text-foreground">
                          {language === "et" ? "Laimiroheline" : "Lime Green"}
                        </span>
                      </div>
                
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full aspect-square rounded-lg bg-[#456011] border border-border shadow-sm" />
                        <span className="text-xs text-foreground">
                          {language === "et" ? "Tume roheline" : "Dark Green"}
                        </span>
                      </div>
                
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full aspect-square rounded-lg bg-[#000000] border border-border shadow-sm" />
                        <span className="text-xs text-foreground">
                          {language === "et" ? "Must" : "Black"}
                        </span>
                      </div>
                
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full aspect-square rounded-lg bg-[#ffffff] border border-border shadow-sm" />
                        <span className="text-xs text-foreground">
                          {language === "et" ? "Valge" : "White"}
                        </span>
                      </div>
                    </div>
                
                    <p className="text-xs text-muted-foreground/70 mt-4">
                      {language === "et"
                        ? "Vihje: valge on pruudile reserveeritud!"
                        : "Hint: white is reserved for the bride!"}
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
