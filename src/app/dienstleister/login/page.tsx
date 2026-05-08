'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase'

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Ungültige E-Mail-Adresse oder falsches Passwort.',
  'Email not confirmed': 'Bitte bestätige zuerst deine E-Mail-Adresse.',
  'Too many requests': 'Zu viele Versuche. Bitte warte kurz und versuche es erneut.',
}

function translateError(msg: string) {
  for (const [key, val] of Object.entries(ERROR_MAP)) {
    if (msg.includes(key)) return val
  }
  return 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dienstleister/dashboard'
  const supabase = getBrowserClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    })
    if (error) setError(translateError(error.message))
    setLoading(false)
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(translateError(error.message))
      setLoading(false)
    } else {
      router.push(redirectTo)
    }
  }

  async function handlePasswordReset() {
    if (!email) {
      setError('Bitte gib zuerst deine E-Mail-Adresse ein.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dienstleister/passwort-reset`,
    })
    if (error) {
      setError(translateError(error.message))
    } else {
      setResetSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 py-16">

      {/* Logo */}
      <Link href="/" className="flex flex-col items-center gap-[3px] leading-none mb-10">
        <span className="font-playfair italic text-[1.8rem] leading-none">
          <span className="text-anthrazit">confe</span><span className="text-terrakotta">tti</span>
        </span>
        <span className="text-gold text-[9px] leading-none">♥</span>
        <span className="flex items-center gap-1.5 leading-none">
          <span className="inline-block h-px w-3 bg-gold" />
          <span className="font-cormorant text-[9px] tracking-[0.3em] text-anthrazit uppercase" style={{ fontVariant: 'small-caps' }}>HOUSE</span>
          <span className="inline-block h-px w-3 bg-gold" />
        </span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="font-playfair text-2xl text-anthrazit mb-1">Willkommen zurück</h1>
        <p className="font-cormorant text-gray-500 mb-7">Melde dich in deinem Dienstleister-Konto an.</p>

        {resetSent ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">📧</div>
            <h2 className="font-playfair text-lg text-anthrazit mb-2">E-Mail gesendet</h2>
            <p className="text-sm text-gray-500 font-cormorant leading-relaxed">
              Wir haben dir einen Link zum Zurücksetzen deines Passworts geschickt. Bitte prüfe dein Postfach.
            </p>
            <button onClick={() => setResetSent(false)} className="mt-4 text-xs text-terrakotta hover:underline">
              Zurück zum Login
            </button>
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-full py-2.5 text-sm font-medium text-anthrazit hover:bg-sand transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              Mit Google anmelden
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <span className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-cormorant tracking-widest uppercase">oder</span>
              <span className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">E-Mail-Adresse</label>
                <input
                  className="input"
                  type="email"
                  required
                  placeholder="deine@email.de"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-600">Passwort</label>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-xs text-gray-400 hover:text-terrakotta transition-colors"
                  >
                    Passwort vergessen?
                  </button>
                </div>
                <div className="relative">
                  <input
                    className="input pr-10"
                    type={showPw ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-anthrazit transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center mt-2 disabled:opacity-50"
              >
                {loading ? 'Wird angemeldet…' : 'Anmelden'}
              </button>
            </form>

            <p className="text-xs text-center text-gray-400 mt-6 font-cormorant">
              Noch kein Konto?{' '}
              <Link href="/dienstleister/registrieren" className="text-terrakotta hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
