const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/B5v2sbcLstGABgVo9xIG/webhook-trigger/bab12b38-fb30-430a-8502-2bb68cb0d96d";

const testData = {
  fullName: "Test User VGaming",
  firstName: "Test",
  lastName: "User VGaming",
  pseudo: "TestGamer237",
  birthDate: "1995-06-15",
  birthPlace: "Yaoundé, Cameroon",
  howHeard: "Social Media",
  howHeardSource: "social",
  phone: "+237698453633",
  level: "amateur",
  hasTeam: "yes",
  categories: "FC26, Billard, Echecs",
  language: "fr",
  source: "VGaming Battle Arena Registration",
  submittedAt: new Date().toISOString(),
  isTest: true
};

async function testWebhook() {
  console.log("=== GHL Webhook Test ===");
  console.log("Webhook URL:", GHL_WEBHOOK_URL);
  console.log("\nSending test data:");
  console.log(JSON.stringify(testData, null, 2));
  console.log("\n");

  try {
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("Response Status:", response.status);
    console.log("Response Status Text:", response.statusText);

    const responseText = await response.text();
    console.log("Response Body:", responseText || "(empty)");

    if (response.ok) {
      console.log("\n SUCCESS: Data sent to GHL webhook!");
      console.log("Check your GHL workflow to confirm the data was received.");
    } else {
      console.log("\n WARNING: Webhook returned non-OK status");
      console.log("The data may still have been received. Check your GHL workflow.");
    }
  } catch (error) {
    console.log("\n ERROR:", error.message);
  }
}

testWebhook();
