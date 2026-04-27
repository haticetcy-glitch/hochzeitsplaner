import { Suspense } from 'react'
import { getFeaturedVendors } from '@/lib/vendors'
import { CATEGORIES } from '@/lib/vendors'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SearchBar from '@/components/ui/SearchBar'
import VendorCard from '@/components/cards/VendorCard'
import Link from 'next/link'

const POPULAR_CITIES = [
  'Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt',
  'Stuttgart', 'Düsseldorf', 'Mannheim', 'Heidelberg', 'Dresden',
]

async function FeaturedVendors() {
  try {
    const vendors = await getFeaturedVendors(6)
    if (!vendors.length) {
      // Fallback for demo without DB
      return (
        <div className="text-center py-8 text-gray-400 text-sm">
          Noch keine Einträge – sei der Erste!
        </div>
      )
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map(v => <VendorCard key={v.id} vendor={v} />)}
      </div>
    )
  } catch {
    return null
  }
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-500 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            💍 Kein Aufpreis für Paare · Direkte Anfragen
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight text-gray-900 mb-4">
            Euer Traumtag verdient<br />
            <em className="text-brand-500">die besten Dienstleister.</em>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Locations, Fotografen & Dienstleister in ganz Deutschland – kostenlos anfragen, keine Provision.
          </p>
          <SearchBar className="max-w-xl mx-auto" />

          {/* Popular cities */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-gray-400 flex items-center">Beliebt:</span>
            {POPULAR_CITIES.slice(0, 6).map(city => (
              <Link key={city} href={`/anbieter?stadt=${city}`}
                className="text-xs text-gray-500 hover:text-brand-500 transition-colors">
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="section-title">Was sucht ihr?</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/${cat.slug}`}
              className="card p-4 text-center hover:border-brand-200 transition-colors group">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium text-gray-900 group-hover:text-brand-500 transition-colors">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured vendors */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="section-title">Empfohlene Anbieter</h2>
          <Link href="/anbieter" className="text-sm text-brand-500 hover:text-brand-600">
            Alle anzeigen →
          </Link>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-gray-50" />
            ))}
          </div>
        }>
          <FeaturedVendors />
        </Suspense>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            { num: '1.200+', label: 'Dienstleister' },
            { num: '0 €', label: 'Provision für Paare' },
            { num: '24h', label: 'Ø Antwortzeit' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="font-serif text-3xl text-brand-500 mb-1">{stat.num}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-brand-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-normal text-gray-900 mb-2">
              Du bist Anbieter in der Hochzeitsbranche?
            </h2>
            <p className="text-gray-600 text-sm max-w-md">
              Erstelle dein kostenloses Profil und erreiche tausende Paare in deiner Region – ohne Provision.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/anbieter-werden" className="btn-outline">Mehr erfahren</Link>
            <Link href="/anbieter-werden" className="btn-primary">Kostenlos starten</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
