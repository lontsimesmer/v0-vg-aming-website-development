// Test script to verify GHL webhook integration
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/B5v2sbcLstGABgVo9xIG/webhook-trigger/62b3b92c-fd4b-4af4-a536-ade5c787b96c"

const testData = {
  fullName: "Test User v0",
  pseudo: "testv0",
  birthDate: "1995-05-15",
  birthPlace: "Douala",
  howHeard: "social_media",
  howHeardSource: "social_media",
  phone: "+237699999999",
  level: "intermediate",
  hasTeam: "no",
  categories: "fc26, efootball",
  language: "en",
  submittedAt: new Date().toISOString(),
  enrollmentId: "test-" + Date.now(),
}

async function testWebhook() {
  console.log("Testing GHL webhook with data:", JSON.stringify(testData, null, 2))
  console.log("\nWebhook URL:", GHL_WEBHOOK_URL)
  console.log("\nSending request...")

  try {
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    console.log("\nResponse Status:", response.status)
    console.log("Response Status Text:", response.statusText)
    
    const responseText = await response.text()
    console.log("Response Body:", responseText || "(empty)")
    
    if (response.ok) {
      console.log("\n✅ SUCCESS: Webhook call completed successfully!")
    } else {
      console.log("\n❌ FAILED: Webhook returned non-OK status")
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message)
  }
}

testWebhook()
