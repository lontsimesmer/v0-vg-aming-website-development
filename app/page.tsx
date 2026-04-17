"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Menu, X, Globe, MapPin, Phone, Mail, Facebook, Instagram, Youtube, ChevronDown, Upload, Calendar, Gamepad, MessageCircle, DollarSign, Target, Trophy } from "lucide-react"

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const isSupabaseConfigured =
  isValidUrl(SUPABASE_URL) &&
  SUPABASE_ANON_KEY !== "" &&
  !SUPABASE_URL.includes("your_supabase") &&
  !SUPABASE_ANON_KEY.includes("your_")

// Custom TikTok Icon Component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

// Translations
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Disciplines",
      challenge: "Challenge",
      contact: "Contact"
    },
    hero: {
      title: "VGaming Grand Tournament",
      subtitle: "The game reaches a new level.",
      eventInfo: {
        location: "Yaoundé",
        date: "May 16 & 17, 2026",
        prize: "2,000,000 FCFA in Prizes"
      },
      cta: "Join The Challenge",
      scroll: "Scroll to explore"
    },
    about: {
      title: "The Concept",
      subtitle: "A Competition. Pressure. Selection.",
      description: "The VGaming Grand Tournament brings together the most determined players around two major disciplines: EA FC and Billiards.",
      description2: "Here, it's not just about participating.",
      description3: "It's about performing.",
      description4: "It's about winning.",
      edition: "2nd",
      stats: {
        visitors: "Competitors",
        games: "Main Disciplines",
        events: "Tournament Editions",
        years: "Years of Excellence"
      }
    },
    services: {
      title: "Tournament Disciplines",
      subtitle: "Master Two Major Games",
      items: {
        eafc: {
          title: "EA FC",
          description: "64 players (amateurs & pros) | Single-elimination format + Super Final | Fast-paced and intense matches"
        },
        billiards: {
          title: "Billiards",
          description: "64 pro players & 32 amateur players | Group stage + elimination | Precision, strategy, and composure"
        },
      }
    },
    rewards: {
      title: "Over 2,000,000 FCFA up for grabs",
      subtitle: "The best don't leave empty-handed",
      description: "Significant rewards await the players who can prevail in the competition.",
      quote: "The real players stay. The others watch."
    },
    challenge: {
      title: "VGaming Challenge",
      subtitle: "Prove Your Worth",
      description: "The VGaming Grand Tournament is where champions are made. Compete in EA FC and Billiards for a massive 2,000,000 FCFA prize pool. Only the most skilled and determined will claim victory.",
      prize: "Total Prize Pool",
      form: {
        fullName: "Full Name",
        pseudo: "Gamertag / Pseudo",
        birthDate: "Date of Birth",
        birthPlace: "Place of Birth",
        howHeard: "How did you hear about this tournament?",
        howHeardOther: "Please specify",
        photo: "Photo (visible face) - Will be used for match announcements",
        uploadPhoto: "Click to upload or drag and drop",
        phone: "Phone Number",
        level: "Player Level",
        amateur: "Amateur",
        professional: "Professional",
        hasTeam: "Do you have an Ultimate Team?",
        yes: "Yes",
        no: "No",
        categories: "Select your competition category",
        categoriesHint: "Select the discipline(s) you'll compete in",
        submit: "Register Now",
        submitting: "Registering..."
      },
      howHeardOptions: {
        social: "Social Media",
        friend: "Friend / Word of Mouth",
        event: "Previous Event",
        other: "Other"
      },
      categoryOptions: {
        fc26: "EA FC",
        billiard: "Billiards"
      }
    },
    footer: {
      tagline: "Where Champions Compete",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      rights: "All rights reserved.",
      location: "Montée Anor, Bastos, Yaoundé, Cameroon",
      phone: "+237 698 45 36 33 / +237 677 16 71 63",
      email: "contact@vgaming.cm"
    },
    practical: {
      title: "Practical Information",
      location: "Yaounde",
      dates: "May 16 & 17, 2026",
      disciplines: "EA FC / Billiards",
      registration: "Registration open"
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À Propos",
      services: "Disciplines",
      challenge: "Défi",
      contact: "Contact"
    },
    hero: {
      title: "Grand Tournoi VGaming",
      subtitle: "Le jeu atteint un nouveau niveau.",
      eventInfo: {
        location: "Yaoundé",
        date: "16 & 17 Mai 2026",
        prize: "2 000 000 FCFA en Prix"
      },
      cta: "Rejoindre le Défi",
      scroll: "Défiler pour explorer"
    },
    about: {
      title: "Le Concept",
      subtitle: "Une Compétition. De la Pression. De la Sélection.",
      description: "Le Grand Tournoi VGaming rassemble les joueurs les plus déterminés autour de deux disciplines majeures : EA FC et le Billard.",
      description2: "Ici, ce n'est pas seulement une question de participation.",
      description3: "C'est une question de performance.",
      description4: "C'est une question de victoire.",
      edition: "2ème",
      stats: {
        visitors: "Compétiteurs",
        games: "Disciplines Principales",
        events: "Éditions du Tournoi",
        years: "Années d'Excellence"
      }
    },
    services: {
      title: "Disciplines du Tournoi",
      subtitle: "Maîtrisez Deux Jeux Majeurs",
      items: {
        eafc: {
          title: "EA FC",
          description: "64 joueurs (amateurs & pros) | Format à élimination directe + Super Finale | Matchs rapides et intenses"
        },
        billiards: {
          title: "Billard",
          description: "64 joueurs pros & 32 joueurs amateurs | Phase de groupes + élimination | Précision, stratégie et sang-froid"
        },
      }
    },
    rewards: {
      title: "Plus de 2 000 000 FCFA à gagner",
      subtitle: "Les meilleurs ne repartent pas les mains vides",
      description: "Des récompenses significatives attendent les joueurs qui pourront prévaloir dans la compétition.",
      quote: "Les vrais joueurs restent. Les autres regardent."
    },
    challenge: {
      title: "Défi VGaming",
      subtitle: "Prouvez Votre Valeur",
      description: "Le Grand Tournoi VGaming est là où les champions sont créés. Compétez en EA FC et Billard pour un énorme pool de prix de 2 000 000 FCFA. Seuls les plus compétents et les plus déterminés remporteront la victoire.",
      prize: "Pool Total de Prix",
      form: {
        fullName: "Nom et Prénom",
        pseudo: "Pseudo",
        birthDate: "Date de Naissance",
        birthPlace: "Lieu de Naissance",
        howHeard: "Comment avez-vous entendu parler de ce tournoi?",
        howHeardOther: "Veuillez préciser",
        photo: "Photo (visage visible) - Sera utilisée pour annoncer les confrontations",
        uploadPhoto: "Cliquez pour télécharger ou glisser-déposer",
        phone: "Numéro de Téléphone",
        level: "Niveau du Joueur",
        amateur: "Amateur",
        professional: "Professionnel",
        hasTeam: "Avez-vous une équipe Ultimate?",
        yes: "Oui",
        no: "Non",
        categories: "Sélectionnez votre catégorie de compétition",
        categoriesHint: "Sélectionnez la(les) discipline(s) dans laquelle vous allez concourir",
        submit: "S'inscrire Maintenant",
        submitting: "Inscription en cours..."
      },
      howHeardOptions: {
        social: "Réseaux Sociaux",
        friend: "Ami / Bouche à oreille",
        event: "Événement précédent",
        other: "Autre"
      },
      categoryOptions: {
        fc26: "EA FC",
        billiard: "Billard"
      }
    },
    footer: {
      tagline: "Où les Champions Compétissent",
      terms: "Conditions Générales",
      privacy: "Politique de Confidentialité",
      rights: "Tous droits réservés.",
      location: "Montée Anor, Bastos, Yaoundé, Cameroun",
      phone: "+237 698 45 36 33 / +237 677 16 71 63",
      email: "contact@vgaming.cm"
    },
    practical: {
      title: "Informations Pratiques",
      location: "Yaoundé",
      dates: "16 & 17 Mai 2026",
      disciplines: "EA FC / Billard",
      registration: "Inscriptions ouvertes"
    }
  }
}

export default function VGamingPage() {
  const [lang, setLang] = useState<"en" | "fr">("fr")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroOverlayOpacity, setHeroOverlayOpacity] = useState(0.7)
  const [formData, setFormData] = useState({
    fullName: "",
    pseudo: "",
    birthDate: "",
    birthPlace: "",
    howHeard: "",
    howHeardOther: "",
    photo: null as File | null,
    phone: "",
    level: "",
    hasTeam: "",
    categories: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = translations[lang]

  // Hero overlay animation
  useEffect(() => {
    const animateOverlay = () => {
      setHeroOverlayOpacity(0.3)
      setTimeout(() => {
        setHeroOverlayOpacity(0.7)
      }, 3000)
    }

    animateOverlay()
    const interval = setInterval(animateOverlay, 8000)
    return () => clearInterval(interval)
  }, [])

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert photo to base64 if exists
      let photoBase64 = ""
      if (formData.photo) {
        const reader = new FileReader()
        photoBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(formData.photo as File)
        })
      }

      // Prepare enrollment data for API
      const enrollmentData = {
        fullName: formData.fullName,
        pseudo: formData.pseudo,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        howHeard: formData.howHeard === "other" ? formData.howHeardOther : formData.howHeard,
        howHeardSource: formData.howHeard,
        photo: photoBase64,
        phone: formData.phone,
        level: formData.level,
        hasTeam: formData.hasTeam,
        categories: formData.categories.join(", "),
        language: lang,
      }

      if (!isSupabaseConfigured) {
        console.warn("[v0] Supabase configuration missing, skipping backend submission and continuing with local redirect.")

        localStorage.setItem("vgaming-enrollment", JSON.stringify(enrollmentData))
        localStorage.setItem("vgaming-lang", lang)

        window.location.href = "/payment"
        return
      }

      console.log("[v0] Submitting enrollment to API...")

      // Send to API route (handles DB storage + GHL webhook)
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentData),
      })

      const responseClone = response.clone()
      let result: any
      try {
        result = await response.json()
      } catch (e) {
        const rawText = await responseClone.text().catch(() => "")
        const message = e instanceof Error ? e.message : String(e)
        result = { error: `Invalid JSON response: ${message}`, rawText }
      }

      if (!response.ok) {
        const errorMessage = result.error || result.details || result.rawText || JSON.stringify(result)
        console.error("[v0] API error:", {
          status: response.status,
          statusText: response.statusText,
          body: result,
          message: errorMessage,
        })
        throw new Error(errorMessage || `HTTP ${response.status}: ${response.statusText}`)
      }

      console.log("[v0] Enrollment submitted successfully:", result)

      // Store enrollment data for payment page
      localStorage.setItem("vgaming-enrollment", JSON.stringify(enrollmentData))
      localStorage.setItem("vgaming-lang", lang)

      // Redirect to payment page
      window.location.href = "/payment"
    } catch (error) {
      console.error("Submission error:", error)
      alert(lang === "en" ? "An error occurred. Please try again." : "Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#home">
                <Image
                  src="/images/vgaming-logo.png"
                  alt="VGaming Logo"
                  width={160}
                  height={65}
                  className="h-14 md:h-16 w-auto"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground/80 hover:text-primary transition-colors">{t.nav.home}</a>
              <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">{t.nav.about}</a>
              <a href="#services" className="text-foreground/80 hover:text-primary transition-colors">{t.nav.services}</a>
              <a href="#challenge" className="text-foreground/80 hover:text-primary transition-colors">{t.nav.challenge}</a>
              <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors">{t.nav.contact}</a>
            </div>

            {/* Language Toggle & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === "en" ? "fr" : "en")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{lang.toUpperCase()}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-foreground"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className="px-4 py-6 space-y-4">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-foreground/80 hover:text-primary transition-colors">{t.nav.home}</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-foreground/80 hover:text-primary transition-colors">{t.nav.about}</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-foreground/80 hover:text-primary transition-colors">{t.nav.services}</a>
            <a href="#challenge" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-foreground/80 hover:text-primary transition-colors">{t.nav.challenge}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-foreground/80 hover:text-primary transition-colors">{t.nav.contact}</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBDubMyADGNihPJonSsDSXOyouB4uM.png"
            alt="VGaming venue atmosphere"
            fill
            className="object-cover"
            priority
          />
          {/* Animated Overlay */}
          <div
            className="absolute inset-0 bg-black transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: heroOverlayOpacity }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-3 max-w-3xl mx-auto">
          <div className="animate-fade-in-up">
            <span className="inline-block px-5 py-1 rounded-full bg-secondary/40 backdrop-blur-sm border border-primary/40 text-primary text-sm md:text-base mb-6 font-semibold tracking-wide shadow-lg">
              BATTLE ARENA - COMING SOON
            </span>
          </div>

          <div className="mb-6 animate-fade-in-up animation-delay-200">
            <Image
              src="/images/vgaming-logo.png"
              alt="VGaming Logo"
              width={500}
              height={200}
              className="h-32 sm:h-40 md:h-52 lg:h-64 w-auto mx-auto drop-shadow-2xl"
            />
          </div>

          <h2 className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in-up animation-delay-300">
            {t.hero.title}
          </h2>

          <p className="text-xl md:text-2xl text-foreground/80 mb-6 animate-fade-in-up animation-delay-400">
            {t.hero.subtitle}
          </p>

          <div className="grid grid-cols-3 gap-6 mb-10 animate-fade-in-up animation-delay-450 max-w-lg mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                {t.hero.eventInfo.location}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                {t.hero.eventInfo.date}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all duration-300 shadow-lg">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                {t.hero.eventInfo.prize}
              </p>
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-500">
            <a
              href="#challenge"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-secondary font-bold text-lg rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30 border-2 border-primary/50"
            >
              {t.hero.cta}
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center animate-fade-in-up animation-delay-700">
          <p className="text-sm text-foreground/60 mb-2">{t.hero.scroll}</p>
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-30 bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4 border border-primary/20">
                {t.about.subtitle}
              </span>
              <h2 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t.about.title}
              </h2>
              <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                {t.about.description}
              </p>
              <div className="mb-8 space-y-4">
                <p className="text-foreground/70 text-lg leading-relaxed">{t.about.description2}</p>
                <p className="text-foreground/70 text-lg leading-relaxed"><Target className="inline w-5 h-5 text-primary mr-2" /> {t.about.description3}</p>
                <p className="text-foreground/70 text-lg leading-relaxed"><Trophy className="inline w-5 h-5 text-primary mr-2" /> {t.about.description4}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl font-bold text-primary">100+</div>
                  <div className="text-sm text-foreground/60">{t.about.stats.visitors}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-secondary/20 border border-secondary/30 hover:border-secondary/50 transition-colors">
                  <div className="font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl font-bold text-primary">2</div>
                  <div className="text-sm text-foreground/60">{t.about.stats.games}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl font-bold text-primary">{t.about.edition}</div>
                  <div className="text-sm text-foreground/60">{t.about.stats.events}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-secondary/20 border border-secondary/30 hover:border-secondary/50 transition-colors">
                  <div className="font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl font-bold text-primary">1</div>
                  <div className="text-sm text-foreground/60">{t.about.stats.years}</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mchUkGRr4pm8eXlB1VG7zJcKBoYbws.png"
                  alt="VGaming billiards area"
                  width={600}
                  height={700}
                  className="object-cover w-full h-[400px] md:h-[500px] lg:h-[600px] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="px-4 py-3 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
                    <p className="font-[family-name:var(--font-orbitron)] text-primary font-bold">VGaming</p>
                    <p className="text-sm text-foreground/70">Montée Anor, Bastos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-30 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 scroll-animate opacity-0 translate-y-10 transition-all duration-700">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4 border border-primary/20">
              {t.services.subtitle}
            </span>
            <h2 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl lg:text-5xl font-bold">
              {t.services.title}
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* EA FC */}
            <ServiceCard
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-O7yIThYm82gs7P07uFr8NW4TU5bNkD.png"
              title={t.services.items.eafc.title}
              description={t.services.items.eafc.description}
              delay={0}
            />

            {/* Billiards */}
            <ServiceCard
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-GTjVApev14wO3nvTAkslTg5XcpuP79.jpeg"
              title={t.services.items.billiards.title}
              description={t.services.items.billiards.description}
              delay={100}
            />
          </div>
        </div>
      </section>
      {/* Rewards Section */}
      <section id="rewards" className="py-20 md:py-32 bg-gradient-to-b from-background to-card relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center scroll-animate opacity-0 translate-y-10 transition-all duration-700">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4 border border-primary/20">
              {t.rewards.subtitle}
            </span>
            <h2 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {t.rewards.title}
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
              {t.rewards.description}
            </p>

            {/* Quote Block */}
            <blockquote className="relative mb-12 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-l-4 border-primary pl-8 pr-8 py-6 rounded-r-lg shadow-lg">
                <p className="font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl font-bold text-primary italic mb-4">{t.rewards.quote}</p>
                <cite className="text-foreground/60 text-sm font-medium">
                  — VGaming Tournament
                </cite>
              </div>
            </blockquote>
          </div>
        </div>
      </section>
      {/* Challenge Registration Section */}
      <section id="challenge" className="py-20 md:py-25 bg-gradient-to-b from-card to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Info Section */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-medium mb-4 border border-primary/20">
                {t.challenge.subtitle}
              </span>
              <h2 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {t.challenge.title}
              </h2>
              <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                {t.challenge.description}
              </p>

              {/* Prize Card */}
              <div className="relative rounded-2xl overflow-hidden mb-8 h-[300px] md:h-[400px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PUkFBrf1cSkbqMYDsG4XuxJfaLuoRc.png"
                  alt="Battle Arena Poster"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-center bg-secondary/80 backdrop-blur-sm rounded-xl py-4 px-6 border border-primary/30">
                    <p className="text-foreground/90 text-sm mb-2">{t.challenge.prize}</p>
                    <p className="font-[family-name:var(--font-orbitron)] text-4xl md:text-5xl font-black text-primary drop-shadow-lg">
                      2,000,000 <span className="text-xl">FCFA</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Images */}
              <div className="grid grid-cols-3 gap-4">
                <div className="relative rounded-xl overflow-hidden aspect-square">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HJutIyOpbFhCUrlGCRh5IFmApO3XU1.png"
                    alt="VGaming cocktail"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-square">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Df57YQBBkvWOtpKdG1PQOqc9fKC2dh.png"
                    alt="VGaming mojito"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="relative rounded-xl overflow-hidden aspect-square">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uMchVymV6JC68gqmzlibhCRDAHyH1X.png"
                    alt="VGaming food"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 delay-200">
              <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 md:p-8 shadow-xl">
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      {t.challenge.form.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  {/* Pseudo */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      {t.challenge.form.pseudo} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pseudo}
                      onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="ProGamer237"
                    />
                  </div>

                  {/* Birth Date & Place */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        {t.challenge.form.birthDate} *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        {t.challenge.form.birthPlace} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.birthPlace}
                        onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                        placeholder="Yaoundé"
                      />
                    </div>
                  </div>

                  {/* How Heard */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      {t.challenge.form.howHeard} *
                    </label>
                    <select
                      required
                      value={formData.howHeard}
                      onChange={(e) => setFormData({ ...formData, howHeard: e.target.value, howHeardOther: "" })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground"
                    >
                      <option value="">--</option>
                      <option value="social">{t.challenge.howHeardOptions.social}</option>
                      <option value="friend">{t.challenge.howHeardOptions.friend}</option>
                      <option value="event">{t.challenge.howHeardOptions.event}</option>
                      <option value="other">{t.challenge.howHeardOptions.other}</option>
                    </select>
                  </div>

                  {/* How Heard Other - Conditional */}
                  {formData.howHeard === "other" && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        {t.challenge.form.howHeardOther} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.howHeardOther}
                        onChange={(e) => setFormData({ ...formData, howHeardOther: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                        placeholder={lang === "en" ? "Please specify how you heard about us" : "Veuillez préciser comment vous avez entendu parler de nous"}
                      />
                    </div>
                  )}

                  {/* Categories Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      {t.challenge.form.categories} *
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">{t.challenge.form.categoriesHint}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(t.challenge.categoryOptions).map(([key, label]) => (
                        <label
                          key={key}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.categories.includes(key)
                              ? "bg-primary/20 border-primary"
                              : "bg-input border-border hover:border-primary/50"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(key)}
                            onChange={() => handleCategoryChange(key)}
                            className="w-5 h-5 text-primary accent-primary"
                          />
                          <span className="text-foreground/80 text-sm font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      {t.challenge.form.photo} *
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {photoPreview ? (
                        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                          <Image
                            src={photoPreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">{t.challenge.form.uploadPhoto}</p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      {t.challenge.form.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>

                  {/* Player Level */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-3">
                      {t.challenge.form.level} *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="amateur"
                          checked={formData.level === "amateur"}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          className="w-5 h-5 text-primary accent-primary"
                        />
                        <span className="text-foreground/80">{t.challenge.form.amateur}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="professional"
                          checked={formData.level === "professional"}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          className="w-5 h-5 text-primary accent-primary"
                        />
                        <span className="text-foreground/80">{t.challenge.form.professional}</span>
                      </label>
                    </div>
                  </div>

                  {/* Has Team */}
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-3">
                      {t.challenge.form.hasTeam} *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasTeam"
                          value="yes"
                          checked={formData.hasTeam === "yes"}
                          onChange={(e) => setFormData({ ...formData, hasTeam: e.target.value })}
                          className="w-5 h-5 text-primary accent-primary"
                        />
                        <span className="text-foreground/80">{t.challenge.form.yes}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasTeam"
                          value="no"
                          checked={formData.hasTeam === "no"}
                          onChange={(e) => setFormData({ ...formData, hasTeam: e.target.value })}
                          className="w-5 h-5 text-primary accent-primary"
                        />
                        <span className="text-foreground/80">{t.challenge.form.no}</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]"
                  >
                    {isSubmitting ? t.challenge.form.submitting : t.challenge.form.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-secondary/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo & Tagline */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <Image
                  src="/images/vgaming-logo.png"
                  alt="VGaming Logo"
                  width={160}
                  height={65}
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-foreground/60 mb-6">{t.footer.tagline}</p>
              {/* Social Media */}
              <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61576271970269&sk=reels_tab" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.tiktok.com/@vgaming_bastos" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all">
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Practical Information */}
            <div>
              <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-lg mb-4">{t.practical.title}</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/70 text-sm">{t.practical.location}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/70 text-sm">{t.practical.dates}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Gamepad className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/70 text-sm">{t.practical.disciplines}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground/70 text-sm">{t.practical.registration}</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-lg mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#home" className="block text-foreground/70 hover:text-primary transition-colors text-sm">{t.nav.home}</a>
                <a href="#about" className="block text-foreground/70 hover:text-primary transition-colors text-sm">{t.nav.about}</a>
                <a href="#services" className="block text-foreground/70 hover:text-primary transition-colors text-sm">{t.nav.services}</a>
                <a href="#challenge" className="block text-foreground/70 hover:text-primary transition-colors text-sm">{t.nav.challenge}</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-[family-name:var(--font-orbitron)] font-bold text-lg mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-foreground/70 hover:text-primary transition-colors text-sm">{t.footer.terms}</a>
                <a href="#" className="block text-foreground/70 hover:text-primary transition-colors text-sm">{t.footer.privacy}</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-center text-foreground/50 text-sm">
              © {new Date().getFullYear()} VGaming. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll-indicator {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(12px);
            opacity: 0.3;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-scroll-indicator {
          animation: scroll-indicator 2s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
          opacity: 0;
        }

        .scroll-animate.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  )
}

// Service Card Component
function ServiceCard({
  image,
  title,
  description,
  delay
}: {
  image: string
  title: string
  description: string
  delay: number
}) {
  return (
    <figure
      className="scroll-animate opacity-0 translate-y-10 transition-all duration-700 group"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-xl mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 via-transparent to-transparent" />
      </div>
      <figcaption className="text-center">
        <h3 className="font-[family-name:var(--font-orbitron)] text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-foreground/80 text-sm leading-relaxed">
          {description}
        </p>
      </figcaption>
    </figure>
  )
}
