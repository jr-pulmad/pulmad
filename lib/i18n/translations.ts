export type Language = "et" | "en"

export const translations = {
  et: {
    nav: {
      home: "Avaleht",
      rsvp: "RSVP",
      menu: "Menüü",
      flowers: "Lilled",
      info: "Info",
      updates: "Uuendused",
    },
    // Hero
    hero: {
      date: "19. august 2026",
      venue: "Alatskivi Loss",
      ceremony: "Tartu Jaani kirik",
      reception: "Alatskivi Loss",
      saveTheDate: "Jäta kuupäev meelde",
    },
    // Countdown
    countdown: {
      days: "päeva",
      hours: "tundi",
      minutes: "minutit",
      seconds: "sekundit",
      until: "pulmadeni",
    },
    // CTAs
    cta: {
      rsvp: "Kinnita osalemine",
      menu: "Vali menüü",
      flowers: "Kingi lilli",
      info: "Rohkem infot",
      viewUpdates: "Vaata uuendusi",
      subscribe: "Telli uuendused",
    },
    // Updates section
    updates: {
      title: "Uuendused",
      lastUpdated: "Viimati uuendatud",
      noUpdates: "Hetkel uuendusi pole. Tule varsti tagasi!",
      subscribeTitle: "Ole kursis",
      subscribeText: "Sisesta oma e-mail, et saada teavitusi uute muutuste kohta.",
    },
    // RSVP Page
    rsvp: {
      title: "Kinnita osalemine",
      subtitle: "Palun anna meile teada, kas saad tulla",
      firstName: "Eesnimi",
      lastName: "Perekonnanimi",
      email: "E-mail",
      phone: "Telefon",
      attendance: "Osalemine",
      attendanceOptions: {
        ceremonyAndReception: "Laulatus + pidu",
        ceremonyOnly: "Ainult laulatus",
        cantAttend: "Kahjuks ei saa tulla",
      },
      notes: "Lisamärkused",
      notesPlaceholder: "Kui sul on küsimusi või erisoove, kirjuta siia",
      submit: "Saada vastus",
      success: "Aitäh! Sinu vastus on salvestatud.",
      error: "Midagi läks valesti. Palun proovi uuesti.",
      required: "Kohustuslik väli",
    },
    // Menu Page
    menu: {
      title: "Menüüvalik",
      subtitle: "Palun vali oma pearoog ja märgi allergeenid",
      firstName: "Eesnimi",
      lastName: "Perekonnanimi",
      email: "E-mail",
      mainCourse: "Pearoog",
      mainCourseOptions: {
        placeholder: "Vali pearoog",
        option1: "Veisefilee grillitud köögiviljadega",
        option2: "Lõhe spargelipurega",
        option3: "Kana ürdivõiga",
        option4: "Taimetoitlaste valik (vegan)",
      },
      allergies: "Allergiad ja erisoovid",
      allergiesPlaceholder: "Kirjelda allergiaid ja erisoove (nt gluteen, laktoos, pähklid)",
      submit: "Salvesta valik",
      success: "Aitäh! Menüüvalik on salvestatud.",
      error: "Midagi läks valesti. Palun proovi uuesti.",
      required: "Kohustuslik väli",
      note: "Menüüvalik on saadaval ainult neile, kes on kinnitanud osalemise peol.",
    },
    // Flowers Page
    flowers: {
      title: "Kingi lilli",
      subtitle: "Aita meil luua unustamatu lillekaunistus",
      description:
        "Lillede asemel palume panustada meie floristika eelarvesse. Kõik maksed lähevad otse meie pulmalillede ostuks.",
      presetAmounts: "Vali summa",
      customAmount: "Muu summa",
      customAmountPlaceholder: "Sisesta summa",
      currency: "€",
      donate: "Maksa",
      processing: "Töötlen...",
      success: "Suur tänu sinu panuse eest!",
      cancel: "Makse tühistati. Proovi uuesti.",
      minAmount: "Minimaalne summa on 1€",
    },
    // Info Page
    info: {
      title: "Kasulik info",
      schedule: {
        title: "Ajakava",
        content: "Täpsem ajakava tuleb varsti...",
      },
      dressCode: {
        title: "Riietuskood",
        content: "Info tuleb varsti...",
      },
      accommodation: {
        title: "Majutus",
        content: "Soovitame järgmisi majutuskohti lähedal:",
        discountCode: "Sooduskood",
        copyCode: "Kopeeri",
        copied: "Kopeeritud!",
      },
      transport: {
        title: "Transport ja parkimine",
        content: "Info tuleb varsti...",
      },
      children: {
        title: "Lapsed",
        content: "Lapsed on tseremooniale oodatud. Info peo kohta tuleb varsti...",
      },
      contact: {
        title: "Kontakt",
        content: "Küsimuste korral võta meiega ühendust:",
      },
    },
    // Venue
    venue: {
      title: "Toimumiskoht",
      directions: "Vaata kaarti",
      address: "Lossi 1, 60201 Alatskivi, Tartumaa, Eesti",
    },
    // Footer
    footer: {
      madeWith: "Tehtud armastusega",
      privacy: "Privaatsuspoliitika",
      allRights: "Kõik õigused kaitstud",
    },
    // Forms
    form: {
      email: "E-mail",
      emailPlaceholder: "sinu@email.ee",
      consent: "Nõustun uuenduste saamisega",
      gdprNote: "Sinu andmeid kasutatakse ainult pulmaga seotud info edastamiseks.",
      submit: "Saada",
    },
    // Weather
    weather: {
      title: "Ilm Alatskivil",
      subtitle: "Praegune ilm toimumiskohas",
      humidity: "Niiskus",
      wind: "Tuul",
      loading: "Laen ilmaandmeid...",
    },
    // Common
    common: {
      loading: "Laadin...",
      error: "Viga",
      success: "Õnnestus",
      back: "Tagasi",
      close: "Sulge",
    },
  },
  en: {
    // Navigation
    nav: {
      home: "Home",
      rsvp: "RSVP",
      menu: "Menu",
      flowers: "Flowers",
      info: "Info",
      updates: "Updates",
    },
    // Hero
    hero: {
      date: "19 August 2026",
      venue: "Alatskivi Castle",
      ceremony: "St. John's Church, Tartu",
      reception: "Alatskivi Castle",
      saveTheDate: "Save the Date",
    },
    // Countdown
    countdown: {
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
      until: "until the wedding",
    },
    // CTAs
    cta: {
      rsvp: "RSVP",
      menu: "Select Menu",
      flowers: "Gift Flowers",
      info: "More Info",
      viewUpdates: "View Updates",
      subscribe: "Subscribe to Updates",
    },
    // Updates section
    updates: {
      title: "Updates",
      lastUpdated: "Last updated",
      noUpdates: "No updates yet. Check back soon!",
      subscribeTitle: "Stay Updated",
      subscribeText: "Enter your email to receive notifications about new updates.",
    },
    // RSVP Page
    rsvp: {
      title: "RSVP",
      subtitle: "Please let us know if you can make it",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      attendance: "Attendance",
      attendanceOptions: {
        ceremonyAndReception: "Ceremony + reception",
        ceremonyOnly: "Ceremony only",
        cantAttend: "Sadly can't attend",
      },
      notes: "Additional Notes",
      notesPlaceholder: "If you have any questions or special requests, write them here",
      submit: "Submit Response",
      success: "Thank you! Your response has been saved.",
      error: "Something went wrong. Please try again.",
      required: "Required field",
    },
    // Menu Page
    menu: {
      title: "Menu Selection",
      subtitle: "Please select your main course and note any allergies",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      mainCourse: "Main Course",
      mainCourseOptions: {
        placeholder: "Select main course",
        option1: "Beef fillet with grilled vegetables",
        option2: "Salmon with asparagus puree",
        option3: "Chicken with herb butter",
        option4: "Vegetarian option (vegan)",
      },
      allergies: "Allergies and Dietary Needs",
      allergiesPlaceholder: "Describe allergies and dietary needs (e.g., gluten, lactose, nuts)",
      submit: "Save Selection",
      success: "Thanks! Your menu choice has been saved.",
      error: "Something went wrong. Please try again.",
      required: "Required field",
      note: "Menu selection is only available for those who have confirmed attendance at the reception.",
    },
    // Flowers Page
    flowers: {
      title: "Gift Flowers",
      subtitle: "Help us create an unforgettable floral arrangement",
      description:
        "Instead of bringing flowers, we kindly ask you to contribute to our florist budget. All payments go directly towards our wedding flowers.",
      presetAmounts: "Select amount",
      customAmount: "Custom amount",
      customAmountPlaceholder: "Enter amount",
      currency: "€",
      donate: "Pay",
      processing: "Processing...",
      success: "Thank you so much for your contribution!",
      cancel: "Payment was cancelled. Please try again.",
      minAmount: "Minimum amount is €1",
    },
    // Info Page
    info: {
      title: "Useful Information",
      schedule: {
        title: "Schedule",
        content: "Detailed schedule coming soon...",
      },
      dressCode: {
        title: "Dress Code",
        content: "Information coming soon...",
      },
      accommodation: {
        title: "Accommodation",
        content: "We recommend the following nearby accommodations:",
        discountCode: "Discount Code",
        copyCode: "Copy",
        copied: "Copied!",
      },
      transport: {
        title: "Transport & Parking",
        content: "Information coming soon...",
      },
      children: {
        title: "Children",
        content: "Children are welcome at the ceremony. Party policy information coming soon...",
      },
      contact: {
        title: "Contact",
        content: "For questions, please get in touch:",
      },
    },
    // Venue
    venue: {
      title: "Venue",
      directions: "View Map",
      address: "Lossi 1, 60201 Alatskivi, Tartu County, Estonia",
    },
    // Footer
    footer: {
      madeWith: "Made with love",
      privacy: "Privacy Policy",
      allRights: "All rights reserved",
    },
    // Forms
    form: {
      email: "Email",
      emailPlaceholder: "your@email.com",
      consent: "I agree to receive wedding updates",
      gdprNote: "Your data will only be used for wedding-related communications.",
      submit: "Submit",
    },
    // Weather
    weather: {
      title: "Weather at Alatskivi",
      subtitle: "Current weather at the venue",
      humidity: "Humidity",
      wind: "Wind",
      loading: "Loading weather...",
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      back: "Back",
      close: "Close",
    },
  },
} as const

export type TranslationKeys = typeof translations.et
