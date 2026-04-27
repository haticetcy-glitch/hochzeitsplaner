# Hochzeitsplaner.de

Deutschlands Hochzeits-Marktplatz — inspiriert von dugun.com (Türkei).

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Datenbank:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Bilder:** Cloudinary (optional)
- **E-Mail:** Resend (optional, für Anbieter-Benachrichtigungen)

## Setup in 5 Schritten

### 1. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) → New Project
2. Öffne den SQL Editor
3. Führe `supabase/schema.sql` aus (komplett copy-pasten)
4. Kopiere deine API-Keys aus Settings → API

### 2. Environment Variables

```bash
cp .env.local.example .env.local
# Füge deine Supabase Keys ein
```

### 3. Dependencies installieren

```bash
npm install
```

### 4. Dev-Server starten

```bash
npm run dev
# → http://localhost:3000
```

### 5. Auf Vercel deployen

```bash
# Vercel CLI
npm i -g vercel
vercel

# Dann in Vercel Dashboard: Environment Variables setzen
```

## Projekt-Struktur

```
src/
├── app/
│   ├── page.tsx                    # Startseite
│   ├── [category]/
│   │   ├── page.tsx                # Kategorie-Liste (z.B. /fotografen)
│   │   └── [slug]/page.tsx         # Anbieter-Detailseite
│   ├── anbieter-werden/page.tsx    # Onboarding für Anbieter
│   └── api/inquiries/route.ts      # Anfragen-API
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── cards/VendorCard.tsx
│   └── ui/SearchBar.tsx, InquiryForm.tsx
├── lib/
│   ├── supabase.ts                 # Supabase Client
│   └── vendors.ts                  # Data-Fetching + Hilfsfunktionen
└── types/index.ts                  # TypeScript Types
```

## SEO-Strategie

Die URL-Struktur ist für lokale Suchen optimiert:

```
/fotografen                    → alle Fotografen
/fotografen?stadt=Mannheim     → Fotografen in Mannheim
/fotografen/miel-studio        → Detailseite Miel Studio
/locations/schloss-heidelberg  → Detailseite Location
```

## Monetarisierung

| Paket    | Preis       | Features                          |
|----------|-------------|-----------------------------------|
| Basis    | kostenlos   | Profil, 3 Fotos, Anfragen         |
| Premium  | €49/Monat   | Priorität, unbegrenzte Fotos      |
| Featured | €99/Monat   | Startseite, Newsletter, Badge     |

## Nächste Schritte

- [ ] Admin-Panel für Anbieter (Supabase Auth)
- [ ] Bildupload via Cloudinary
- [ ] E-Mail-Benachrichtigungen via Resend
- [ ] Blog / Ratgeber-Sektion für SEO
- [ ] Sitemap.xml automatisch generieren
- [ ] Google Analytics / Vercel Analytics
