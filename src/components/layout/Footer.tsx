import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-serif text-lg italic mb-3">
            Hochzeits<span className="text-brand-500">planer</span>.de
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Deutschlands Plattform für Hochzeitslocations, Fotografen & Dienstleister. Kein Aufpreis für Paare.
          </p>
        </div>

        <div>
          <div className="font-medium text-gray-900 mb-3">Kategorien</div>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/locations" className="hover:text-gray-900">Locations</Link></li>
            <li><Link href="/fotografen" className="hover:text-gray-900">Fotografen</Link></li>
            <li><Link href="/floristik" className="hover:text-gray-900">Floristik</Link></li>
            <li><Link href="/catering" className="hover:text-gray-900">Catering</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-medium text-gray-900 mb-3">Städte</div>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/fotografen/berlin" className="hover:text-gray-900">Berlin</Link></li>
            <li><Link href="/fotografen/münchen" className="hover:text-gray-900">München</Link></li>
            <li><Link href="/fotografen/hamburg" className="hover:text-gray-900">Hamburg</Link></li>
            <li><Link href="/fotografen/mannheim" className="hover:text-gray-900">Mannheim</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-medium text-gray-900 mb-3">Anbieter</div>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/anbieter-werden" className="hover:text-gray-900">Kostenlos eintragen</Link></li>
            <li><Link href="/anbieter-werden#premium" className="hover:text-gray-900">Premium werden</Link></li>
            <li><Link href="/faq" className="hover:text-gray-900">FAQ</Link></li>
            <li><Link href="/kontakt" className="hover:text-gray-900">Kontakt</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>© 2025 Hochzeitsplaner.de · Made with ♡ in Mannheim</span>
          <div className="flex gap-4">
            <Link href="/datenschutz" className="hover:text-gray-600">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-gray-600">Impressum</Link>
            <Link href="/agb" className="hover:text-gray-600">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
