"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ArrowLeft, Globe } from "lucide-react"

const translations = {
  en: {
    title: "Registration Successful!",
    subtitle: "Thank you for registering for the VGaming Battle Arena",
    message: "Stay tuned! We will contact you as soon as possible with all the details about the tournament.",
    info: "Make sure to follow us on social media for updates and announcements.",
    backHome: "Back to Home",
    contact: "For any questions, contact us at:",
    phone: "+237 698 45 36 33 / +237 677 16 71 63"
  },
  fr: {
    title: "Inscription Réussie!",
    subtitle: "Merci de vous être inscrit au VGaming Battle Arena",
    message: "Restez à l'écoute! Nous vous contacterons dès que possible avec tous les détails du tournoi.",
    info: "Assurez-vous de nous suivre sur les réseaux sociaux pour les mises à jour et les annonces.",
    backHome: "Retour à l'Accueil",
    contact: "Pour toute question, contactez-nous au:",
    phone: "+237 698 45 36 33 / +237 677 16 71 63"
  }
}

export default function ThankYouPage() {
  const [lang, setLang] = useState<"en" | "fr">("fr")
  const t = translations[lang]

  useEffect(() => {
    // Check if there's a saved language preference
    const savedLang = localStorage.getItem("vgaming-lang") as "en" | "fr" | null
    if (savedLang) {
      setLang(savedLang)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{lang === "en" ? "FR" : "EN"}</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/vgaming-logo.png"
              alt="VGaming Logo"
              width={200}
              height={80}
              className="h-20 w-auto mx-auto"
            />
          </div>

          {/* Success Icon */}
          <div className="mb-6 animate-bounce-once">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-4 border-primary">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-orbitron)] text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-primary font-semibold mb-6">
            {t.subtitle}
          </p>

          {/* Message */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8">
            <p className="text-foreground/80 text-lg leading-relaxed mb-4">
              {t.message}
            </p>
            <p className="text-muted-foreground text-sm">
              {t.info}
            </p>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <p className="text-muted-foreground text-sm mb-2">{t.contact}</p>
            <p className="text-primary font-semibold">{t.phone}</p>
          </div>

          {/* Back Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-secondary font-bold text-lg rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30 border-2 border-primary/50"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backHome}
          </Link>

          {/* Social Media */}
          <div className="mt-12 flex justify-center gap-4">
            <a
              href="https://facebook.com/vgaming"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card/50 border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              <svg className="w-5 h-5 text-foreground/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/vgaming"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card/50 border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              <svg className="w-5 h-5 text-foreground/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@vgaming_bastos"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-card/50 border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              <svg className="w-5 h-5 text-foreground/70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}
