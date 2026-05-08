'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSearchBar from '@/components/ui/HeroSearchBar'
import { getBrowserClient } from '@/lib/supabase'

const PAGE_CATEGORIES = [
  { name: 'Locations',   slug: 'locations' },
  { name: 'Fotografen',  slug: 'fotografen' },
  { name: 'Videografen', slug: 'videografen' },
  { name: 'Catering',    slug: 'catering' },
  { name: 'Musik',       slug: 'musik' },
  { name: 'Makeup',      slug: 'makeup' },
  { name: 'Floristik',   slug: 'floristik' },
]

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
            {PAGE_CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex-1 flex flex-col items-center gap-2.5 group"
              >
                <div className="category-icon-wrapper w-12 h-12 shrink-0 group-hover:bg-terrakotta/10 transition-colors" />
                <span className="text-[11px] text-anthrazit text-center leading-tight group-hover:text-terrakotta transition-colors font-cormorant">
                  {cat.name}
                </span>
              </Link>
            ))}
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
