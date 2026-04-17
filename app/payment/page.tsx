"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CreditCard, ArrowLeft, Globe, CheckCircle } from "lucide-react"

const translations = {
  en: {
    title: "Complete Your Registration",
    subtitle: "Payment Information",
    fee: "Registration Fee",
    selectPayment: "Select Payment Method",
    mtnMoney: "MTN Mobile Money",
    orangeMoney: "Orange Money",
    accountName: "Account Name",
    accountNumber: "Account Number / Phone Number",
    proceed: "Proceed to Payment",
    processing: "Processing...",
    back: "Back to Form",
    required: "This field is required",
    paymentSuccess: "Payment Successful!",
    redirecting: "Redirecting to confirmation..."
  },
  fr: {
    title: "Complétez Votre Inscription",
    subtitle: "Informations de Paiement",
    fee: "Frais d'Inscription",
    selectPayment: "Sélectionnez le Mode de Paiement",
    mtnMoney: "MTN Mobile Money",
    orangeMoney: "Orange Money",
    accountName: "Nom du Compte",
    accountNumber: "Numéro de Compte / Téléphone",
    proceed: "Procéder au Paiement",
    processing: "Traitement en cours...",
    back: "Retour au Formulaire",
    required: "Ce champ est requis",
    paymentSuccess: "Paiement Réussi!",
    redirecting: "Redirection vers la confirmation..."
  }
}

export default function PaymentPage() {
  const [lang, setLang] = useState<"en" | "fr">("fr")
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "orange">("mtn")
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [enrollmentData, setEnrollmentData] = useState<any>(null)
  const router = useRouter()
  const t = translations[lang]

  useEffect(() => {
    // Get enrollment data from localStorage
    const data = localStorage.getItem("vgaming-enrollment")
    if (data) {
      setEnrollmentData(JSON.parse(data))
    } else {
      // No enrollment data, redirect back to form
      router.push("/")
    }

    // Check saved language
    const savedLang = localStorage.getItem("vgaming-lang") as "en" | "fr" | null
    if (savedLang) {
      setLang(savedLang)
    }
  }, [router])

  // Calculate registration fee
  const calculateFee = () => {
    if (!enrollmentData) return 0

    const { categories, level } = enrollmentData
    let fee = 0

    // Check if user selected billiard
    if (categories.includes("billiard")) {
      fee = level === "professional" ? 20000 : 5000
    }
    // Check if user selected fc26
    else if (categories.includes("fc26")) {
      fee = level === "professional" ? 10000 : 5000
    }

    return fee
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const fee = calculateFee()

      // Check if payment APIs are configured
      const isMTNConfigured = paymentMethod === 'mtn' && process.env.NEXT_PUBLIC_MTN_CONFIGURED === 'true'
      const isOrangeConfigured = paymentMethod === 'orange' && process.env.NEXT_PUBLIC_ORANGE_CONFIGURED === 'true'

      if (!isMTNConfigured && !isOrangeConfigured) {
        // Simulate payment for testing when APIs are not configured
        console.warn(`[${paymentMethod.toUpperCase()}] Payment API not configured, simulating payment for testing`)

        await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing time

        // Store payment data
        const paymentData = {
          ...enrollmentData,
          paymentMethod,
          accountName,
          accountNumber,
          fee,
          transactionId: `sim-${Date.now()}`,
          paymentStatus: 'completed',
          paymentDate: new Date().toISOString()
        }

        localStorage.setItem("vgaming-payment", JSON.stringify(paymentData))

        alert(`Payment simulation successful! In production, this would process a real ${paymentMethod.toUpperCase()} payment.`)

        // Redirect to registration completed page
        router.push("/registration-completed")
        return
      }

      // Call the appropriate payment API
      const paymentEndpoint = paymentMethod === 'mtn' ? '/api/payment/mtn' : '/api/payment/orange'

      const response = await fetch(paymentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: fee,
          phoneNumber: accountNumber,
          enrollmentId: enrollmentData.id || `temp-${Date.now()}`
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Payment failed')
      }

      if (result.success) {
        // Store payment data
        const paymentData = {
          ...enrollmentData,
          paymentMethod,
          accountName,
          accountNumber,
          fee,
          transactionId: result.transactionId,
          paymentStatus: result.status || 'completed',
          paymentDate: new Date().toISOString()
        }

        localStorage.setItem("vgaming-payment", JSON.stringify(paymentData))

        // Show success message
        alert(result.message || (lang === "en" ? "Payment initiated successfully!" : "Paiement initié avec succès!"))

        // Redirect to registration completed page
        router.push("/registration-completed")
      } else {
        throw new Error(result.error || 'Payment failed')
      }

    } catch (error) {
      console.error("Payment error:", error)
      alert(lang === "en" ? `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}` : `Paiement échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!enrollmentData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const fee = calculateFee()

  return (
    <div className="min-h-screen bg-background text-foreground">
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
        <div className="max-w-md mx-auto text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>

          <Image
            src="/images/vgaming-logo.png"
            alt="VGaming Logo"
            width={200}
            height={80}
            className="h-20 w-auto mx-auto mb-6"
          />

          <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Payment Form */}
      <div className="px-4 pb-8">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-xl space-y-6">
            {/* Fee Display */}
            <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">{t.fee}</div>
              <div className="text-3xl font-bold text-primary">{fee.toLocaleString()} FCFA</div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-3">
                {t.selectPayment}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex flex-col items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "mtn" ? "bg-yellow-500/20 border-yellow-500" : "bg-input border-border hover:border-primary/50"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mtn"
                    checked={paymentMethod === "mtn"}
                    onChange={(e) => setPaymentMethod(e.target.value as "mtn")}
                    className="w-5 h-5 text-yellow-500 accent-yellow-500"
                  />
                  <div className="relative w-12 h-12">
                    <Image
                      src="/images/mtn.png"
                      alt="MTN Mobile Money"
                      fill
                      className="object-contain"
                    />
                  </div>
                </label>

                <label className={`flex flex-col items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "orange" ? "bg-orange-500/20 border-orange-500" : "bg-input border-border hover:border-primary/50"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="orange"
                    checked={paymentMethod === "orange"}
                    onChange={(e) => setPaymentMethod(e.target.value as "orange")}
                    className="w-5 h-5 text-orange-500 accent-orange-500"
                  />
                  <div className="relative w-12 h-12">
                    <Image
                      src="/images/orange.jpg"
                      alt="Orange Money"
                      fill
                      className="object-contain"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  {t.accountName} *
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  {t.accountNumber} *
                </label>
                <input
                  type="tel"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  {t.processing}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {t.proceed}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}