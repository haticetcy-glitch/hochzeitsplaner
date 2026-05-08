'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getBrowserClient } from '@/lib/supabase'
import { MapPin, Search, SlidersHorizontal, X, Heart, ChevronDown } from 'lucide-react'

const ALL_CATEGORIES = ['Locations', 'Fotografen', 'Videografen', 'Catering', 'Musik', 'Makeup', 'Floristik']

const SLUG_TO_NAME: Record<string, string> = {
  locations: 'Locations',
  fotografen: 'Fotografen',
  videografen: 'Videografen',
  catering: 'Catering',
  musik: 'Musik',
  makeup: 'Makeup',
  floristik: 'Floristik',
}

const PAGE_SIZE = 12

type VendorProfile = {
  id: string
  business_name: string
  category: string
  city: string
  bio: string
  profile_image_url: string
  portfolio_urls: string[]
}

// ── Module-level component — must NOT be defined inside SucheContent.
// Defining it inside the parent causes React to see a new component type on
// every render, unmounting the input and causing instant focus loss on keypress.
interface FilterContentProps {
  selectedCats: string[]
  onToggleCategory: (cat: string) => void
  stadtInput: string
  onStadtChange: (v: string) => void
  datum: string
  onDatumChange: (v: string) => void
  onApply: () => void
  onReset: () => void
}

function FilterContent({
  selectedCats, onToggleCategory,
  stadtInput, onStadtChange,
  datum, onDatumChange,
  onApply, onReset,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Kategorie */}
      <div>
        <h3 className="text-xs font-semibold text-anthrazit uppercase tracking-wider mb-3">Kategorie</h3>
        <div className="space-y-2.5">
          {ALL_CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCats.includes(cat)}
                onChange={() => onToggleCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 accent-terrakotta"
              />
              <span className="text-sm text-gray-600 group-hover:text-anthrazit transition-colors font-cormorant">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stadt */}
      <div>
        <h3 className="text-xs font-semibold text-anthrazit uppercase tracking-wider mb-3">Stadt / Region</h3>
        <input
          className="input text-sm"
          placeholder="z.B. Berlin"
          value={stadtInput}
          onChange={e => onStadtChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onApply()}
        />
      </div>

      {/* Datum */}
      <div>
        <h3 className="text-xs font-semibold text-anthrazit uppercase tracking-wider mb-3">Datum des Events</h3>
        <input
          className="input text-sm"
          type="date"
          value={datum}
          onChange={e => onDatumChange(e.target.value)}
        />
      </div>

      {/* Coming soon placeholders */}
      <div>
        <h3 className="text-xs font-semibold text-anthrazit uppercase tracking-wider mb-2">Preisrahmen</h3>
        <p className="text-xs text-gray-400 font-cormorant">Bald verfügbar</p>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-anthrazit uppercase tracking-wider mb-2">Mindestbewertung</h3>
        <p className="text-xs text-gray-400 font-cormorant">Bald verfügbar</p>
      </div>

      <div className="space-y-2 pt-2">
        <button onClick={onApply} className="btn-primary w-full justify-center">
          Filter anwenden
        </button>
        <button
          onClick={onReset}
          className="w-full text-xs text-gray-400 hover:text-terrakotta transition-colors py-2 font-cormorant"
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  )
}

// ── Vendor result card ────────────────────────────────────────────────────────
function VendorResultCard({ vendor }: { vendor: VendorProfile }) {
  const [saved, setSaved] = useState(false)
  const photo = vendor.profile_image_url || vendor.portfolio_urls?.[0] || null

  return (
    <Link href={`/anbieter/${vendor.id}`} className="vendor-card group block overflow-hidden">
      <div className="h-44 bg-blush relative overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={vendor.business_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20">✦</span>
          </div>
        )}
        <button
          onClick={e => { e.preventDefault(); setSaved(s => !s) }}
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Merken"
        >
          <Heart size={13} className={saved ? 'fill-terrakotta text-terrakotta' : 'text-gray-400'} />
        </button>
        {vendor.category && (
          <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-[10px] font-medium text-anthrazit px-2 py-0.5 rounded-full">
            {vendor.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-anthrazit text-sm leading-snug group-hover:text-terrakotta transition-colors mb-1">
          {vendor.business_name}
        </h3>
        {vendor.bio && (
          <p className="text-xs text-gray-400 font-cormorant line-clamp-2 mb-2 leading-relaxed">
            {vendor.bio}
          </p>
        )}
        {vendor.city && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} className="text-terrakotta" />
            {vendor.city}
          </div>
        )}
      </div>
    </Link>
  )
}

// ── Main content (wrapped in Suspense for useSearchParams) ────────────────────
function SucheContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = getBrowserClient()

  // Filter state — Stadt has two vars: input (what user types) and applied (what's queried)
  const [selectedCats, setSelectedCats] = useState<string[]>(() => {
    const k = searchParams.get('kategorie')
    return k ? [SLUG_TO_NAME[k] ?? k] : []
  })
  const [stadtInput, setStadtInput] = useState(searchParams.get('ort') ?? '')
  const [appliedStadt, setAppliedStadt] = useState(searchParams.get('ort') ?? '')
  const [datum, setDatum] = useState(searchParams.get('datum') ?? '')
  const [sortBy, setSortBy] = useState('neueste')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Top search bar state (separate from filter sidebar)
  const [searchKat, setSearchKat] = useState(searchParams.get('kategorie') ?? '')
  const [searchOrt, setSearchOrt] = useState(searchParams.get('ort') ?? '')

  // Results
  const [vendors, setVendors] = useState<VendorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Fetch whenever active filters change
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)

      let query = supabase
        .from('vendor_profiles')
        .select('id, business_name, category, city, bio, profile_image_url, portfolio_urls')
        .not('business_name', 'is', null)
        .neq('business_name', '')
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1)

      if (selectedCats.length > 0) query = query.in('category', selectedCats)
      if (appliedStadt.trim()) query = query.ilike('city', `%${appliedStadt.trim()}%`)

      const { data, error } = await query

      if (!cancelled) {
        if (error) console.error('[Suche] Query error:', error)
        const results = (data ?? []) as VendorProfile[]
        setVendors(results)
        setPage(0)
        setHasMore(results.length === PAGE_SIZE)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [selectedCats, appliedStadt])

  async function loadMore() {
    const nextPage = page + 1
    setLoading(true)

    let query = supabase
      .from('vendor_profiles')
      .select('id, business_name, category, city, bio, profile_image_url, portfolio_urls')
      .not('business_name', 'is', null)
      .neq('business_name', '')
      .order('created_at', { ascending: false })
      .range(nextPage * PAGE_SIZE, (nextPage + 1) * PAGE_SIZE - 1)

    if (selectedCats.length > 0) query = query.in('category', selectedCats)
    if (appliedStadt.trim()) query = query.ilike('city', `%${appliedStadt.trim()}%`)

    const { data } = await query
    const results = (data ?? []) as VendorProfile[]
    setVendors(prev => [...prev, ...results])
    setPage(nextPage)
    setHasMore(results.length === PAGE_SIZE)
    setLoading(false)
  }

  function toggleCategory(cat: string) {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  function applyFilters() {
    setAppliedStadt(stadtInput)
    setShowMobileFilters(false)
  }

  function resetFilters() {
    setSelectedCats([])
    setStadtInput('')
    setAppliedStadt('')
    setDatum('')
  }

  function handleTopSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchKat) params.set('kategorie', searchKat)
    if (searchOrt) params.set('ort', searchOrt)
    router.push(`/suche${params.toString() ? `?${params}` : ''}`)
    const name = SLUG_TO_NAME[searchKat] ?? searchKat
    setSelectedCats(searchKat ? [name] : [])
    setStadtInput(searchOrt)
    setAppliedStadt(searchOrt)
  }

  const activeFiltersCount = selectedCats.length + (appliedStadt ? 1 : 0)

  const filterProps: FilterContentProps = {
    selectedCats,
    onToggleCategory: toggleCategory,
    stadtInput,
    onStadtChange: setStadtInput,
    datum,
    onDatumChange: setDatum,
    onApply: applyFilters,
    onReset: resetFilters,
  }

  return (
    <>
      <Navbar />

      {/* Sticky search bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <form onSubmit={handleTopSearch} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-sand rounded-xl px-4 py-2.5">
              <Search size={15} className="text-terrakotta shrink-0" />
              <select
                value={searchKat}
                onChange={e => setSearchKat(e.target.value)}
                className="text-sm bg-transparent outline-none text-anthrazit cursor-pointer w-full"
              >
                <option value="">Alle Kategorien</option>
                {ALL_CATEGORIES.map(c => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-sand rounded-xl px-4 py-2.5">
              <MapPin size={15} className="text-terrakotta shrink-0" />
              <input
                type="text"
                placeholder="Stadt oder Region"
                value={searchOrt}
                onChange={e => setSearchOrt(e.target.value)}
                className="w-full text-sm bg-transparent outline-none text-anthrazit placeholder:text-gray-400"
              />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <Search size={14} /> Suchen
            </button>
            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(v => !v)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-anthrazit hover:border-terrakotta transition-colors"
            >
              <SlidersHorizontal size={14} />
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-terrakotta text-white text-[10px] rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* Desktop filter sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-36">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-playfair text-base text-anthrazit">Filter</h2>
                {activeFiltersCount > 0 && (
                  <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-terrakotta hover:underline">
                    <X size={11} /> Zurücksetzen
                  </button>
                )}
              </div>
              <FilterContent {...filterProps} />
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-playfair text-lg text-anthrazit">Filter</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
                <FilterContent {...filterProps} />
              </div>
            </div>
          )}

          {/* Results area */}
          <div className="flex-1 min-w-0">

            {/* Result count + sort */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-gray-500 font-cormorant">
                {loading && vendors.length === 0
                  ? 'Suche läuft…'
                  : `${vendors.length} Dienstleister gefunden`}
                {selectedCats.length > 0 && (
                  <span className="ml-1 text-terrakotta">· {selectedCats.join(', ')}</span>
                )}
                {appliedStadt && (
                  <span className="ml-1 text-terrakotta">in {appliedStadt}</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-cormorant">Sortieren:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 pr-7 appearance-none bg-white text-anthrazit focus:outline-none focus:border-terrakotta cursor-pointer"
                  >
                    <option value="neueste">Neueste</option>
                    <option value="empfohlen">Empfohlen</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {(selectedCats.length > 0 || appliedStadt) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCats.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-1.5 text-xs bg-blush text-terrakotta px-3 py-1 rounded-full hover:bg-terrakotta hover:text-white transition-colors"
                  >
                    {cat} <X size={10} />
                  </button>
                ))}
                {appliedStadt && (
                  <button
                    onClick={() => { setStadtInput(''); setAppliedStadt('') }}
                    className="flex items-center gap-1.5 text-xs bg-blush text-terrakotta px-3 py-1 rounded-full hover:bg-terrakotta hover:text-white transition-colors"
                  >
                    {appliedStadt} <X size={10} />
                  </button>
                )}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && vendors.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results grid */}
            {!loading || vendors.length > 0 ? (
              <>
                {vendors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {vendors.map(v => <VendorResultCard key={v.id} vendor={v} />)}
                  </div>
                ) : !loading ? (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="font-playfair text-xl text-anthrazit mb-2">Keine Dienstleister gefunden</h2>
                    <p className="text-gray-500 font-cormorant mb-6">
                      Passe die Filter an oder suche in einer anderen Stadt.
                    </p>
                    <button onClick={resetFilters} className="btn-outline">
                      Filter zurücksetzen
                    </button>
                  </div>
                ) : null}

                {/* Pagination */}
                {hasMore && vendors.length > 0 && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="btn-outline disabled:opacity-50"
                    >
                      {loading ? 'Wird geladen…' : 'Mehr laden'}
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default function SuchePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terrakotta border-t-transparent animate-spin" />
      </div>
    }>
      <SucheContent />
    </Suspense>
  )
}
