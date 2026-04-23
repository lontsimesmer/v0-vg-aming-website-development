// scripts/test-enrollment-api.ts
async function testEnrollmentAPI() {
  try {
    const response = await fetch("http://localhost:3000/api/enrollment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);

    const data = await response.json();
    console.log("Response Data:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ SUCCESS: Endpoint working correctly");
    } else {
      console.log("❌ FAILED: Check error details above");
    }
  } catch (error) {
    console.error(
      "❌ ERROR:",
      error instanceof Error ? error.message : String(error),
    );
  }
}
testEnrollmentAPI();
