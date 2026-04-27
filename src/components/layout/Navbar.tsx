'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl italic">
          Hochzeits<span className="text-brand-500">planer</span>.de
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <Link href="/locations" className="hover:text-gray-900 transition-colors">Locations</Link>
          <Link href="/fotografen" className="hover:text-gray-900 transition-colors">Fotografen</Link>
          <Link href="/dienstleister" className="hover:text-gray-900 transition-colors">Dienstleister</Link>
          <Link href="/ratgeber" className="hover:text-gray-900 transition-colors">Ratgeber</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/anbieter-werden" className="btn-outline">Anbieter werden</Link>
          <Link href="/anbieter-werden" className="btn-primary">Kostenlos eintragen</Link>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm">
          <Link href="/locations" onClick={() => setOpen(false)}>Locations</Link>
          <Link href="/fotografen" onClick={() => setOpen(false)}>Fotografen</Link>
          <Link href="/dienstleister" onClick={() => setOpen(false)}>Dienstleister</Link>
          <Link href="/ratgeber" onClick={() => setOpen(false)}>Ratgeber</Link>
          <Link href="/anbieter-werden" className="btn-primary text-center" onClick={() => setOpen(false)}>
            Kostenlos eintragen
          </Link>
        </div>
      )}
    </nav>
  )
}
