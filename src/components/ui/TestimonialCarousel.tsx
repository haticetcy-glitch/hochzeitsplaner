'use client'
import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah & Jonas',
    date: 'Oktober 2024',
    vendor: 'Miel Photography',
    text: 'Wir haben über Confetti House unsere Traumfotografin gefunden. Der Prozess war so einfach – innerhalb von 24 Stunden hatten wir eine Antwort!',
    rating: 5,
  },
  {
    name: 'Laura & Markus',
    date: 'August 2024',
    vendor: 'Grand Venue Heidelberg',
    text: 'Die Location unserer Träume – gefunden in weniger als 5 Minuten. Die Direktanfrage hat uns viel Zeit und Nerven gespart. Absolut empfehlenswert!',
    rating: 5,
  },
  {
    name: 'Elena & Tom',
    date: 'September 2024',
    vendor: 'Taste & Joy Catering',
    text: 'Der beste Catering-Service, den wir uns vorstellen konnten. Alle Gäste waren begeistert. Wir sind so froh, dass wir Confetti House gefunden haben.',
    rating: 5,
  },
]

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0)
  const t = TESTIMONIALS[active]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(43,43,43,0.07)' }}>
      <h3 className="font-playfair text-lg text-anthrazit leading-snug mb-5">
        Echte Bewertungen.<br />Echte Erlebnisse.
      </h3>

      <div className="bg-sand rounded-xl p-5">
        <div className="flex gap-0.5 mb-3">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} size={13} className="text-gold fill-gold" />
          ))}
        </div>
        <p className="text-sm text-anthrazit leading-relaxed mb-4">
          &ldquo;{t.text}&rdquo;
        </p>
        <div>
          <div className="text-xs font-medium text-anthrazit">{t.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            {t.date} · {t.vendor}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === active ? 'bg-terrakotta' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActive((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-terrakotta hover:text-terrakotta transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={() => setActive((active + 1) % TESTIMONIALS.length)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-terrakotta hover:text-terrakotta transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
