"use client"

import { useI18n } from "@/lib/i18n/context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  const { language } = useI18n()

  const content = {
    et: {
      title: "Privaatsuspoliitika",
      intro:
        "Käesolev privaatsuspoliitika kirjeldab, kuidas me kogume ja kasutame teie isikuandmeid seoses meie pulmaveebilehega.",
      sections: [
        {
          title: "Kogutavad andmed",
          content:
            "Me kogume järgmisi andmeid: nimi, e-posti aadress, telefoninumber (valikuline), toidueelistused ja allergiad, ning osalemise kinnitus.",
        },
        {
          title: "Andmete kasutamine",
          content:
            "Teie andmeid kasutatakse ainult pulmade korraldamisega seotud eesmärkidel: osalejate loendi koostamine, menüüvalikute haldamine, ja teiega ühenduse võtmine pulmadega seotud info jagamiseks.",
        },
        {
          title: "Andmete säilitamine",
          content: "Teie andmeid säilitatakse Google Sheetsis ja kustutatakse 6 kuu jooksul pärast pulmasid.",
        },
        {
          title: "Turvalisus",
          content: "Me rakendame asjakohaseid tehnilisi ja organisatsioonilisi meetmeid teie andmete kaitsmiseks.",
        },
        {
          title: "Teie õigused",
          content:
            "Teil on õigus oma andmetele ligi pääseda, neid parandada või kustutada. Palun võtke meiega ühendust, kui soovite oma õigusi kasutada.",
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      intro:
        "This privacy policy describes how we collect and use your personal data in connection with our wedding website.",
      sections: [
        {
          title: "Data We Collect",
          content:
            "We collect the following data: name, email address, phone number (optional), food preferences and allergies, and attendance confirmation.",
        },
        {
          title: "How We Use Your Data",
          content:
            "Your data is used solely for wedding organization purposes: creating the guest list, managing menu selections, and contacting you with wedding-related information.",
        },
        {
          title: "Data Retention",
          content: "Your data is stored in Google Sheets and will be deleted within 6 months after the wedding.",
        },
        {
          title: "Security",
          content: "We implement appropriate technical and organizational measures to protect your data.",
        },
        {
          title: "Your Rights",
          content:
            "You have the right to access, correct, or delete your data. Please contact us if you wish to exercise your rights.",
        },
      ],
    },
  }

  const c = content[language]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card/50 border-border">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl sm:text-3xl font-medium text-foreground">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{c.intro}</p>

                {c.sections.map((section, index) => (
                  <div key={index}>
                    <h2 className="font-medium text-foreground mb-2">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.content}</p>
                  </div>
                ))}

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground/60">
                    {language === "et" ? "Viimati uuendatud: jaanuar 2025" : "Last updated: January 2025"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
