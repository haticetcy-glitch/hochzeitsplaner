'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Check, AlertCircle } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const CATEGORIES = [
  'Locations', 'Fotografen', 'Videografen', 'Catering',
  'Musik', 'Makeup', 'Floristik',
]

type FormState = {
  email: string
  phone: string
  business_name: string
  category: string
  city: string
  website: string
  bio: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function ProfilBearbeitenPage() {
  const router = useRouter()
  const supabase = getBrowserClient()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState<FormState>({
    email: '', phone: '', business_name: '',
    category: '', city: '', website: '', bio: '',
  })

  // Image state
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([])
  const [portfolioFiles, setPortfolioFiles] = useState<(File | null)[]>(Array(6).fill(null))
  const [uploadingImages, setUploadingImages] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const portfolioInputRefs = useRef<(HTMLInputElement | null)[]>([])

  function set(key: keyof FormState, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/dienstleister/login'); return }
      setUser(user)
      const { data: profile } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profile) {
        setForm({
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          business_name: profile.business_name || '',
          category: profile.category || '',
          city: profile.city || '',
          website: profile.website || '',
          bio: profile.bio || '',
        })
        setProfileImageUrl(profile.profile_image_url || '')
        setPortfolioUrls(profile.portfolio_urls || [])
      } else {
        setForm(f => ({ ...f, email: user.email || '' }))
      }
      setLoading(false)
    }
    init()
  }, [])

  async function uploadImage(bucket: string, path: string, file: File): Promise<string | null> {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) { console.error('Upload error:', error.message); return null }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaveStatus('saving')
    setErrorMsg('')

    let finalProfileImageUrl = profileImageUrl
    const finalPortfolioUrls = [...portfolioUrls]

    // Upload profile image if new file selected
    if (profileImageFile) {
      setUploadingImages(true)
      const ext = profileImageFile.name.split('.').pop()
      const url = await uploadImage('vendor-images', `${user.id}/avatar.${ext}`, profileImageFile)
      if (url) finalProfileImageUrl = url
      setUploadingImages(false)
    }

    // Upload new portfolio images
    for (let i = 0; i < portfolioFiles.length; i++) {
      const file = portfolioFiles[i]
      if (!file) continue
      setUploadingImages(true)
      const ext = file.name.split('.').pop()
      const url = await uploadImage('vendor-images', `${user.id}/portfolio-${i}.${ext}`, file)
      if (url) finalPortfolioUrls[i] = url
      setUploadingImages(false)
    }

    const { error } = await supabase.from('vendor_profiles').upsert({
      id: user.id,
      email: form.email,
      phone: form.phone,
      business_name: form.business_name,
      category: form.category,
      city: form.city,
      website: form.website,
      bio: form.bio,
      profile_image_url: finalProfileImageUrl,
      portfolio_urls: finalPortfolioUrls.filter(Boolean),
    })

    if (error) {
      setErrorMsg('Fehler beim Speichern. Bitte versuche es erneut.')
      setSaveStatus('error')
    } else {
      setProfileImageUrl(finalProfileImageUrl)
      setPortfolioUrls(finalPortfolioUrls.filter(Boolean))
      setProfileImageFile(null)
      setPortfolioFiles(Array(6).fill(null))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErrorMsg('Bild darf maximal 5 MB groß sein.'); return }
    setProfileImageFile(file)
    setProfileImageUrl(URL.createObjectURL(file))
  }

  function handlePortfolioChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErrorMsg('Bild darf maximal 5 MB groß sein.'); return }
    const newFiles = [...portfolioFiles]
    newFiles[index] = file
    setPortfolioFiles(newFiles)
    const newUrls = [...portfolioUrls]
    newUrls[index] = URL.createObjectURL(file)
    setPortfolioUrls(newUrls)
  }

  function removePortfolioImage(index: number) {
    const newFiles = [...portfolioFiles]
    newFiles[index] = null
    setPortfolioFiles(newFiles)
    const newUrls = [...portfolioUrls]
    newUrls[index] = ''
    setPortfolioUrls(newUrls)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terrakotta border-t-transparent animate-spin" />
      </div>
    )
  }

  const isSaving = saveStatus === 'saving' || uploadingImages

  return (
    <div className="min-h-screen bg-sand">

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dienstleister/dashboard"
            className="flex items-center gap-2 text-sm text-anthrazit hover:text-terrakotta transition-colors font-cormorant">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <Link href="/" className="flex flex-col items-center gap-[3px] leading-none">
            <span className="font-playfair italic text-[1.2rem] leading-none">
              <span className="text-anthrazit">confe</span><span className="text-terrakotta">tti</span>
            </span>
          </Link>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl text-anthrazit mb-1">Profil bearbeiten</h1>
          <p className="font-cormorant text-gray-500">Felder mit * sind Pflichtangaben.</p>
        </div>

        {/* Save status banner */}
        {saveStatus === 'saved' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">
            <Check size={15} /> Profil erfolgreich gespeichert.
          </div>
        )}
        {(saveStatus === 'error' || errorMsg) && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertCircle size={15} /> {errorMsg || 'Fehler beim Speichern.'}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">

          {/* ── Kontakt ── */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-playfair text-lg text-anthrazit mb-5">Kontakt</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">E-Mail-Adresse *</label>
                <input className="input" type="email" required value={form.email}
                  onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Telefonnummer * <span className="text-gray-400 font-normal">Format: +49 171 1234567</span>
                </label>
                <input className="input" type="tel" required placeholder="+49 171 1234567"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── Basisinfos ── */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-playfair text-lg text-anthrazit mb-5">Basisinformationen</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Unternehmensname *</label>
                <input className="input" required placeholder="z.B. Miel Photography"
                  value={form.business_name} onChange={e => set('business_name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategorie *</label>
                  <select className="input" required value={form.category}
                    onChange={e => set('category', e.target.value)}>
                    <option value="">Bitte wählen</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Stadt / Region *</label>
                  <input className="input" required placeholder="z.B. Berlin"
                    value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Website <span className="text-gray-400 font-normal">(optional)</span></label>
                <input className="input" type="url" placeholder="https://deine-website.de"
                  value={form.website} onChange={e => set('website', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── Profil ── */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-playfair text-lg text-anthrazit mb-5">Profil</h2>
            <div className="space-y-6">

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-600">Über uns / Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                  <span className={`text-[10px] ${form.bio.length > 480 ? 'text-terrakotta' : 'text-gray-400'}`}>
                    {form.bio.length} / 500
                  </span>
                </div>
                <textarea
                  className="input resize-none font-cormorant text-base"
                  rows={5}
                  maxLength={500}
                  placeholder="Erzähle potenziellen Kunden, wer du bist, was dich auszeichnet und welche Leistungen du anbietest…"
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                />
              </div>

              {/* Profile image */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-3">Profilbild <span className="text-gray-400 font-normal">(optional, max. 5 MB)</span></label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-sand border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Profilbild" className="w-full h-full object-cover" />
                    ) : (
                      <Upload size={18} className="text-gray-300" />
                    )}
                  </div>
                  <div>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
                      onChange={handleAvatarChange} />
                    <button type="button" onClick={() => avatarInputRef.current?.click()}
                      className="btn-outline text-xs px-4 py-2">
                      {profileImageUrl ? 'Bild ändern' : 'Bild hochladen'}
                    </button>
                    {profileImageUrl && (
                      <button type="button" onClick={() => { setProfileImageUrl(''); setProfileImageFile(null) }}
                        className="ml-2 text-xs text-gray-400 hover:text-red-500 transition-colors">
                        Entfernen
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-3">
                  Portfolio-Fotos <span className="text-gray-400 font-normal">(optional, bis zu 6 Bilder, max. 5 MB je Bild)</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-sand border-2 border-dashed border-gray-200">
                      {portfolioUrls[i] ? (
                        <>
                          <img src={portfolioUrls[i]} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePortfolioImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            portfolioInputRefs.current[i] = portfolioInputRefs.current[i] || null
                            document.getElementById(`portfolio-input-${i}`)?.click()
                          }}
                          className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-terrakotta hover:bg-blush/30 transition-colors"
                        >
                          <Upload size={18} />
                          <span className="text-[10px]">Foto hinzufügen</span>
                        </button>
                      )}
                      <input
                        id={`portfolio-input-${i}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handlePortfolioChange(i, e)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Save button */}
          <div className="flex items-center justify-between pt-2">
            <Link href="/dienstleister/dashboard"
              className="text-sm text-gray-400 hover:text-anthrazit transition-colors font-cormorant">
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary px-8 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {uploadingImages ? 'Bilder werden hochgeladen…' : 'Wird gespeichert…'}
                </>
              ) : (
                'Profil speichern'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
