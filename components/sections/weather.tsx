"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card } from "@/components/ui/card"
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  CloudFog,
  CloudLightning,
  Loader2,
  Thermometer,
  Droplets,
  MapPin
} from "lucide-react"

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  description: string
  icon: string
}

// Map weather codes to icons and descriptions
const getWeatherInfo = (code: number, language: string) => {
  const weatherMap: Record<number, { icon: React.ComponentType<{ className?: string }>, et: string, en: string }> = {
    0: { icon: Sun, et: "Selge taevas", en: "Clear sky" },
    1: { icon: Sun, et: "Peamiselt selge", en: "Mainly clear" },
    2: { icon: Cloud, et: "Osaliselt pilves", en: "Partly cloudy" },
    3: { icon: Cloud, et: "Pilves", en: "Overcast" },
    45: { icon: CloudFog, et: "Udu", en: "Foggy" },
    48: { icon: CloudFog, et: "Härmas udu", en: "Rime fog" },
    51: { icon: CloudRain, et: "Kerge uduvihm", en: "Light drizzle" },
    53: { icon: CloudRain, et: "Uduvihm", en: "Moderate drizzle" },
    55: { icon: CloudRain, et: "Tugev uduvihm", en: "Dense drizzle" },
    61: { icon: CloudRain, et: "Kerge vihm", en: "Light rain" },
    63: { icon: CloudRain, et: "Vihm", en: "Moderate rain" },
    65: { icon: CloudRain, et: "Tugev vihm", en: "Heavy rain" },
    71: { icon: CloudSnow, et: "Kerge lumesadu", en: "Light snow" },
    73: { icon: CloudSnow, et: "Lumesadu", en: "Moderate snow" },
    75: { icon: CloudSnow, et: "Tugev lumesadu", en: "Heavy snow" },
    80: { icon: CloudRain, et: "Kerged sajuhood", en: "Light showers" },
    81: { icon: CloudRain, et: "Sajuhood", en: "Moderate showers" },
    82: { icon: CloudRain, et: "Tugev sajuhoog", en: "Violent showers" },
    95: { icon: CloudLightning, et: "Äike", en: "Thunderstorm" },
  }

  const info = weatherMap[code] || weatherMap[2]
  return {
    Icon: info.icon,
    description: language === "et" ? info.et : info.en
  }
}

// Fun weather comments
const getWeatherComment = (temp: number, condition: string, language: string): string => {
  if (language === "et") {
    if (temp > 25) return "Ideaalne ilm väliürituseks! Ärge unustage päikesekreemi."
    if (temp > 20) return "Suurepärane ilm pidustuste jaoks!"
    if (temp > 15) return "Mõnus ilm. Võtke kerge jakk kaasa, igaks juhuks."
    if (temp > 10) return "Natuke jahedam. Kampsun võiks kaasa võtta."
    if (temp > 5) return "Kevadine värskus õhus! Mantel teeks head."
    return "Talvist värskust jagub! Soe riie on hea mõte."
  } else {
    if (temp > 25) return "Perfect weather for an outdoor event! Don't forget sunscreen."
    if (temp > 20) return "Wonderful weather for celebrations!"
    if (temp > 15) return "Pleasant weather. Bring a light jacket, just in case."
    if (temp > 10) return "A bit cooler. A sweater might be nice."
    if (temp > 5) return "Spring freshness in the air! A coat would be welcome."
    return "Winter freshness! Warm clothes are a good idea."
  }
}

export function Weather() {
  const { t, language } = useI18n()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Alatskivi coordinates
        const lat = 58.5997
        const lon = 27.1306
        
        // Using Open-Meteo API (free, no API key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Europe%2FTallinn`
        )
        
        if (!response.ok) throw new Error("Weather fetch failed")
        
        const data = await response.json()
        const current = data.current
        
        setWeather({
          temperature: Math.round(current.temperature_2m),
          condition: String(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          description: "",
          icon: String(current.weather_code)
        })
        setLoading(false)
      } catch {
        setError(true)
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const weatherInfo = weather ? getWeatherInfo(parseInt(weather.icon), language) : null
  const weatherComment = weather ? getWeatherComment(weather.temperature, weather.condition, language) : ""

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-card/50 border-border">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-muted-foreground">
                {language === "et" ? "Laen ilmaandmeid..." : "Loading weather..."}
              </span>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  if (error || !weather) {
    return null // Silently fail - weather is optional
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
              {language === "et" ? "Ilm Alatskivil" : "Weather at Alatskivi"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {language === "et" ? "Praegune ilm toimumiskohas" : "Current weather at the venue"}
            </p>
          </div>

          <Card className="p-6 sm:p-8 bg-card/50 border-border">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Weather icon and temp */}
              <div className="flex items-center gap-4">
                {weatherInfo && (
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <weatherInfo.Icon className="w-12 h-12 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-serif text-4xl sm:text-5xl font-light text-foreground">
                    {weather.temperature}°C
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {weatherInfo?.description}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-20 bg-border" />
              <div className="sm:hidden w-full h-px bg-border" />

              {/* Details */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === "et" ? "Niiskus" : "Humidity"}
                    </p>
                    <p className="text-sm font-medium text-foreground">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {language === "et" ? "Tuul" : "Wind"}
                    </p>
                    <p className="text-sm font-medium text-foreground">{weather.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Alatskivi, Tartumaa</p>
                </div>
              </div>
            </div>

            {/* Fun comment */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center italic">
                "{weatherComment}"
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
