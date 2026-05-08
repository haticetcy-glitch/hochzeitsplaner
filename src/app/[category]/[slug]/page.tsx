import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getVendorBySlug, getVendorReviews } from '@/lib/vendors'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import InquiryForm from '@/components/ui/InquiryForm'
import { MapPin, Globe, Instagram, Phone, CheckCircle, Star } from 'lucide-react'

type Props = { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vendor = await getVendorBySlug(slug).catch(() => null)
  if (!vendor) return {}
  return {
    title: `${vendor.name} · ${vendor.city}`,
    description: vendor.tagline || undefined,
  }
}

export default async function VendorPage({ params }: Props) {
  const { slug } = await params
  const vendor = await getVendorBySlug(slug).catch(() => null)
  if (!vendor) notFound()

  const reviews = await getVendorReviews(vendor.id).catch(() => [])

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-400 flex gap-2">
        <a href="/" className="hover:text-gray-600">Start</a>
        <span>/</span>
        <a href={`/${vendor.category?.slug}`} className="hover:text-gray-600">
          {vendor.category?.name}
        </a>
        <span>/</span>
        <span className="text-gray-700">{vendor.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 md:h-80 bg-blush rounded-2xl overflow-hidden relative">
              {vendor.cover_image_url ? (
                <Image src={vendor.cover_image_url} alt={vendor.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {vendor.category?.icon || '💍'}
                </div>
              )}
              {vendor.is_featured && (
                <div className="absolute top-4 left-4 bg-terrakotta text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  Empfohlen
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-serif text-3xl font-normal text-anthrazit flex items-center gap-2">
                    {vendor.name}
                    {vendor.is_verified && (
                      <CheckCircle size={20} className="text-terrakotta shrink-0" />
                    )}
                  </h1>
                  {vendor.tagline && (
                    <p className="text-gray-500 mt-1">{vendor.tagline}</p>
                  )}
                </div>
                {vendor.price_from && (
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400">ab</div>
                    <div className="font-serif text-2xl text-gray-900">
                      {vendor.price_from.toLocaleString('de-DE')} €
                    </div>
                    <div className="text-xs text-gray-400">{vendor.price_unit}</div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={14} />
                  <span>{vendor.city}{vendor.state && `, ${vendor.state}`}</span>
                </div>
              </div>

              {vendor.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {vendor.tags.map((tag: string) => (
                    <span key={tag} className="tag-accent">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {vendor.description && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-serif text-xl font-normal mb-3">Über uns</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{vendor.description}</p>
              </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-serif text-xl font-normal mb-4">Kontakt & Links</h2>
              <div className="space-y-3">
                {vendor.website && (
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-terrakotta transition-colors">
                    <Globe size={15} />
                    {vendor.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {vendor.instagram && (
                  <a href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-terrakotta transition-colors">
                    <Instagram size={15} />
                    @{vendor.instagram.replace('@', '')}
                  </a>
                )}
                {vendor.phone && (
                  <a href={`tel:${vendor.phone}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-terrakotta transition-colors">
                    <Phone size={15} />
                    {vendor.phone}
                  </a>
                )}
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-serif text-xl font-normal mb-4">Bewertungen</h2>
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{review.reviewer_name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_: any, i: number) => (
                            <Star key={i} size={12}
                              className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      {review.text && (
                        <p className="text-sm text-gray-600">{review.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-20 self-start">
            <InquiryForm vendorId={vendor.id} vendorName={vendor.name} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}