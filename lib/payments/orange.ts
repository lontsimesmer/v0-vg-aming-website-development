import { ORANGE_CONFIG } from './config'

export interface OrangePaymentRequest {
  amount: number
  currency: string
  phoneNumber: string
  orderId: string
  description: string
}

export interface OrangePaymentResponse {
  status: 'success' | 'pending' | 'failed'
  transactionId?: string
  message?: string
}

class OrangeMoneyService {
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials'
    })

    const auth = Buffer.from(`${ORANGE_CONFIG.clientId}:${ORANGE_CONFIG.clientSecret}`).toString('base64')

    const response = await fetch(`${ORANGE_CONFIG.baseUrl}/oauth/v3/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params
    })

    if (!response.ok) {
      throw new Error(`Orange Auth failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000))

    return this.accessToken
  }

  async requestPayment(request: OrangePaymentRequest): Promise<OrangePaymentResponse> {
    try {
      const token = await this.getAccessToken()

      const paymentRequest = {
        merchant_key: ORANGE_CONFIG.merchantKey,
        currency: request.currency,
        order_id: request.orderId,
        amount: request.amount,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`,
        notif_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/orange/webhook`,
        lang: 'fr',
        reference: request.orderId
      }

      const response = await fetch(`${ORANGE_CONFIG.baseUrl}/orange-money-webpay/dev/v1/webpayment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Orange Payment request failed: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()

      if (data.status === 'INITIATED') {
        return {
          status: 'pending',
          transactionId: data.pay_token,
          message: 'Payment initiated. User will receive SMS to complete payment.'
        }
      }

      return {
        status: 'failed',
        message: 'Payment initiation failed'
      }

    } catch (error) {
      console.error('Orange Payment error:', error)
      return {
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async checkPaymentStatus(orderId: string): Promise<OrangePaymentResponse> {
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${ORANGE_CONFIG.baseUrl}/orange-money-webpay/dev/v1/transactionstatus/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Orange Status check failed: ${response.status}`)
      }

      const data = await response.json()

      switch (data.status) {
        case 'SUCCESS':
        case 'COMPLETED':
          return {
            status: 'success',
            transactionId: data.txId
          }
        case 'PENDING':
        case 'INITIATED':
          return {
            status: 'pending',
            message: 'Payment is being processed'
          }
        case 'FAILED':
        case 'CANCELLED':
          return {
            status: 'failed',
            message: `Payment ${data.status?.toLowerCase() || 'failed'}`
          }
        default:
          return {
            status: 'pending',
            message: 'Payment status unknown'
          }
      }

    } catch (error) {
      console.error('Orange Status check error:', error)
      return {
        status: 'failed',
        message: error instanceof Error ? error.message : 'Status check failed'
      }
    }
  }
}

export const orangeService = new OrangeMoneyService()