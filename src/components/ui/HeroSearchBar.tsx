'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar } from 'lucide-react'

const CATEGORIES = [
  { slug: 'locations',   name: 'Locations' },
  { slug: 'fotografen',  name: 'Fotografen' },
  { slug: 'videografen', name: 'Videografen' },
  { slug: 'catering',    name: 'Catering' },
  { slug: 'musik',       name: 'Musik' },
  { slug: 'makeup',      name: 'Makeup' },
  { slug: 'floristik',   name: 'Floristik' },
]

export default function HeroSearchBar() {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [date, setDate] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (category) params.set('kategorie', category)
    if (city) params.set('ort', city)
    if (date) params.set('datum', date)
    router.push(`/suche${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-stretch bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      {/* Was */}
      <div className="flex items-center flex-1 px-5 py-4 gap-3 min-w-0">
        <Search size={16} className="text-terrakotta shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">
            Was suchst du?
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-anthrazit cursor-pointer"
          >
            <option value="">Alle Kategorien</option>
            {CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-px bg-gray-100 my-3 shrink-0" />

      {/* Wo */}
      <div className="flex items-center flex-1 px-5 py-4 gap-3 min-w-0">
        <MapPin size={16} className="text-terrakotta shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">
            Wo?
          </div>
          <input
            type="text"
            placeholder="Stadt oder Region"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-anthrazit placeholder:text-gray-300"
          />
        </div>
      </div>

      <div className="w-px bg-gray-100 my-3 shrink-0" />

      {/* Wann */}
      <div className="flex items-center flex-1 px-5 py-4 gap-3 min-w-0">
        <Calendar size={16} className="text-terrakotta shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">
            Wann?
          </div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-anthrazit placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="p-2 shrink-0">
        <button
          type="submit"
          className="h-full bg-anthrazit text-white text-sm font-medium px-6 rounded-xl hover:bg-black transition-colors whitespace-nowrap"
        >
          Suchen
        </button>
      </div>
    </form>
  )
}
