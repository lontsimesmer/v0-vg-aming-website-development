"use client";
import { useState, useEffect } from "react";
import { AlertCircle, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe } from "lucide-react";
const translations = {
  en: {
    title: "Complete Your Registration",
    subtitle: "Payment Information",
    fee: "Registration Fee",
    selectPayment: "Select Payment Method",
    proceed: "Join WhatsApp Group",
    processing: "Processing...",
    back: "Back to Form",
    paymentSuccess: "Payment Successful!",
    redirecting: "Redirecting to confirmation...",
    paymentSteps: "Payment Instructions",
    step1: "Select your preferred payment method (MTN or Orange Money)",
    step2: "Initiate a transfer to the provided account number",
    step3: "Take a screen capture of the successful transfer",
    step4: "Send the screen capture to +237 6 95 95 21 66 via WhatsApp",
    joinWhatsapp: "Send via WhatsApp",
    whatsappMessage: "Click to send your payment proof via WhatsApp",
    screenshotSent: "Screenshot sent! Ready to proceed.",
    awaitingScreenshot: "Send screenshot first",
  },
  fr: {
    title: "Complétez Votre Inscription",
    subtitle: "Informations de Paiement",
    fee: "Frais d'Inscription",
    selectPayment: "Sélectionnez le Mode de Paiement",
    proceed: "Rejoindre le Groupe WhatsApp",
    processing: "Traitement en cours...",
    back: "Retour au Formulaire",
    paymentSuccess: "Paiement Réussi!",
    redirecting: "Redirection vers la confirmation...",
    paymentSteps: "Instructions de Paiement",
    step1: "Sélectionnez votre mode de paiement préféré (MTN ou Orange Money)",
    step2: "Initiez un virement vers le numéro de compte fourni",
    step3: "Prenez une capture d'écran du virement réussi",
    step4: "Envoyez la capture d'écran à +237 6 95 95 21 66 via WhatsApp",
    joinWhatsapp: "Envoyer via WhatsApp",
    whatsappMessage:
      "Cliquez pour envoyer votre preuve de paiement via WhatsApp",
    screenshotSent: "Capture d'écran envoyée! Prêt à continuer.",
    awaitingScreenshot: "Envoyez d'abord la capture",
  },
};
// Image Popup Modal Component
function ImagePopup({
  imageSrc,
  altText,
  onClose,
}: {
  imageSrc: string;
  altText: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <Image
          src={imageSrc}
          alt={altText}
          width={600}
          height={600}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
export default function PaymentPage() {
  const [lang, setLang] = useState<"en" | "fr">("fr");
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "orange">("mtn");
  const [isProcessing, setIsProcessing] = useState(false);
  const [screenshotSent, setScreenshotSent] = useState(false);
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);
  const [selectedImagePopup, setSelectedImagePopup] = useState<
    "mtn" | "orange" | null
  >(null);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const router = useRouter();
  const t = translations[lang];
  useEffect(() => {
    // Get enrollment data from localStorage
    const data = localStorage.getItem("vgaming-enrollment");
    if (data) {
      setEnrollmentData(JSON.parse(data));
    } else {
      // No enrollment data, redirect back to form
      router.push("/");
    }
    // Check saved language
    const savedLang = localStorage.getItem("vgaming-lang") as
      | "en"
      | "fr"
      | null;
    if (savedLang) {
      setLang(savedLang);
    }
  }, [router]);
  // Calculate registration fee
  const calculateFee = () => {
    if (!enrollmentData) return 0;
    const { categories, level } = enrollmentData;
    let fee = 0;
    // Check if user selected billiard
    if (categories.includes("billiard")) {
      fee = level === "professional" ? 20000 : 5000;
    }
    // Check if user selected fc26
    else if (categories.includes("fc26")) {
      fee = level === "professional" ? 10000 : 5000;
    }
    return fee;
  };
  // Handle WhatsApp button click
  const handleWhatsAppClick = () => {
    if (isWhatsappLoading || screenshotSent) return;
    setIsWhatsappLoading(true);

    const message = encodeURIComponent(
      lang === "en"
        ? "Hello, I have completed my payment for VGaming registration. Please find my proof attached."
        : "Bonjour, j'ai complété mon paiement pour l'inscription VGaming. Veuillez trouver ma preuve ci-jointe.",
    );
    const whatsappUrl = `https://wa.me/237695952166?text=${message}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setScreenshotSent(true);
      setIsWhatsappLoading(false);
    }, 1000);
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!screenshotSent) {
      alert(
        lang === "en"
          ? "Please send your screenshot via WhatsApp first"
          : "Veuillez d'abord envoyer votre capture d'écran via WhatsApp",
      );
      return;
    }
    setIsProcessing(true);
    try {
      const fee = calculateFee();
      // Check if payment APIs are configured
      const isMTNConfigured =
        paymentMethod === "mtn" &&
        process.env.NEXT_PUBLIC_MTN_CONFIGURED === "true";
      const isOrangeConfigured =
        paymentMethod === "orange" &&
        process.env.NEXT_PUBLIC_ORANGE_CONFIGURED === "true";
      if (!isMTNConfigured && !isOrangeConfigured) {
        // Simulate payment for testing when APIs are not configured
        console.warn(
          `[${paymentMethod.toUpperCase()}] Payment API not configured, simulating payment for testing`,
        );
        await new Promise((resolve) => setTimeout(resolve, 3000));
        // Store payment data
        const paymentData = {
          ...enrollmentData,
          paymentMethod,
          fee,
          transactionId: `sim-${Date.now()}`,
          paymentStatus: "completed",
          paymentDate: new Date().toISOString(),
        };
        localStorage.setItem("vgaming-payment", JSON.stringify(paymentData));
        // Redirect to registration completed page
        router.push("/registration-completed");
        return;
      }
      // Call the appropriate payment API
      const paymentEndpoint =
        paymentMethod === "mtn" ? "/api/payment/mtn" : "/api/payment/orange";
      const response = await fetch(paymentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: fee,
          phoneNumber: enrollmentData.phone,
          enrollmentId: enrollmentData.id || `temp-${Date.now()}`,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || result.details || "Payment failed");
      }
      if (result.success) {
        // Store payment data
        const paymentData = {
          ...enrollmentData,
          paymentMethod,
          fee,
          transactionId: result.transactionId,
          paymentStatus: result.status || "completed",
          paymentDate: new Date().toISOString(),
        };
        localStorage.setItem("vgaming-payment", JSON.stringify(paymentData));
        // Show success message
        alert(
          result.message ||
            (lang === "en"
              ? "Payment initiated successfully!"
              : "Paiement initié avec succès!"),
        );
        // Redirect to registration completed page
        router.push("/registration-completed");
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        lang === "en"
          ? `Payment failed: ${error instanceof Error ? error.message : "Unknown error"}`
          : `Paiement échoué: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };
  if (!enrollmentData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  const fee = calculateFee();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {isWhatsappLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {lang === "en" ? "FR" : "EN"}
          </span>
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
          <form
            onSubmit={handleSubmit}
            className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-xl space-y-6"
          >
            {/* Fee Display */}
            <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">{t.fee}</div>
              <div className="text-3xl font-bold text-primary">
                {fee.toLocaleString()} FCFA
              </div>
            </div>
            {/* Payment Method Selection with Icons */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-3">
                {t.selectPayment}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* MTN Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("mtn");
                    setSelectedImagePopup("mtn");
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "mtn"
                      ? "bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500/30"
                      : "bg-input border-border hover:border-primary/50"
                  }`}
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src="/images/mtn.png"
                      alt="MTN Mobile Money"
                      fill
                      className="object-contain cursor-pointer hover:scale-110 transition-transform"
                    />
                  </div>
                </button>
                {/* Orange Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("orange");
                    setSelectedImagePopup("orange");
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "orange"
                      ? "bg-orange-500/20 border-orange-500 ring-2 ring-orange-500/30"
                      : "bg-input border-border hover:border-primary/50"
                  }`}
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src="/images/orange.jpg"
                      alt="Orange Money"
                      fill
                      className="object-contain cursor-pointer hover:scale-110 transition-transform"
                    />
                  </div>
                </button>
              </div>
            </div>
            {/* Image Popup Modal */}
            {selectedImagePopup && (
              <ImagePopup
                imageSrc={
                  selectedImagePopup === "mtn"
                    ? "/images/mtn-pay.png"
                    : "/images/orange-pay.png"
                }
                altText={
                  selectedImagePopup === "mtn"
                    ? "MTN Mobile Money"
                    : "Orange Money"
                }
                onClose={() => setSelectedImagePopup(null)}
              />
            )}
            {/* Payment Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t.paymentSteps}
              </h3>
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-foreground/80 pt-0.5">{t.step1}</p>
                </div>
                {/* Step 2 */}
                <div className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-foreground/80 pt-0.5">{t.step2}</p>
                </div>
                {/* Step 3 */}
                <div className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-foreground/80 pt-0.5">{t.step3}</p>
                </div>
                {/* Step 4 - WhatsApp */}
                <div className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground/80 mb-2">{t.step4}</p>
                    <button
                      type="button"
                      onClick={handleWhatsAppClick}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition-all ${
                        screenshotSent
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <img src="/images/whatsapp.png" alt="WhatsApp" />
                      {screenshotSent ? t.joinWhatsapp : t.awaitingScreenshot}
                    </button>
                  </div>
                </div>
                {/* Status Indicator */}
                {screenshotSent && (
                  <div className="flex gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-600 font-medium">
                      {t.screenshotSent}
                    </p>
                  </div>
                )}
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !screenshotSent}
                className={`w-full py-4 font-bold cursor-pointer text-lg rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                  screenshotSent
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/40 hover:scale-[1.02]"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                    {t.processing}
                  </>
                ) : screenshotSent ? (
                  <>{t.proceed}</>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    {lang === "en"
                      ? "Send Screenshot via WhatsApp First"
                      : "Envoyez d'abord la capture via WhatsApp"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
