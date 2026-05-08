import { Metadata } from 'next'
import { getVendors, CATEGORIES } from '@/lib/vendors'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VendorCard from '@/components/cards/VendorCard'
import SearchBar from '@/components/ui/SearchBar'
import Link from 'next/link'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ stadt?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.slug === category)
  if (!cat) return { title: 'Nicht gefunden' }
  return {
    title: `${cat.name} für Hochzeiten in Deutschland`,
    description: `Die besten ${cat.name} für eure Traumhochzeit.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { stadt } = await searchParams
  const cat = CATEGORIES.find(c => c.slug === category)

  if (!cat) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-normal mb-4">Seite nicht gefunden</h1>
          <Link href="/" className="btn-primary">Zur Startseite</Link>
        </div>
        <Footer />
      </>
    )
  }

  const vendors = await getVendors({
    category,
    city: stadt,
  }).catch(() => [])

  return (
    <>
      <Navbar />
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600">Start</Link>
            <span>/</span>
            <span className="text-gray-700">{cat.name}</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-anthrazit mb-1">
            {cat.icon} {cat.name}
            {stadt && ` in ${stadt}`}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {vendors.length > 0 ? `${vendors.length} Anbieter gefunden` : 'Alle Anbieter'}
          </p>
          <SearchBar />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vendors.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h2 className="font-serif text-xl font-normal mb-2">
              Noch keine {cat.name} eingetragen
            </h2>
            <p className="text-gray-500 text-sm mb-6">Seid die Ersten!</p>
            <Link href="/anbieter-werden" className="btn-primary">Kostenlos eintragen</Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}