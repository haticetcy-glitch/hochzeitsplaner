import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    const { data: vendor } = await supabase
      .from('vendors')
      .select('name, email')
      .eq('id', body.vendor_id)
      .single()

    if (vendor?.email) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: vendor.email,
        subject: `💌 Neue Anfrage von ${body.partner1_name} – Hochzeitsplaner.de`,
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #f0e6e0;">
            
            <div style="background: #B45A30; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 1px;">
                Hochzeitsplaner.de
              </h1>
              <p style="color: #FAE8E1; margin: 8px 0 0; font-size: 14px;">Neue Anfrage eingegangen</p>
            </div>

            <div style="padding: 32px;">
              <p style="color: #555; font-size: 16px; margin-top: 0;">
                Hallo <strong>${vendor.name}</strong>,
              </p>
              <p style="color: #555; font-size: 16px;">
                du hast eine neue Anfrage über Hochzeitsplaner.de erhalten. Hier sind alle Details:
              </p>

              <div style="background: #FAE8E1; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h2 style="color: #B45A30; margin: 0 0 16px; font-size: 18px; font-weight: normal;">
                  💑 Das Brautpaar
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px; width: 140px;">Partner:in 1</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: bold;">${body.partner1_name}</td>
                  </tr>
                  ${body.partner2_name ? `
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">Partner:in 2</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: bold;">${body.partner2_name}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">E-Mail</td>
                    <td style="padding: 8px 0; font-size: 14px;">
                      <a href="mailto:${body.email}" style="color: #B45A30;">${body.email}</a>
                    </td>
                  </tr>
                  ${body.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">Telefon</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px;">
                      <a href="tel:${body.phone}" style="color: #B45A30;">${body.phone}</a>
                    </td>
                  </tr>` : ''}
                </table>
              </div>

              <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h2 style="color: #333; margin: 0 0 16px; font-size: 18px; font-weight: normal;">
                  💍 Hochzeitsdetails
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  ${body.wedding_date ? `
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px; width: 140px;">Hochzeitsdatum</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: bold;">${new Date(body.wedding_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  </tr>` : ''}
                  ${body.guest_count ? `
                  <tr>
                    <td style="padding: 8px 0; color: #888; font-size: 14px;">Gästeanzahl</td>
                    <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: bold;">${body.guest_count} Personen</td>
                  </tr>` : ''}
                </table>
              </div>

              ${body.message ? `
              <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h2 style="color: #333; margin: 0 0 12px; font-size: 18px; font-weight: normal;">
                  💬 Nachricht
                </h2>
                <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0; font-style: italic;">
                  "${body.message}"
                </p>
              </div>` : ''}

              <div style="text-align: center; margin: 32px 0 16px;">
                <a href="mailto:${body.email}" 
                   style="background: #B45A30; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; display: inline-block;">
                  Jetzt antworten
                </a>
              </div>

              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 24px; border-top: 1px solid #f0e6e0; padding-top: 16px;">
                Diese Anfrage wurde über Hochzeitsplaner.de gesendet · Keine Provision
              </p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Fehler' }, { status: 500 })
  }
}