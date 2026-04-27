import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getVendorBySlug, getVendorReviews } from '@/lib/vendors'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import InquiryForm from '@/components/ui/InquiryForm'
import { MapPin, Globe, Instagram, Phone, CheckCircle, Star } from 'lucide-react'

type Props = { params: { category: string; slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vendor = await getVendorBySlug(params.slug).catch(() => null)
  if (!vendor) return {}
  return {
    title: `${vendor.name} · ${vendor.city}`,
    description: vendor.tagline || vendor.description?.slice(0, 160),
  }
}

export default async function VendorPage({ params }: Props) {
  const vendor = await getVendorBySlug(params.slug).catch(() => null)
  if (!vendor) notFound()

  const reviews = await getVendorReviews(vendor.id).catch(() => [])

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
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

          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Cover */}
            <div className="h-64 md:h-80 bg-brand-50 rounded-2xl overflow-hidden relative">
              {vendor.cover_image_url ? (
                <Image src={vendor.cover_image_url} alt={vendor.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {vendor.category?.icon || '💍'}
                </div>
              )}
              {vendor.is_featured && (
                <div className="absolute top-4 left-4 bg-brand-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  Empfohlen
                </div>
              )}
            </div>

            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-serif text-3xl font-normal text-gray-900 flex items-center gap-2">
                    {vendor.name}
                    {vendor.is_verified && (
                      <CheckCircle size={20} className="text-brand-500 shrink-0" />
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
                {vendor.avg_rating && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star size={14} className="text-brand-500 fill-brand-500" />
                    <span className="font-medium">{vendor.avg_rating.toFixed(1)}</span>
                    <span className="text-gray-400">({vendor.review_count} Bewertungen)</span>
                  </div>
                )}
              </div>

              {vendor.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {vendor.tags.map(tag => (
                    <span key={tag} className="tag-accent">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            {vendor.description && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-serif text-xl font-normal mb-3">Über uns</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{vendor.description}</p>
              </div>
            )}

            {/* Links */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-serif text-xl font-normal mb-4">Kontakt & Links</h2>
              <div className="space-y-3">
                {vendor.website && (
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-500 transition-colors">
                    <Globe size={15} />
                    {vendor.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {vendor.instagram && (
                  <a href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-500 transition-colors">
                    <Instagram size={15} />
                    @{vendor.instagram.replace('@', '')}
                  </a>
                )}
                {vendor.phone && (
                  <a href={`tel:${vendor.phone}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-brand-500 transition-colors">
                    <Phone size={15} />
                    {vendor.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h2 className="font-serif text-xl font-normal mb-4">Bewertungen</h2>
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{review.reviewer_name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12}
                              className={i < review.rating ? 'text-brand-500 fill-brand-500' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      {review.text && (
                        <p className="text-sm text-gray-600">{review.text}</p>
                      )}
                      {review.wedding_date && (
                        <p className="text-xs text-gray-400 mt-1">
                          Hochzeit: {new Date(review.wedding_date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Inquiry form (sticky) */}
          <div className="lg:sticky lg:top-20 self-start">
            <InquiryForm vendorId={vendor.id} vendorName={vendor.name} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
