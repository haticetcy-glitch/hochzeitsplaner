'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSearchBar from '@/components/ui/HeroSearchBar'
import { getBrowserClient } from '@/lib/supabase'


type VendorProfile = {
  id: string
  business_name: string
  category: string
  city: string
  profile_image_url: string
  portfolio_urls: string[]
}

function VendorCard({ v }: { v: VendorProfile }) {
  const [saved, setSaved] = useState(false)
  const photo = v.profile_image_url || v.portfolio_urls?.[0] || null

  return (
    <Link href={`/anbieter/${v.id}`} className="vendor-card group overflow-hidden block">
      <div className="h-48 relative bg-blush overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={v.business_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-15">✦</span>
          </div>
        )}
        {v.category && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-white/90 text-anthrazit">
            {v.category}
          </span>
        )}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={e => { e.preventDefault(); setSaved(s => !s) }}
          aria-label="Merken"
        >
          <Heart size={14} className={saved ? 'fill-terrakotta text-terrakotta' : 'text-gray-400'} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-anthrazit text-sm leading-snug group-hover:text-terrakotta transition-colors mb-1">
          {v.business_name}
        </h3>
        {v.city && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
            <MapPin size={11} className="text-terrakotta" />
            <span>{v.city}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

function VendorSkeleton() {
  return (
    <div className="vendor-card overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const [vendors, setVendors] = useState<VendorProfile[]>([])
  const [loadingVendors, setLoadingVendors] = useState(true)

  useEffect(() => {
    const supabase = getBrowserClient()
    supabase
      .from('vendor_profiles')
      .select('id, business_name, category, city, profile_image_url, portfolio_urls')
      .not('business_name', 'is', null)
      .neq('business_name', '')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data, error }) => {
        if (error) console.error('[Homepage] vendor_profiles fetch error:', error)
        setVendors((data ?? []) as VendorProfile[])
        setLoadingVendors(false)
      })
  }, [])

  return (
    <>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative w-full"
        style={{
          minHeight: '85vh',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.30)' }} />

        <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-16 pb-40" style={{ minHeight: '85vh' }}>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 max-w-2xl">
            Find the perfect match<br />for your perfect day.
          </h1>
          <p className="text-white/75 text-lg max-w-xl leading-relaxed font-cormorant">
            Entdecke die besten Dienstleister für Events, Feiern und besondere Momente.
          </p>
        </div>

        <div className="absolute bottom-0 inset-x-0 translate-y-1/2 z-20 flex justify-center px-6">
          <div className="w-full max-w-4xl">
            <HeroSearchBar />
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 pb-20" style={{ paddingTop: '6rem' }}>

        {/* Beliebte Kategorien */}
        <section className="mb-14">
          <h2 className="section-title mb-7">Beliebte Kategorien</h2>
          <div className="flex gap-3">

            <Link href="/locations" className="flex-1 flex flex-col items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center group-hover:bg-terrakotta transition-colors duration-200">
                <svg className="w-5 h-5 text-anthrazit group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <span className="text-sm text-anthrazit font-cormorant group-hover:text-terrakotta transition-colors">Locations</span>
            </Link>

            <Link href="/fotografen" className="flex-1 flex flex-col items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center group-hover:bg-terrakotta transition-colors duration-200">
                <svg className="w-5 h-5 text-anthrazit group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <span className="text-sm text-anthrazit font-cormorant group-hover:text-terrakotta transition-colors">Fotografen</span>
            </Link>

            <Link href="/videografen" className="flex-1 flex flex-col items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center group-hover:bg-terrakotta transition-colors duration-200">
                <svg className="w-5 h-5 text-anthrazit group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <span className="text-sm text-anthrazit font-cormorant group-hover:text-terrakotta transition-colors">Videografen</span>
            </Link>

            <Link href="/catering" className="flex-1 flex flex-col items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center group-hover:bg-terrakotta transition-colors duration-200">
                <svg className="w-5 h-5 text-anthrazit group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
                </svg>
              </div>
              <span className="text-sm text-anthrazit font-cormorant group-hover:text-terrakotta transition-colors">Catering</span>
            </Link>

            <Link href="/musik" className="flex-1 flex flex-col items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center group-hover:bg-terrakotta transition-colors duration-200">
                <svg className="w-5 h-5 text-anthrazit group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <span className="text-sm text-anthrazit font-cormorant group-hover:text-terrakotta transition-colors">Musik</span>
            </Link>

            <Link href="/makeup" className="flex-1 flex flex-col items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center group-hover:bg-terrakotta transition-colors duration-200">
                <svg className="w-5 h-5 text-anthrazit group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>
              <span className="text-sm text-anthrazit font-cormorant group-hover:text-terrakotta transition-colors">Makeup</span>
            </Link>

            <Link href="/floristik" className="flex-1 flex flex-col items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center group-hover:bg-terrakotta transition-colors duration-200">
                <svg className="w-5 h-5 text-anthrazit group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 22V12"/>
                  <path d="M12 12C12 12 7 10 7 5a5 5 0 0110 0c0 5-5 7-5 7z"/>
                  <path d="M12 12C12 12 17 10 17 5"/>
                  <path d="M5 17c0-2.8 3.1-5 7-5s7 2.2 7 5"/>
                </svg>
              </div>
              <span className="text-sm text-anthrazit font-cormorant group-hover:text-terrakotta transition-colors">Floristik</span>
            </Link>

          </div>
        </section>

        {/* Ausgewählte Dienstleister */}
        <section>
          <h2 className="section-title mb-7">Ausgewählte Dienstleister</h2>

          {loadingVendors ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <VendorSkeleton key={i} />)}
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {vendors.map(v => <VendorCard key={v.id} v={v} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400 font-cormorant mb-4">Noch keine Dienstleister eingetragen.</p>
              <Link href="/dienstleister/registrieren" className="btn-primary">
                Als Erster eintragen
              </Link>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/suche" className="btn-outline">
              Weitere Dienstleister entdecken
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
