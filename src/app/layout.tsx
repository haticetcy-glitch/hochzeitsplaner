import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
