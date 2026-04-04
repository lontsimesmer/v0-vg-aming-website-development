// Test script to verify GHL webhook connection
// Run with: node scripts/test-ghl-webhook.mjs

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/B5v2sbcLstGABgVo9xIG/webhook-trigger/bab12b38-fb30-430a-8502-2bb68cb0d96d"

const testPayload = {
  // Contact Information
  fullName: "Test User VGaming",
  firstName: "Test",
  lastName: "User VGaming",
  pseudo: "TestGamer123",
  phone: "+237698453633",
  
  // Personal Details
  birthDate: "1995-06-15",
  birthPlace: "Yaoundé, Cameroon",
  
  // Tournament Information
  howHeard: "Social Media",
  howHeardSource: "social",
  level: "amateur",
  hasTeam: "yes",
  categories: "FC26, Billard, Echecs",
  
  // Photo (placeholder for test)
  photo: "",
  
  // Metadata
  language: "fr",
  submittedAt: new Date().toISOString(),
  source: "VGaming Battle Arena Registration",
  formType: "tournament_registration",
  isTest: true
}

async function testWebhook() {
  console.log("Testing GHL Webhook Connection...")
  console.log("Webhook URL:", GHL_WEBHOOK_URL)
  console.log("Payload:", JSON.stringify(testPayload, null, 2))
  
  try {
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(testPayload)
    })

    console.log("\nResponse Status:", response.status, response.statusText)
    
    const responseText = await response.text()
    console.log("Response Body:", responseText || "(empty)")
    
    if (response.ok) {
      console.log("\nSUCCESS: Webhook triggered successfully!")
      console.log("Check your GHL workflow to confirm the data was received.")
    } else {
      console.log("\nFAILED: Webhook returned an error")
    }
  } catch (error) {
    console.error("\nERROR:", error)
  }
}

testWebhook()
