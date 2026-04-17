import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log the webhook data
    console.log('Orange Money Webhook received:', body)

    // Here you would typically:
    // 1. Verify the webhook signature
    // 2. Update the payment status in your database
    // 3. Send confirmation emails/SMS
    // 4. Update enrollment status

    // For now, just acknowledge receipt
    return NextResponse.json({
      status: 'success',
      message: 'Webhook received'
    })

  } catch (error) {
    console.error('Orange Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}