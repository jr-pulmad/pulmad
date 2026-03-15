"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, ChevronDown, Church, PartyPopper, Cloud, Sun, CloudRain, CloudSnow, Wind, CloudFog, CloudLightning, Loader2, Droplets, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  icon: string
  isForecast?: boolean
}

const getWeatherInfo = (code: number, language: string) => {
  const weatherMap: Record<number, { icon: React.ComponentType<{ className?: string }>, et: string, en: string }> = {
    0: { icon: Sun, et: "Selge", en: "Clear" },
    1: { icon: Sun, et: "Selge", en: "Clear" },
    2: { icon: Cloud, et: "Pilves", en: "Cloudy" },
    3: { icon: Cloud, et: "Pilves", en: "Overcast" },
    45: { icon: CloudFog, et: "Udu", en: "Fog" },
    48: { icon: CloudFog, et: "Udu", en: "Fog" },
    51: { icon: CloudRain, et: "Vihm", en: "Drizzle" },
    53: { icon: CloudRain, et: "Vihm", en: "Drizzle" },
    55: { icon: CloudRain, et: "Vihm", en: "Drizzle" },
    61: { icon: CloudRain, et: "Vihm", en: "Rain" },
    63: { icon: CloudRain, et: "Vihm", en: "Rain" },
    65: { icon: CloudRain, et: "Vihm", en: "Rain" },
    71: { icon: CloudSnow, et: "Lumi", en: "Snow" },
    73: { icon: CloudSnow, et: "Lumi", en: "Snow" },
    75: { icon: CloudSnow, et: "Lumi", en: "Snow" },
    80: { icon: CloudRain, et: "Sajuhood", en: "Showers" },
    81: { icon: CloudRain, et: "Sajuhood", en: "Showers" },
    82: { icon: CloudRain, et: "Sajuhood", en: "Showers" },
    95: { icon: CloudLightning, et: "Äike", en: "Storm" },
  }
  const info = weatherMap[code] || weatherMap[2]
  return { Icon: info.icon, description: language === "et" ? info.et : info.en }
}

function WeatherWidget({ lat, lon, location }: { lat: number, lon: number, location: string }) {
  const { language } = useI18n()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  // Wedding date: August 19, 2026
  const weddingDate = "2026-08-19"

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First try to get forecast for the wedding date
        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code,relative_humidity_2m_max,wind_speed_10m_max&timezone=Europe%2FTallinn&start_date=${weddingDate}&end_date=${weddingDate}`
        )
        
        if (forecastResponse.ok) {
          const data = await forecastResponse.json()
          if (data.daily && data.daily.time && data.daily.time.includes(weddingDate)) {
            const dayIndex = data.daily.time.indexOf(weddingDate)
            const maxTemp = data.daily.temperature_2m_max[dayIndex]
            const minTemp = data.daily.temperature_2m_min[dayIndex]
            setWeather({
              temperature: Math.round((maxTemp + minTemp) / 2),
              humidity: data.daily.relative_humidity_2m_max?.[dayIndex] || 70,
              windSpeed: Math.round(data.daily.wind_speed_10m_max?.[dayIndex] || 10),
              icon: String(data.daily.weather_code[dayIndex]),
              isForecast: true,
            })
            setLoading(false)
            return
          }
        }

        // If forecast not available for wedding date, show optimistic placeholder
        // Average August weather in Estonia: sunny/partly cloudy, 18-22°C
        setWeather({
          temperature: 20,
          humidity: 65,
          windSpeed: 12,
          icon: "1", // Mostly clear
          isForecast: true,
        })
      } catch {
        // Silently fail with placeholder
        setWeather({
          temperature: 20,
          humidity: 65,
          windSpeed: 12,
          icon: "1",
          isForecast: true,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
    // Refresh daily
    const interval = setInterval(fetchWeather, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [lat, lon])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>{language === "et" ? "Ilm..." : "Weather..."}</span>
      </div>
    )
  }

  if (!weather) return null

  const weatherInfo = getWeatherInfo(parseInt(weather.icon), language)
  const WeatherIcon = weatherInfo.Icon

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 mt-4">
      <div className="p-2 rounded-lg bg-primary/10">
        {weather.isForecast ? (
          <Calendar className="w-5 h-5 text-primary" />
        ) : (
          <WeatherIcon className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">
          {language === "et" ? "19. augusti ilm" : "August 19th weather"}
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-foreground">{weather.temperature}°C</span>
          <span className="text-muted-foreground">{weatherInfo.description}</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}

// Scroll hint component with custom text - clickable
function ScrollHint({ text }: { text: string }) {
  const handleClick = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
  }

  return (
    <button 
      onClick={handleClick}
      className="absolute bottom-8 sm:bottom-8 mt-8 sm:mt-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-80 transition-opacity max-w-xs text-center px-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <span className="text-xs text-muted-foreground/70 leading-relaxed">
        {text}
      </span>
      <ChevronDown className="w-5 h-5 text-muted-foreground/70" />
    </button>
  )
}

export function VenuePreview() {
  const { t, language } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)

  const castleGoogleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Alatskivi+Castle+Lossi+1+60201+Alatskivi+Estonia"
  const churchGoogleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Tartu+Peetri+kirik+Estonia"

  const scrollHintText = language === "et" 
    ? "Vaata kus toimub laulatus ja pidu" 
    : "See where the ceremony and reception take place"

  return (
    <section className="min-h-[100dvh] flex items-center py-16 sm:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <MapPin className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase">{t.venue.title}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-foreground">
              {language === "et" ? "Laulatus & Pidu" : "Ceremony & Reception"}
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
                        {language === "et" ? "Laulatus" : "Ceremony"}
                      </p>
                      <h3 className="font-serif text-xl font-medium text-foreground">
                        {language === "et" ? "Tartu Peetri kirik" : "Tartu St. Peter's Church"}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "et" 
                      ? "Narva mnt 104, 51008 Tartu" 
                      : "Narva mnt 104, 51008 Tartu"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-medium">{language === "et" ? "Algus:" : "Start:"}</span>
                    <span>14:00</span>
                  </div>
                  
                  {/* Weather widget for wedding date */}
                  <WeatherWidget lat={58.3776} lon={26.7387} location="Tartu" />
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
                  <p className="text-sm text-muted-foreground mb-3">{t.venue.address}</p>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span className="font-medium">{language === "et" ? "Algus:" : "Start:"}</span>
                    <span>~17:00</span>
                  </div>
                  
                  {/* Weather widget for wedding date */}
                  <WeatherWidget lat={58.5997} lon={27.1306} location="Alatskivi" />
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
                  ? "Tartu Peetri kirikust on Alatskivi lossini ~45 km (~45 min autoga). Soovitame pärast laulatust liikuda otse toimumispaika."
                  : "From Tartu St. Peter's Church to Alatskivi Castle is ~45 km (~45 min by car). We recommend heading directly to the venue after the ceremony."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Scroll hint with custom text */}
      <ScrollHint text={scrollHintText} />
    </section>
  )
}
