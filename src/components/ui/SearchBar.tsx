'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { CATEGORIES, GERMAN_CITIES } from '@/lib/vendors'

export default function SearchBar({ className = '', defaultCategory = '' }: { className?: string; defaultCategory?: string }) {
  const router = useRouter()
  const [category, setCategory] = useState(defaultCategory)
  const [city, setCity] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const base = category || 'anbieter'
    const params = new URLSearchParams()
    if (city) params.set('stadt', city)
    router.push(`/${base}${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <form onSubmit={handleSearch} className={`flex items-center gap-0 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm ${className}`}>
      <div className="flex items-center flex-1 px-3 gap-2">
        <Search size={15} className="text-gray-400 shrink-0" />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 py-1.5 cursor-pointer"
        >
          <option value="">Alle Kategorien</option>
          {CATEGORIES.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

      <div className="flex items-center flex-1 px-3 gap-2">
        <MapPin size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Stadt oder Region…"
          value={city}
          onChange={e => setCity(e.target.value)}
          list="cities"
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 py-1.5"
        />
        <datalist id="cities">
          {GERMAN_CITIES.map(c => <option key={c} value={c} />)}
        </datalist>
      </div>

      <button type="submit" className="btn-primary rounded-xl shrink-0">
        Suchen
      </button>
    </form>
  )
}
