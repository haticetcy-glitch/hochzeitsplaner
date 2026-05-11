'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Eye, MessageSquare, Star, LogOut, Pencil, ExternalLink } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type Profile = {
  email: string
  phone: string
  business_name: string
  category: string
  city: string
  website: string
  bio: string
  profile_image_url: string
  portfolio_urls: string[]
}

function calcCompletion(profile: Partial<Profile> | null): number {
  if (!profile) return 0
  const required: (keyof Profile)[] = ['email', 'phone', 'business_name', 'category', 'city']
  const optional: (keyof Profile)[] = ['website', 'bio', 'profile_image_url']
  const reqFilled = required.filter(k => profile[k] && String(profile[k]).trim()).length
  const optFilled = optional.filter(k => profile[k] && String(profile[k]).trim()).length
  const portfolioFilled = (profile.portfolio_urls?.length ?? 0) > 0 ? 1 : 0
  return Math.round((reqFilled * 14 + (optFilled + portfolioFilled) * 7.5))
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = getBrowserClient()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Partial<Profile> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/dienstleister/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
      setLoading(false)
    }
    init()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/dienstleister/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terrakotta border-t-transparent animate-spin" />
      </div>
    )
  }

  const completion = calcCompletion(profile)
  const displayName = profile?.business_name || user?.email?.split('@')[0] || 'Dienstleister'

  return (
    <div className="min-h-screen bg-sand">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center gap-[3px] leading-none">
            <span className="font-playfair italic text-[1.3rem] leading-none">
              <span className="text-anthrazit">confe</span><span className="text-terrakotta">tti</span>
            </span>
            <span className="text-gold text-[8px] leading-none">♥</span>
            <span className="flex items-center gap-1 leading-none">
              <span className="inline-block h-px w-2.5 bg-gold" />
              <span className="font-cormorant text-[8px] tracking-[0.3em] text-anthrazit uppercase" style={{ fontVariant: 'small-caps' }}>HOUSE</span>
              <span className="inline-block h-px w-2.5 bg-gold" />
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link href="/dienstleister/profil-bearbeiten"
              className="flex items-center gap-1.5 text-sm text-anthrazit hover:text-terrakotta transition-colors px-3 py-1.5 rounded-lg hover:bg-sand font-cormorant">
              <Pencil size={14} /> Profil bearbeiten
            </Link>
            {user && (
              <Link href={`/anbieter/${user.id}`}
                className="flex items-center gap-1.5 text-sm text-anthrazit hover:text-terrakotta transition-colors px-3 py-1.5 rounded-lg hover:bg-sand font-cormorant">
                <ExternalLink size={14} /> Profil ansehen
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-terrakotta transition-colors px-3 py-1.5 rounded-lg hover:bg-sand font-cormorant ml-1"
            >
              <LogOut size={14} /> Abmelden
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Welcome */}
        <div className="bg-white rounded-2xl p-7 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(43,43,43,0.06)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400 font-cormorant mb-1">Willkommen zurück</p>
              <h1 className="font-playfair text-2xl text-anthrazit">{displayName}</h1>
              <p className="text-sm text-gray-500 mt-1 font-cormorant">{user?.email}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center shrink-0">
              {profile?.profile_image_url ? (
                <img src={profile.profile_image_url} alt={displayName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <User size={20} className="text-terrakotta" />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-anthrazit">Profilstärke</span>
              <span className="text-xs font-medium text-terrakotta">{completion}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-terrakotta rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion < 100 && (
              <p className="text-xs text-gray-400 mt-2 font-cormorant">
                {completion === 0
                  ? 'Vervollständige dein Profil, um von Kunden gefunden zu werden.'
                  : 'Ergänze noch fehlende Informationen für ein vollständiges Profil.'}
                {' '}
                <Link href="/dienstleister/profil-bearbeiten" className="text-terrakotta hover:underline">
                  Jetzt bearbeiten →
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Eye, label: 'Profilaufrufe', value: '—', note: 'Bald verfügbar' },
            { icon: MessageSquare, label: 'Anfragen', value: '—', note: 'Bald verfügbar' },
            { icon: Star, label: 'Bewertungen', value: '—', note: 'Bald verfügbar' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center" style={{ boxShadow: '0 2px 12px rgba(43,43,43,0.06)' }}>
              <stat.icon size={20} className="text-terrakotta mx-auto mb-2" />
              <div className="font-playfair text-2xl text-anthrazit mb-0.5">{stat.value}</div>
              <div className="text-xs font-medium text-anthrazit mb-1">{stat.label}</div>
              <div className="text-[10px] text-gray-400 font-cormorant">{stat.note}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        {completion < 50 && (
          <div className="bg-blush rounded-2xl p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-playfair text-lg text-anthrazit mb-1">Profil vervollständigen</h2>
              <p className="text-sm text-anthrazit/70 font-cormorant max-w-md">
                Ein vollständiges Profil erhöht deine Sichtbarkeit und hilft Kunden, den richtigen Anbieter zu finden.
              </p>
            </div>
            <Link href="/dienstleister/profil-bearbeiten" className="btn-primary shrink-0 whitespace-nowrap">
              Jetzt ausfüllen
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
