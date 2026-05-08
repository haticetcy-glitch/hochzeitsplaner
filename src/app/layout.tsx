import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: {
    default: 'Hochzeitsplaner.de – Locations, Fotografen & Dienstleister',
    template: '%s | Hochzeitsplaner.de',
  },
  description: 'Deutschlands größte Plattform für Hochzeitslocations, Fotografen und Dienstleister. Kostenlos anfragen – keine Provision.',
  keywords: ['Hochzeitsplaner', 'Hochzeitsfotograf', 'Hochzeitslocation', 'Heiraten Deutschland'],
  openGraph: {
    title: 'Hochzeitsplaner.de',
    description: 'Locations, Fotografen & Dienstleister für euren Traumtag',
    url: 'https://hochzeitsplaner.de',
    siteName: 'Hochzeitsplaner.de',
    locale: 'de_DE',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${playfair.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  )
}
