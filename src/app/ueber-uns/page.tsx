import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Search, MessageSquare, Heart } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Dienstleister entdecken',
    description:
      'Durchsuche hunderte geprüfte Anbieter aus allen Kategorien – von Fotografen über Locations bis zur Floristik. Filtere nach Stadt, Kategorie und mehr.',
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Direkt anfragen',
    description:
      'Kontaktiere Dienstleister direkt und kostenlos über unser Formular. Keine Vermittlungsgebühren, keine Umwege – du kommunizierst direkt.',
  },
  {
    icon: Heart,
    step: '03',
    title: 'Euren Tag genießen',
    description:
      'Entspannt euren besonderen Tag erleben, während die besten Profis alles für euch perfekt gestalten.',
  },
]

const TEAM = [
  { name: 'Sarah Müller', role: 'Gründerin & CEO', initials: 'SM' },
  { name: 'Jonas Weber', role: 'Technik & Produkt', initials: 'JW' },
  { name: 'Laura Schmidt', role: 'Marketing & Partnerschaften', initials: 'LS' },
  { name: 'David Keller', role: 'Design & Erlebnis', initials: 'DK' },
]

export default function UeberUnsPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative w-full flex items-center justify-center text-center"
        style={{
          minHeight: '60vh',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
        <div className="relative z-10 px-6 max-w-3xl mx-auto">
          <p className="text-gold text-sm tracking-[0.4em] uppercase font-cormorant mb-4">Unsere Geschichte</p>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Wir glauben an<br />unvergessliche Momente.
          </h1>
          <p className="text-white/80 text-lg font-cormorant leading-relaxed max-w-xl mx-auto">
            Confetti House verbindet Menschen mit den besten Dienstleistern für ihre besonderen Ereignisse –
            transparent, direkt und mit Herz.
          </p>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="inline-block text-gold text-xs tracking-[0.4em] uppercase font-cormorant mb-4">Unsere Mission</span>
        <h2 className="font-playfair text-3xl md:text-4xl text-anthrazit mb-6">
          Besondere Momente verdienen<br />besondere Menschen.
        </h2>
        <p className="text-gray-600 text-lg font-cormorant leading-relaxed max-w-2xl mx-auto">
          Wir haben Confetti House gegründet, weil die Suche nach dem richtigen Dienstleister für den wichtigsten
          Tag im Leben viel zu kompliziert war. Zu viele Plattformen, zu wenig Transparenz, zu hohe Provisionen.
          <br /><br />
          Unser Versprechen: Direkte Verbindung zwischen Gastgebern und den besten Kreativen Deutschlands.
          Keine versteckten Gebühren. Nur echte Menschen, echte Qualität, echte Momente.
        </p>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="inline-block text-gold text-xs tracking-[0.4em] uppercase font-cormorant mb-4">So einfach geht es</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-anthrazit">In drei Schritten zum Traumteam</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STEPS.map(step => (
            <div key={step.step} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center">
                  <step.icon size={24} className="text-terrakotta" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold text-white text-[11px] font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="font-playfair text-xl text-anthrazit mb-3">{step.title}</h3>
              <p className="text-gray-500 font-cormorant leading-relaxed text-[1.05rem]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-gold text-xs tracking-[0.4em] uppercase font-cormorant mb-4">Das Team</span>
            <h2 className="font-playfair text-3xl text-anthrazit">Menschen hinter Confetti House</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="text-center">
                <div className="w-20 h-20 rounded-full bg-blush mx-auto mb-4 flex items-center justify-center">
                  <span className="font-playfair text-xl text-terrakotta">{member.initials}</span>
                </div>
                <h3 className="font-medium text-anthrazit text-sm">{member.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-cormorant">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-blush py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <span className="text-gold text-xs tracking-[0.4em] uppercase font-cormorant">Mach mit</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-anthrazit mt-4 mb-5">
            Bist du Dienstleister?<br />Dann bist du bei uns richtig.
          </h2>
          <p className="text-gray-600 font-cormorant text-lg mb-8 leading-relaxed">
            Erstelle dein kostenloses Profil und werde von tausenden Paaren und Gastgebern entdeckt.
            Kein Abo, keine Provision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dienstleister/registrieren" className="btn-primary px-8 py-3 text-base">
              Jetzt kostenlos eintragen
            </Link>
            <Link href="/suche" className="btn-outline px-8 py-3 text-base">
              Dienstleister entdecken
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
