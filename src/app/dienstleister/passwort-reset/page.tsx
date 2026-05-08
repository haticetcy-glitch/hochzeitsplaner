'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase'

export default function PasswortResetPage() {
  const router = useRouter()
  const supabase = getBrowserClient()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }
    if (password !== confirm) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('Fehler beim Zurücksetzen. Der Link ist möglicherweise abgelaufen.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/dienstleister/dashboard'), 2500)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 py-16">

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
        <h1 className="font-playfair text-2xl text-anthrazit mb-1">Neues Passwort</h1>
        <p className="font-cormorant text-gray-500 mb-7">Bitte wähle ein neues Passwort für dein Konto.</p>

        {done ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✓</div>
            <h2 className="font-playfair text-lg text-anthrazit mb-2">Passwort geändert</h2>
            <p className="text-sm text-gray-500 font-cormorant">Du wirst gleich weitergeleitet…</p>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-xs text-red-500 mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Neues Passwort <span className="text-gray-400 font-normal">(min. 8 Zeichen)</span>
                </label>
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

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Passwort bestätigen</label>
                <input
                  className="input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center mt-2 disabled:opacity-50"
              >
                {loading ? 'Wird gespeichert…' : 'Passwort speichern'}
              </button>
            </form>

            <p className="text-xs text-center text-gray-400 mt-6 font-cormorant">
              <Link href="/dienstleister/login" className="text-terrakotta hover:underline">
                Zurück zum Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
