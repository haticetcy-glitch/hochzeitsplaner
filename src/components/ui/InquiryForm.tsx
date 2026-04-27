'use client'
import { useState } from 'react'
import { submitInquiry } from '@/lib/vendors'

export default function InquiryForm({ vendorId, vendorName }: { vendorId: string; vendorName: string }) {
  const [form, setForm] = useState({
    partner1_name: '', partner2_name: '', email: '',
    phone: '', wedding_date: '', guest_count: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitInquiry({
        vendor_id: vendorId,
        partner1_name: form.partner1_name,
        partner2_name: form.partner2_name || undefined,
        email: form.email,
        phone: form.phone || undefined,
        wedding_date: form.wedding_date || undefined,
        guest_count: form.guest_count ? parseInt(form.guest_count) : undefined,
        message: form.message || undefined,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">💌</div>
        <h3 className="font-serif text-lg font-normal mb-1">Anfrage gesendet!</h3>
        <p className="text-sm text-gray-500">
          {vendorName} wird sich so schnell wie möglich bei euch melden.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
      <h3 className="font-serif text-xl font-normal">Anfrage senden</h3>
      <p className="text-sm text-gray-500 -mt-2">Kostenlos & unverbindlich</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Dein Name *</label>
          <input className="input" required value={form.partner1_name}
            onChange={e => set('partner1_name', e.target.value)} placeholder="Partner:in 1" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Partner:in 2</label>
          <input className="input" value={form.partner2_name}
            onChange={e => set('partner2_name', e.target.value)} placeholder="Optional" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">E-Mail *</label>
        <input className="input" type="email" required value={form.email}
          onChange={e => set('email', e.target.value)} placeholder="eure@email.de" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hochzeitsdatum</label>
          <input className="input" type="date" value={form.wedding_date}
            onChange={e => set('wedding_date', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Gästeanzahl</label>
          <input className="input" type="number" value={form.guest_count}
            onChange={e => set('guest_count', e.target.value)} placeholder="z.B. 80" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Nachricht</label>
        <textarea className="input resize-none" rows={4} value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder="Erzählt uns von eurer Hochzeit – Stil, Wünsche, Fragen…" />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-500">Es gab einen Fehler. Bitte versucht es erneut.</p>
      )}

      <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'loading'}>
        {status === 'loading' ? 'Wird gesendet…' : 'Kostenlos anfragen'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Keine Provision · Direkt an {vendorName}
      </p>
    </form>
  )
}
