'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Menu, X } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase'

const NAV_CATEGORIES = [
  { href: '/locations', label: 'Locations' },
  { href: '/fotografen', label: 'Fotografen' },
  { href: '/videografen', label: 'Videografen' },
  { href: '/catering', label: 'Catering' },
  { href: '/musik', label: 'Musik' },
  { href: '/makeup', label: 'Makeup' },
  { href: '/floristik', label: 'Floristik' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = getBrowserClient()
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session?.user)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-[3px] leading-none" onClick={() => setMenuOpen(false)}>
          {/* "confe" dark + "tti" terrakotta */}
          <span className="font-playfair italic text-[1.5rem] leading-none">
            <span className="text-anthrazit">confe</span><span className="text-terrakotta">tti</span>
          </span>
          {/* Gold heart */}
          <span className="text-gold text-[9px] leading-none">♥</span>
          {/* —— HOUSE —— */}
          <span className="flex items-center gap-1.5 leading-none">
            <span className="inline-block h-px w-3 bg-gold" />
            <span
              className="font-cormorant text-[9px] tracking-[0.3em] text-anthrazit uppercase leading-none"
              style={{ fontVariant: 'small-caps' }}
            >
              HOUSE
            </span>
            <span className="inline-block h-px w-3 bg-gold" />
          </span>
        </Link>

        {/* Desktop center nav */}
        <div className="hidden md:flex items-center gap-5 font-cormorant text-[15px]">
          <Link href="/suche" className="text-terrakotta font-medium hover:text-terrakotta/80 transition-colors whitespace-nowrap">
            Entdecken
          </Link>
          <span className="w-px h-4 bg-gray-200 shrink-0" />
          {NAV_CATEGORIES.map(cat => (
            <Link
              key={cat.href}
              href={cat.href}
              className="text-anthrazit hover:text-terrakotta transition-colors whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-5">
          {!loggedIn && (
            <Link
              href="/dienstleister/registrieren"
              className="text-sm text-anthrazit hover:text-terrakotta transition-colors font-cormorant text-[15px]"
            >
              Für Dienstleister
            </Link>
          )}
          <button className="text-gray-400 hover:text-terrakotta transition-colors">
            <Heart size={18} />
          </button>
          {loggedIn ? (
            <Link href="/dienstleister/dashboard" className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <Link href="/dienstleister/login" className="btn-outline">
              Anmelden
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-anthrazit"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4 text-sm font-cormorant text-[15px]">
          {NAV_CATEGORIES.map(cat => (
            <Link key={cat.href} href={cat.href} onClick={() => setMenuOpen(false)}>
              {cat.label}
            </Link>
          ))}
          <Link href="/suche" onClick={() => setMenuOpen(false)} className="text-terrakotta font-medium">Entdecken</Link>
          {!loggedIn && (
            <Link href="/dienstleister/registrieren" onClick={() => setMenuOpen(false)}>Für Dienstleister</Link>
          )}
          <div className="flex gap-3 pt-1">
            {loggedIn ? (
              <Link
                href="/dienstleister/dashboard"
                className="btn-primary flex-1 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/dienstleister/login"
                className="btn-outline flex-1 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Anmelden
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
