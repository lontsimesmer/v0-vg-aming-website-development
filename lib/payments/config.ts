// MTN Mobile Money API Configuration
const MTN_CONFIG = {
  baseUrl: process.env.MTN_MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com",
  apiKey: process.env.MTN_MOMO_API_KEY,
  apiSecret: process.env.MTN_MOMO_API_SECRET,
  subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY,
  targetEnvironment: process.env.MTN_MOMO_ENVIRONMENT || "sandbox",
  merchantAccount: {
    accountName: "V GROUPE SARL",
    accountNumber: "765064"
  }
}

// Orange Money API Configuration
const ORANGE_CONFIG = {
  baseUrl: process.env.ORANGE_MONEY_BASE_URL || "https://api.orange.com",
  clientId: process.env.ORANGE_MONEY_CLIENT_ID,
  clientSecret: process.env.ORANGE_MONEY_CLIENT_SECRET,
  merchantKey: process.env.ORANGE_MONEY_MERCHANT_KEY,
  environment: process.env.ORANGE_MONEY_ENVIRONMENT || "sandbox",
  merchantAccount: {
    accountName: "V GROUP SARL",
    accountNumber: "906608"
  }
}

// Validation functions
export const isMTNConfigured = () => {
  return process.env.NEXT_PUBLIC_MTN_CONFIGURED === 'true' &&
         !!MTN_CONFIG.apiKey &&
         !!MTN_CONFIG.apiSecret &&
         !!MTN_CONFIG.subscriptionKey;
}

export const isOrangeConfigured = () => {
  return process.env.NEXT_PUBLIC_ORANGE_CONFIGURED === 'true' &&
         !!ORANGE_CONFIG.clientId &&
         !!ORANGE_CONFIG.clientSecret &&
         !!ORANGE_CONFIG.merchantKey;
}

export { MTN_CONFIG, ORANGE_CONFIG }