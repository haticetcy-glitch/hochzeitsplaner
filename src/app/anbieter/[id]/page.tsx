'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getBrowserClient } from '@/lib/supabase'
import {
  MapPin, Globe, Phone, Mail, Star, Heart, X,
  ChevronLeft, ChevronRight, Send, ArrowLeft, ExternalLink,
} from 'lucide-react'

type VendorProfile = {
  id: string
  business_name: string
  category: string
  city: string
  bio: string
  profile_image_url: string
  portfolio_urls: string[]
  phone: string
  email: string
  website: string
}

const EVENT_TYPES = ['Hochzeit', 'Geburtstag', 'Firmenevent', 'Jubiläum', 'Sonstiges']

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />
}

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = getBrowserClient()

  const [vendor, setVendor] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saved, setSaved] = useState(false)

  // Lightbox
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })

  // Inquiry form
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', event_type: '', event_date: '', message: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    if (!id) return
    async function load() {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', id)
        .not('business_name', 'is', null)
        .neq('business_name', '')
        .single()
      if (!data || error) {
        setNotFound(true)
      } else {
        setVendor(data as VendorProfile)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleInquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!vendor) return
    setSubmitStatus('sending')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: vendor.id,
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          event_type: form.event_type || undefined,
          event_date: form.event_date || undefined,
          message: form.message,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('[Anfrage] API error:', res.status, data)
        throw new Error(data.error || 'Fehler')
      }
      setSubmitStatus('sent')
    } catch (err) {
      console.error('[Anfrage] Submit error:', err)
      setSubmitStatus('error')
    }
  }

  function moveLightbox(dir: 1 | -1) {
    if (!vendor?.portfolio_urls) return
    setLightbox(prev => ({
      open: true,
      index: (prev.index + dir + vendor.portfolio_urls.length) % vendor.portfolio_urls.length,
    }))
  }

  // ── Loading skeleton ──────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-72 md:h-96 bg-gray-100 animate-pulse" />
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-40" />
            <SkeletonBlock className="h-56" />
          </div>
          <SkeletonBlock className="h-80" />
        </div>
        <Footer />
      </>
    )
  }

  // ── 404 ───────────────────────────────────────────────────────────────
  if (notFound || !vendor) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="font-playfair text-3xl text-anthrazit mb-3">Dienstleister nicht gefunden</h1>
          <p className="text-gray-500 font-cormorant mb-8 max-w-md">
            Das Profil existiert nicht oder wurde entfernt. Entdecke andere Anbieter auf unserer Plattform.
          </p>
          <Link href="/suche" className="btn-primary">Alle Dienstleister entdecken</Link>
        </div>
        <Footer />
      </>
    )
  }

  const photos = vendor.portfolio_urls?.filter(Boolean) ?? []
  const coverPhoto = photos[0] ?? null
  const categoryHref = `/suche?kategorie=${vendor.category?.toLowerCase()}`

  return (
    <>
      <Navbar />

      {/* ── Cover banner ─────────────────────────────────────────────── */}
      <div className="relative h-72 md:h-96 bg-blush overflow-hidden">
        {coverPhoto ? (
          <img src={coverPhoto} alt={vendor.business_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl opacity-10">✦</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Link href="/suche" className="absolute top-4 left-4 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors">
          <ArrowLeft size={15} /> Suche
        </Link>
      </div>

      {/* ── Profile header ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-14 mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden bg-blush shrink-0 shadow-md">
            {vendor.profile_image_url ? (
              <img src={vendor.profile_image_url} alt={vendor.business_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blush flex items-center justify-center text-3xl text-terrakotta/40">
                {vendor.business_name?.charAt(0) ?? '?'}
              </div>
            )}
          </div>

          {/* Name + badges */}
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-playfair text-2xl md:text-3xl text-anthrazit leading-tight">
                  {vendor.business_name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Link href={categoryHref} className="bg-blush text-terrakotta text-xs font-medium px-3 py-1 rounded-full hover:bg-terrakotta hover:text-white transition-colors">
                    {vendor.category}
                  </Link>
                  {vendor.city && (
                    <span className="flex items-center gap-1 text-sm text-gray-500 font-cormorant">
                      <MapPin size={13} className="text-terrakotta" />
                      {vendor.city}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="text-gold fill-gold" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1 font-cormorant">Neu</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSaved(s => !s)}
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-colors ${saved ? 'border-terrakotta bg-terrakotta text-white' : 'border-gray-200 text-gray-500 hover:border-terrakotta hover:text-terrakotta'}`}
              >
                <Heart size={14} className={saved ? 'fill-white' : ''} />
                {saved ? 'Gespeichert' : 'Merken'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

          {/* ── LEFT (65%) ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Über uns */}
            {vendor.bio && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-playfair text-xl text-anthrazit mb-4">Über uns</h2>
                <p className="text-gray-600 leading-relaxed font-cormorant text-[1.05rem] whitespace-pre-line">
                  {vendor.bio}
                </p>
              </section>
            )}

            {/* Portfolio gallery */}
            {photos.length > 0 && (
              <section className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-playfair text-xl text-anthrazit mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox({ open: true, index: i })}
                      className="aspect-square rounded-xl overflow-hidden bg-sand hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-terrakotta"
                    >
                      <img src={url} alt={`${vendor.business_name} Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-playfair text-xl text-anthrazit mb-4">Bewertungen</h2>
              <div className="text-center py-10">
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={22} className="text-gray-200" />
                  ))}
                </div>
                <p className="text-gray-400 font-cormorant">Noch keine Bewertungen vorhanden.</p>
                <p className="text-xs text-gray-300 mt-1">Sei der Erste, der eine Anfrage stellt!</p>
              </div>
            </section>
          </div>

          {/* ── RIGHT sticky (35%) ─────────────────────────────────────── */}
          <div className="lg:sticky lg:top-20 self-start space-y-4">

            {/* Contact card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 20px rgba(43,43,43,0.08)' }}>
              <h3 className="font-playfair text-lg text-anthrazit mb-1">Kontakt aufnehmen</h3>
              <p className="text-xs text-gray-400 font-cormorant mb-5">Kostenlos & unverbindlich anfragen</p>

              {/* Contact details */}
              <div className="space-y-3 mb-5">
                {vendor.website && (
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-terrakotta transition-colors font-cormorant">
                    <Globe size={15} className="text-terrakotta shrink-0" />
                    <span className="truncate">{vendor.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink size={11} className="shrink-0 ml-auto" />
                  </a>
                )}
                {vendor.phone && (
                  <a href={`tel:${vendor.phone}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-terrakotta transition-colors font-cormorant">
                    <Phone size={15} className="text-terrakotta shrink-0" />
                    {vendor.phone}
                  </a>
                )}
                {vendor.email && (
                  <a href={`mailto:${vendor.email}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-terrakotta transition-colors font-cormorant">
                    <Mail size={15} className="text-terrakotta shrink-0" />
                    <span className="truncate">{vendor.email}</span>
                  </a>
                )}
              </div>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary w-full justify-center flex items-center gap-2"
                >
                  <Send size={14} /> Anfrage senden
                </button>
              ) : submitStatus === 'sent' ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">💌</div>
                  <p className="font-playfair text-sm text-green-800">Ihre Anfrage wurde erfolgreich gesendet!</p>
                  <p className="text-xs text-green-600 mt-1 font-cormorant">
                    {vendor.business_name} meldet sich in Kürze bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Dein Name *</label>
                    <input className="input" required placeholder="Erika Mustermann"
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Deine E-Mail *</label>
                    <input className="input" type="email" required placeholder="deine@email.de"
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Telefonnummer</label>
                    <input className="input" type="tel" placeholder="+49 171 1234567"
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Art des Events</label>
                      <select className="input" value={form.event_type}
                        onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}>
                        <option value="">Bitte wählen</option>
                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Datum</label>
                      <input className="input" type="date" value={form.event_date}
                        onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nachricht *</label>
                    <textarea className="input resize-none font-cormorant" rows={4} required
                      placeholder="Erzähl uns von deinem Event…"
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  {submitStatus === 'error' && (
                    <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                      Fehler beim Senden. Bitte versuche es erneut.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3">
                      Abbrechen
                    </button>
                    <button type="submit" disabled={submitStatus === 'sending'}
                      className="btn-primary flex-1 justify-center flex items-center gap-2 disabled:opacity-50">
                      {submitStatus === 'sending' ? (
                        <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Wird gesendet…</>
                      ) : (
                        <><Send size={13} /> Anfrage senden</>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center font-cormorant">
                    Keine Provision · Direkte Kommunikation
                  </p>
                </form>
              )}
            </div>

            {/* Response time badge */}
            <div className="bg-blush rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-terrakotta/20 flex items-center justify-center shrink-0">
                <Send size={14} className="text-terrakotta" />
              </div>
              <div>
                <p className="text-xs font-medium text-anthrazit">Schnelle Antwortzeit</p>
                <p className="text-xs text-gray-500 font-cormorant">Antwortet meist innerhalb von 24h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      {lightbox.open && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(prev => ({ ...prev, open: false }))}
        >
          <button
            onClick={e => { e.stopPropagation(); moveLightbox(-1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <img
            src={photos[lightbox.index]}
            alt={`Portfolio ${lightbox.index + 1}`}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={e => e.stopPropagation()}
          />

          <button
            onClick={e => { e.stopPropagation(); moveLightbox(1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <button
            onClick={() => setLightbox(prev => ({ ...prev, open: false }))}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setLightbox({ open: true, index: i }) }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === lightbox.index ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
