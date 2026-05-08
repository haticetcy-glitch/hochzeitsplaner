import Link from 'next/link'
import { Instagram } from 'lucide-react'

function BaldBadge() {
  return (
    <span className="ml-2 text-xs bg-blush text-terrakotta px-2 py-0.5 rounded-full">
      Bald verfügbar
    </span>
  )
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">

        {/* Logo + tagline + social */}
        <div>
          <Link href="/" className="flex flex-col items-center gap-[3px] leading-none mb-5 self-start">
            <span className="font-playfair italic text-[1.35rem] leading-none">
              <span className="text-anthrazit">confe</span><span className="text-terrakotta">tti</span>
            </span>
            <span className="text-gold text-[9px] leading-none">♥</span>
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
          <p className="text-gray-500 text-xs leading-relaxed mb-5">
            Die Plattform für unvergessliche Events und besondere Momente in ganz Deutschland.
          </p>
          <div className="flex gap-3">
            <a
              href="https://instagram.com/confettihouse.de"
              aria-label="Instagram"
              className="text-gray-400 hover:text-terrakotta transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Für Paare */}
        <div>
          <div className="font-medium text-anthrazit mb-3 font-cormorant text-[15px]">Für Paare</div>
          <ul className="space-y-2.5 text-gray-500">
            <li>
              <Link href="/suche" className="hover:text-anthrazit transition-colors">
                Dienstleister entdecken
              </Link>
            </li>
            <li>
              <span
                className="text-gray-400 cursor-not-allowed"
                title="Wir arbeiten daran – diese Funktion wird bald verfügbar sein ✨"
              >
                Inspiration
                <BaldBadge />
              </span>
            </li>
          </ul>
        </div>

        {/* Für Dienstleister */}
        <div>
          <div className="font-medium text-anthrazit mb-3 font-cormorant text-[15px]">Für Dienstleister</div>
          <ul className="space-y-2.5 text-gray-500">
            <li>
              <Link href="/dienstleister/registrieren" className="hover:text-anthrazit transition-colors">
                Kostenlos eintragen
              </Link>
            </li>
            <li className="text-gray-400">
              Premium werden
              <BaldBadge />
            </li>
            <li className="text-gray-400">
              FAQ
              <BaldBadge />
            </li>
          </ul>
        </div>

        {/* Unternehmen */}
        <div>
          <div className="font-medium text-anthrazit mb-3 font-cormorant text-[15px]">Unternehmen</div>
          <ul className="space-y-2.5 text-gray-500">
            <li>
              <Link href="/ueber-uns" className="hover:text-anthrazit transition-colors">
                Über uns
              </Link>
            </li>
            <li className="text-gray-400">
              Presse
              <BaldBadge />
            </li>
            <li className="text-gray-400">
              Jobs
              <BaldBadge />
            </li>
            <li className="text-gray-400">
              Blog
              <BaldBadge />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>© 2026 Confetti House · Mit ♥ für besondere Momente</span>
          <div className="flex gap-5">
            <Link href="/datenschutz" className="hover:text-gray-600 transition-colors">Datenschutz</Link>
            <span className="text-gray-400 cursor-not-allowed" title="Wir arbeiten daran – diese Funktion wird bald verfügbar sein ✨">
              Impressum <BaldBadge />
            </span>
            <Link href="/agb" className="hover:text-gray-600 transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
