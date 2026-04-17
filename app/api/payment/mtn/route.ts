import { NextRequest, NextResponse } from 'next/server'
import { mtnService, MTNPaymentRequest } from '@/lib/payments/mtn'
import { isMTNConfigured } from '@/lib/payments/config'

export async function POST(request: NextRequest) {
  try {
    if (!isMTNConfigured()) {
      return NextResponse.json(
        {
          error: 'MTN Mobile Money API is not configured',
          details: 'Please set MTN_MOMO_API_KEY, MTN_MOMO_API_SECRET, and MTN_MOMO_SUBSCRIPTION_KEY in .env.local. Get these from https://momodeveloper.mtn.com/'
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

    const paymentRequest: MTNPaymentRequest = {
      amount: parseInt(amount),
      currency: 'XAF',
      phoneNumber: phoneNumber.replace(/\s/g, '').replace(/^237/, '+237'),
      externalId: `vgaming-${enrollmentId}-${Date.now()}`,
      payerMessage: 'VGaming Tournament Registration',
      payeeNote: 'Tournament fee payment'
    }

    const result = await mtnService.requestPayment(paymentRequest)

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
    console.error('MTN Payment API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}