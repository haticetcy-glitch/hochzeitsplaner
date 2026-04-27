import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createServerClient()

    const { error } = await supabase.from('inquiries').insert({
      vendor_id: body.vendor_id,
      partner1_name: body.partner1_name,
      partner2_name: body.partner2_name,
      email: body.email,
      phone: body.phone,
      wedding_date: body.wedding_date,
      guest_count: body.guest_count,
      message: body.message,
    })

    if (error) throw error

    // TODO: Send notification email to vendor via Resend/Postmark

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry error:', err)
    return NextResponse.json({ error: 'Fehler beim Senden' }, { status: 500 })
  }
}
