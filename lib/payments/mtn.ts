import { MTN_CONFIG } from './config'

export interface MTNPaymentRequest {
  amount: number
  currency: string
  phoneNumber: string
  externalId: string
  payerMessage: string
  payeeNote: string
}

export interface MTNPaymentResponse {
  status: 'success' | 'pending' | 'failed'
  transactionId?: string
  message?: string
}

class MTNMobileMoneyService {
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    const auth = Buffer.from(`${MTN_CONFIG.apiKey}:${MTN_CONFIG.apiSecret}`).toString('base64')

    const response = await fetch(`${MTN_CONFIG.baseUrl}/collection/token/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Ocp-Apim-Subscription-Key': MTN_CONFIG.subscriptionKey!,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`MTN Auth failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000))

    return this.accessToken
  }

  async requestPayment(request: MTNPaymentRequest): Promise<MTNPaymentResponse> {
    try {
      const token = await this.getAccessToken()

      const paymentRequest = {
        amount: request.amount.toString(),
        currency: request.currency,
        externalId: request.externalId,
        payer: {
          partyIdType: "MSISDN",
          partyId: request.phoneNumber
        },
        payerMessage: request.payerMessage,
        payeeNote: request.payeeNote
      }

      const response = await fetch(`${MTN_CONFIG.baseUrl}/collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Reference-Id': request.externalId,
          'X-Target-Environment': MTN_CONFIG.targetEnvironment,
          'Ocp-Apim-Subscription-Key': MTN_CONFIG.subscriptionKey!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
      })

      if (response.status === 202) {
        // Payment request accepted, now check status
        return await this.checkPaymentStatus(request.externalId)
      }

      const errorData = await response.json()
      throw new Error(`MTN Payment request failed: ${errorData.message || response.statusText}`)

    } catch (error) {
      console.error('MTN Payment error:', error)
      return {
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async checkPaymentStatus(referenceId: string): Promise<MTNPaymentResponse> {
    try {
      const token = await this.getAccessToken()

      const response = await fetch(`${MTN_CONFIG.baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': MTN_CONFIG.targetEnvironment,
          'Ocp-Apim-Subscription-Key': MTN_CONFIG.subscriptionKey!
        }
      })

      if (!response.ok) {
        throw new Error(`MTN Status check failed: ${response.status}`)
      }

      const data = await response.json()

      switch (data.status) {
        case 'SUCCESSFUL':
          return {
            status: 'success',
            transactionId: data.financialTransactionId
          }
        case 'PENDING':
        case 'FAILED':
          return {
            status: 'pending',
            message: 'Payment is being processed'
          }
        default:
          return {
            status: 'failed',
            message: `Payment ${data.status?.toLowerCase() || 'failed'}`
          }
      }

    } catch (error) {
      console.error('MTN Status check error:', error)
      return {
        status: 'failed',
        message: error instanceof Error ? error.message : 'Status check failed'
      }
    }
  }
}

export const mtnService = new MTNMobileMoneyService()