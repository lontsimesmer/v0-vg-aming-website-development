import { NextRequest, NextResponse } from 'next/server'
import { orangeService, OrangePaymentRequest } from '@/lib/payments/orange'
import { isOrangeConfigured } from '@/lib/payments/config'

export async function POST(request: NextRequest) {
  try {
    if (!isOrangeConfigured()) {
      return NextResponse.json(
        {
          error: 'Orange Money API is not configured',
          details: 'Please set ORANGE_MONEY_CLIENT_ID, ORANGE_MONEY_CLIENT_SECRET, and ORANGE_MONEY_MERCHANT_KEY in .env.local. Get these from https://developer.orange.com/'
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { amount, phoneNumber, enrollmentId } = body

    if (!amount || !phoneNumber || !enrollmentId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, phoneNumber, enrollmentId' },
        { status: 400 }
      )
    }

    // Validate phone number format (Cameroon)
    const phoneRegex = /^(\+237|237)?[2368]\d{8}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    const paymentRequest: OrangePaymentRequest = {
      amount: parseInt(amount),
      currency: 'XAF',
      phoneNumber: phoneNumber.replace(/\s/g, '').replace(/^237/, '+237'),
      orderId: `vgaming-${enrollmentId}-${Date.now()}`,
      description: 'VGaming Tournament Registration Fee'
    }

    const result = await orangeService.requestPayment(paymentRequest)

    if (result.status === 'success') {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        message: 'Payment completed successfully'
      })
    } else if (result.status === 'pending') {
      return NextResponse.json({
        success: true,
        status: 'pending',
        message: 'Payment initiated. Please check your phone for the payment prompt.',
        transactionId: result.transactionId
      })
    } else {
      return NextResponse.json(
        { error: result.message || 'Payment failed' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Orange Payment API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}