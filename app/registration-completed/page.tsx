"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ArrowLeft, Globe } from "lucide-react"

const translations = {
  en: {
    title: "Registration Completed!",
    subtitle: "Welcome to the VGaming Battle Arena",
    message: "Your registration and payment have been successfully processed.",
    whatsappTitle: "Join Your WhatsApp Group",
    whatsappMessage: "Click the button below to join your tournament WhatsApp group for updates, announcements, and coordination with other players.",
    joinGroup: "Join WhatsApp Group",
    backHome: "Back to Home",
    contact: "For any questions, contact us at:",
    phone: "+237 6 95 95 21 66",
    congratulations: "Congratulations on joining the tournament!"
  },
  fr: {
    title: "Inscription Terminée!",
    subtitle: "Bienvenue au VGaming Battle Arena",
    message: "Votre inscription et paiement ont été traités avec succès.",
    whatsappTitle: "Rejoignez Votre Groupe WhatsApp",
    whatsappMessage: "Cliquez sur le bouton ci-dessous pour rejoindre le groupe WhatsApp de votre tournoi pour les mises à jour, annonces et coordination avec les autres joueurs.",
    joinGroup: "Rejoindre le Groupe WhatsApp",
    backHome: "Retour à l'Accueil",
    contact: "Pour toute question, contactez-nous au:",
    phone: "+237 6 95 95 21 66",
    congratulations: "Félicitations d'avoir rejoint le tournoi!"
  }
}

export default function RegistrationCompletedPage() {
  const [lang, setLang] = useState<"en" | "fr">("fr")
  const [paymentData, setPaymentData] = useState<any>(null)
  const t = translations[lang]

  useEffect(() => {
    // Get payment data from localStorage
    const data = localStorage.getItem("vgaming-payment")
    if (data) {
      setPaymentData(JSON.parse(data))
    }

    // Check saved language
    const savedLang = localStorage.getItem("vgaming-lang") as "en" | "fr" | null
    if (savedLang) {
      setLang(savedLang)
    }
  }, [])

  // WhatsApp group link (same for all categories as per user)
  const whatsappLink = "https://chat.whatsapp.com/GL4UyhuqkSrAfJQ49rrSjs?mode=gi_t"

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

      {/* Header */}
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <Image
              src="/images/vgaming-logo.png"
              alt="VGaming Logo"
              width={200}
              height={80}
              className="h-20 w-auto mx-auto mb-6"
            />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-green-600">{t.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{t.subtitle}</p>
          <p className="text-lg mb-6">{t.message}</p>
          <p className="text-primary font-semibold text-lg">{t.congratulations}</p>
        </div>
      </div>

      {/* WhatsApp Group Section */}
      <div className="px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 md:p-8 shadow-xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <img src="/images/social.png" alt="whatsapp" className="" />
            </div>

            <h2 className="text-2xl font-bold mb-4">{t.whatsappTitle}</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t.whatsappMessage}</p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/25 hover:shadow-green-600/40 hover:scale-[1.02]"
            >
              {t.joinGroup}
            </a>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-secondary/30 rounded-xl p-6 border border-border">
            <p className="text-muted-foreground mb-2">{t.contact}</p>
            <p className="font-semibold text-foreground">{t.phone}</p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="px-4 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backHome}
          </Link>
        </div>
      </div>
    </div>
  )
}