'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CATEGORIES } from '@/lib/vendors'
import { CheckCircle } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Basis',
    price: 'Kostenlos',
    description: 'Für den Einstieg',
    features: ['Profil mit Kontaktdaten', '3 Fotos hochladen', 'In Suchergebnissen sichtbar', 'Anfragen empfangen'],
    cta: 'Kostenlos starten',
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '€49 / Monat',
    description: 'Für Profis',
    features: ['Alles aus Basis', 'Unbegrenzte Fotos', 'Priorität in Suchergebnissen', 'Bewertungen sammeln', 'Statistiken & Anfragen-Tracking', 'Badge "Verifiziert"'],
    cta: 'Premium wählen',
    highlight: true,
  },
  {
    id: 'featured',
    name: 'Featured',
    price: '€99 / Monat',
    description: 'Maximale Sichtbarkeit',
    features: ['Alles aus Premium', '"Empfohlen"-Badge', 'Startseite-Platzierung', 'Newsletter-Feature', 'Dedizierter Support'],
    cta: 'Featured werden',
    highlight: false,
  },
]

export default function AnbieterWerdenPage() {
  const [form, setForm] = useState({ name: '', email: '', category: '', city: '', plan: 'free' })
  const [status, setStatus] = useState<'idle' | 'success'>('idle')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In production: call Supabase to create vendor draft
    setStatus('success')
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h1 className="font-serif text-4xl font-normal text-anthrazit mb-3">
            Werde Teil von<br />
            <em className="text-terrakotta">Hochzeitsplaner.de</em>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Erreiche tausende Paare in deiner Region. Kostenlos starten, wachsen wenn du bereit bist.
          </p>
        </div>
      </div>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-4 py-12" id="premium">
        <h2 className="font-serif text-2xl font-normal text-center mb-8">Wähle dein Paket</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => (
            <div key={plan.id} className={`rounded-2xl border p-6 ${
              plan.highlight
                ? 'border-terrakotta border-2 relative'
                : 'border-gray-100 bg-white'
            }`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terrakotta text-white text-xs px-3 py-1 rounded-full font-medium">
                  Beliebteste Wahl
                </div>
              )}
              <div className="mb-4">
                <div className="font-medium text-anthrazit mb-0.5">{plan.name}</div>
                <div className="font-serif text-2xl text-anthrazit">{plan.price}</div>
                <div className="text-xs text-gray-400">{plan.description}</div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-terrakotta shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => set('plan', plan.id)}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  form.plan === plan.id
                    ? 'bg-terrakotta text-white'
                    : plan.highlight
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Sign-up form */}
      <section className="max-w-xl mx-auto px-4 pb-16">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="font-serif text-2xl font-normal mb-6">Jetzt eintragen</h2>

          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-serif text-xl font-normal mb-2">Danke für dein Interesse!</h3>
              <p className="text-sm text-gray-500">
                Wir melden uns innerhalb von 24 Stunden mit den nächsten Schritten.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name / Unternehmensname *</label>
                <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="z.B. Miel Studio" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">E-Mail *</label>
                <input className="input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="deine@email.de" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kategorie *</label>
                <select className="input" required value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {CATEGORIES.map(c => (
                    <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stadt *</label>
                <input className="input" required value={form.city} onChange={e => set('city', e.target.value)} placeholder="z.B. Mannheim" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Paket</label>
                <div className="flex gap-2">
                  {PLANS.map(p => (
                    <button type="button" key={p.id} onClick={() => set('plan', p.id)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        form.plan === p.id
                          ? 'bg-terrakotta text-white border-terrakotta'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center mt-2">
                Kostenlos registrieren
              </button>
              <p className="text-xs text-gray-400 text-center">Keine Kreditkarte nötig · Jederzeit kündbar</p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
