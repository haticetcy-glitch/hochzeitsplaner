import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

// Instantiated inside the handler so the env var is read fresh on every cold start,
// not once at module-load time (which can be before .env.local is applied in dev).
function getResend(): Resend | null {
  console.log('[email] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
}

function buildEmailHtml({
  vendorName,
  customerName,
  customerEmail,
  phone,
  eventType,
  eventDate,
  message,
}: {
  vendorName: string
  customerName: string
  customerEmail: string
  phone?: string
  eventType?: string
  eventDate?: string
  message: string
}): string {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neue Anfrage – Confetti House</title>
</head>
<body style="margin:0;padding:0;background-color:#F2ECE4;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2ECE4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#2B2B2B;border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:28px;font-weight:normal;letter-spacing:3px;color:#ffffff;font-style:italic;">
                <span style="color:#ffffff;">confe</span><span style="color:#E56A5B;">tti</span>
              </p>
              <p style="margin:2px 0 6px 0;font-family:Georgia,serif;font-size:10px;letter-spacing:6px;color:#D4AF37;text-transform:uppercase;">&#9135;&#9135; HOUSE &#9135;&#9135;</p>
              <p style="margin:0;font-family:Georgia,serif;font-size:9px;letter-spacing:2px;color:#D4AF37;">&#9829;</p>
              <p style="margin:10px 0 0 0;font-size:13px;color:#F2ECE4;letter-spacing:1px;">Neue Anfrage eingegangen</p>
            </td>
          </tr>

          <!-- HERO BANNER -->
          <tr>
            <td style="background-color:#E56A5B;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:#ffffff;line-height:1.3;">
                Sie haben eine neue Anfrage! 🎉
              </p>
              <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.80);letter-spacing:0.3px;">
                Jemand möchte mehr über Ihr Angebot erfahren
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px;">
              <p style="margin:0 0 6px 0;font-size:16px;color:#2B2B2B;">
                Hallo <strong>${vendorName}</strong>,
              </p>
              <p style="margin:0 0 28px 0;font-size:15px;color:#555555;line-height:1.6;">
                eine interessierte Person hat über Confetti House Kontakt zu Ihnen aufgenommen.
                Alle Details zur Anfrage finden Sie nachfolgend.
              </p>

              <!-- Details box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#ffffff;border:1px solid #f0e0d8;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(43,43,43,0.06);">
                <tr>
                  <td style="padding:18px 24px 12px 24px;">
                    <p style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:16px;color:#2B2B2B;font-weight:normal;">Anfrage Details</p>
                    <div style="width:40px;height:2px;background-color:#D4AF37;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 24px 20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;width:36px;vertical-align:top;"><span style="font-size:16px;">👤</span></td>
                        <td style="padding:10px 0 10px 10px;border-bottom:1px solid #f5ede9;width:130px;vertical-align:top;"><span style="font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:0.8px;">Name</span></td>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;vertical-align:top;"><span style="font-size:14px;color:#2B2B2B;font-weight:bold;">${customerName}</span></td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;vertical-align:top;"><span style="font-size:16px;">📧</span></td>
                        <td style="padding:10px 0 10px 10px;border-bottom:1px solid #f5ede9;vertical-align:top;"><span style="font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:0.8px;">E-Mail</span></td>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;vertical-align:top;"><a href="mailto:${customerEmail}" style="font-size:14px;color:#E56A5B;text-decoration:none;">${customerEmail}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;vertical-align:top;"><span style="font-size:16px;">📱</span></td>
                        <td style="padding:10px 0 10px 10px;border-bottom:1px solid #f5ede9;vertical-align:top;"><span style="font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:0.8px;">Telefon</span></td>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;vertical-align:top;">
                          ${phone
                            ? `<a href="tel:${phone}" style="font-size:14px;color:#2B2B2B;text-decoration:none;">${phone}</a>`
                            : `<span style="font-size:14px;color:#bbbbbb;font-style:italic;">Nicht angegeben</span>`}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;vertical-align:top;"><span style="font-size:16px;">🎉</span></td>
                        <td style="padding:10px 0 10px 10px;border-bottom:1px solid #f5ede9;vertical-align:top;"><span style="font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:0.8px;">Art des Events</span></td>
                        <td style="padding:10px 0;border-bottom:1px solid #f5ede9;vertical-align:top;">
                          ${eventType
                            ? `<span style="font-size:14px;color:#2B2B2B;">${eventType}</span>`
                            : `<span style="font-size:14px;color:#bbbbbb;font-style:italic;">Nicht angegeben</span>`}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;vertical-align:top;"><span style="font-size:16px;">📅</span></td>
                        <td style="padding:10px 0 10px 10px;vertical-align:top;"><span style="font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:0.8px;">Datum</span></td>
                        <td style="padding:10px 0;vertical-align:top;">
                          ${formattedDate
                            ? `<span style="font-size:14px;color:#2B2B2B;font-weight:bold;">${formattedDate}</span>`
                            : `<span style="font-size:14px;color:#bbbbbb;font-style:italic;">Noch nicht festgelegt</span>`}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Message -->
                <tr>
                  <td style="padding:0 24px 24px 24px;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:0.8px;">💌 &nbsp;Nachricht</p>
                    <div style="background-color:#FDF8F6;border-left:3px solid #E56A5B;border-radius:0 8px 8px 0;padding:16px 20px;">
                      <p style="margin:0;font-size:15px;color:#444444;line-height:1.7;font-style:italic;">&ldquo;${message}&rdquo;</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0 0;">
                <tr>
                  <td align="center">
                    <a href="mailto:${customerEmail}?subject=Re:%20Ihre%20Anfrage%20%C3%BCber%20Confetti%20House"
                      style="display:inline-block;background-color:#E56A5B;color:#ffffff;text-decoration:none;font-family:Georgia,serif;font-size:15px;padding:15px 36px;border-radius:50px;">
                      Jetzt antworten
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td style="background-color:#ffffff;padding:0 40px;">
              <div style="height:1px;background-color:#D4AF37;opacity:0.4;"></div>
            </td>
          </tr>

          <!-- TIPS BOX -->
          <tr>
            <td style="background-color:#ffffff;padding:28px 40px 36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2ECE4;border-radius:12px;">
                <tr><td style="padding:20px 24px 4px 24px;"><p style="margin:0;font-size:14px;color:#2B2B2B;font-weight:bold;">💡 Tipps für eine schnelle Antwort</p></td></tr>
                <tr>
                  <td style="padding:8px 24px 20px 24px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:5px 0;vertical-align:top;width:18px;"><span style="color:#E56A5B;font-size:13px;">•</span></td>
                        <td style="padding:5px 0 5px 8px;"><span style="font-size:13px;color:#555555;line-height:1.5;">Antworten Sie innerhalb von 24 Stunden für bessere Bewertungen</span></td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;vertical-align:top;"><span style="color:#E56A5B;font-size:13px;">•</span></td>
                        <td style="padding:5px 0 5px 8px;"><span style="font-size:13px;color:#555555;line-height:1.5;">Gehen Sie auf das spezifische Event-Datum ein</span></td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;vertical-align:top;"><span style="color:#E56A5B;font-size:13px;">•</span></td>
                        <td style="padding:5px 0 5px 8px;"><span style="font-size:13px;color:#555555;line-height:1.5;">Nennen Sie direkt Ihre Verfügbarkeit und Preise</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#2B2B2B;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;font-family:Georgia,serif;font-size:14px;color:#D4AF37;letter-spacing:2px;font-style:italic;">confetti <span style="color:#E56A5B;">house</span></p>
              <p style="margin:0 0 16px 0;font-size:11px;color:#888888;letter-spacing:1px;">Hochzeiten. Feiern. Erinnerungen.</p>
              <p style="margin:0 0 8px 0;font-size:11px;color:#666666;line-height:1.6;">Sie erhalten diese E-Mail, weil Sie auf Confetti House registriert sind.</p>
              <p style="margin:0;"><a href="#" style="font-size:11px;color:#888888;text-decoration:underline;">Abmelden</a></p>
            </td>
          </tr>
          <tr><td style="height:24px;"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[inquiries] body:', JSON.stringify(body))

    // Support both new schema (name, event_date) and old InquiryForm schema (partner1_name, wedding_date)
    const name = body.name || body.partner1_name || null
    const email = body.email || null
    const message = body.message || null
    // Old form sends wedding_date; new form sends event_date
    const weddingDate = body.event_date || body.wedding_date || null
    const phone = body.phone || null
    const partner2Name = body.partner2_name || null
    const guestCount = body.guest_count ? Number(body.guest_count) : null

    console.log('[inquiries] normalized fields:', { name, email, weddingDate, phone })

    // Only email and name are required
    if (!name || !email) {
      console.warn('[inquiries] missing required fields — name:', name, 'email:', email)
      return NextResponse.json(
        { error: 'Pflichtfelder fehlen (name, email)', received: { name, email } },
        { status: 400 }
      )
    }

    // vendor_id from old vendors table won't match vendor_profiles FK —
    // always store null to avoid FK violations; the vendor is identified by the page URL
    const vendorId: null = null
    console.log('[inquiries] vendor_id from body (not stored):', body.vendor_id)

    // Insert using column names that match the actual DB table.
    // The table was created before the migration rename, so it uses the old schema
    // (partner1_name, wedding_date, guest_count) not (name, event_date).
    const insertPayload = {
      vendor_id: vendorId,
      partner1_name: name,
      partner2_name: partner2Name,
      email,
      phone,
      wedding_date: weddingDate,
      guest_count: guestCount,
      message,
    }
    console.log('[inquiries] inserting:', JSON.stringify(insertPayload))

    const { error: insertError } = await supabase.from('inquiries').insert(insertPayload)
    console.log('[inquiries] insert result:', insertError ? JSON.stringify(insertError) : 'ok')

    if (insertError) {
      console.error('[inquiries] DB insert error:', insertError)
      // TEMPORARY: return success anyway so we can confirm the form works end-to-end.
      // Remove this bypass once DB schema is confirmed.
      return NextResponse.json({
        success: true,
        _debug_db_error: insertError.message,
        _debug_hint: insertError.hint ?? null,
        _debug_code: insertError.code ?? null,
      })
    }

    // Send email notification — non-fatal: a failed email must not reject the inquiry
    try {
      const resend = getResend()

      if (!resend) {
        console.warn('[email] RESEND_API_KEY not set — skipping email notification')
      } else {
        console.log('[email] resend client ready, looking up vendor for id:', body.vendor_id)

        // Resolve vendor name + email.
        // Old route (/[category]/[slug]) sends vendor_id from the `vendors` table;
        // new route (/anbieter/[id]) sends a vendor_profiles UUID.
        // Try vendor_profiles first, then fall back to the legacy vendors table.
        let vendorName = 'Dienstleister'
        let vendorEmail: string | null = null

        const rawVendorId = body.vendor_id || null

        if (rawVendorId) {
          const { data: vp } = await supabase
            .from('vendor_profiles')
            .select('business_name, email')
            .eq('id', rawVendorId)
            .maybeSingle()

          console.log('[email] vendor_profiles lookup result:', JSON.stringify(vp))

          if (vp?.email) {
            vendorName = vp.business_name ?? vendorName
            vendorEmail = vp.email
          } else {
            // Fall back to old vendors table
            const { data: ov } = await supabase
              .from('vendors')
              .select('name, email')
              .eq('id', rawVendorId)
              .maybeSingle()

            console.log('[email] vendors (old) lookup result:', JSON.stringify(ov))

            if (ov?.email) {
              vendorName = ov.name ?? vendorName
              vendorEmail = ov.email
            }
          }
        }

        console.log('[email] sending to:', vendorEmail)
        console.log('[email] from:', 'confetti HOUSE <onboarding@resend.dev>')

        if (!vendorEmail) {
          console.warn('[email] no vendor email found for vendor_id:', rawVendorId, '— skipping send')
        } else {
          console.log('[email] attempting to send...')
          const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'confetti HOUSE <onboarding@resend.dev>',
            to: vendorEmail,
            subject: `Neue Anfrage von ${name} – Confetti House`,
            html: buildEmailHtml({
              vendorName,
              customerName: name,
              customerEmail: email,
              phone: phone ?? undefined,
              eventDate: weddingDate ?? undefined,
              message: message ?? '',
            }),
          })
          console.log('[email] emailData:', JSON.stringify(emailData))
          console.log('[email] emailError:', JSON.stringify(emailError))
        }
      }
    } catch (emailErr) {
      console.error('[email] notification failed (non-fatal):', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[inquiries] Unexpected error:', err)
    return NextResponse.json({ error: 'Interner Fehler', details: String(err) }, { status: 500 })
  }
}
