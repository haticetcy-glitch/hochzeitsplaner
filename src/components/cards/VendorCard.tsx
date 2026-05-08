import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, CheckCircle } from 'lucide-react'
import { Vendor } from '@/types'

function PriceBadge({ vendor }: { vendor: Vendor }) {
  if (!vendor.price_from) return null
  return (
    <span className="text-xs text-gray-500">
      ab {vendor.price_from.toLocaleString('de-DE')} €
    </span>
  )
}

function StarRating({ rating, count }: { rating?: number; count?: number }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="text-gold fill-gold" />
      <span className="text-xs font-medium">{rating.toFixed(1)}</span>
      {count && <span className="text-xs text-gray-400">({count})</span>}
    </div>
  )
}

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  const href = `/${vendor.category?.slug || 'anbieter'}/${vendor.slug}`

  return (
    <Link href={href} className="card group block">
      {/* Cover image */}
      <div className="h-44 bg-blush relative overflow-hidden">
        {vendor.cover_image_url ? (
          <Image
            src={vendor.cover_image_url}
            alt={vendor.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {vendor.category?.icon || '💍'}
          </div>
        )}
        {vendor.is_featured && (
          <div className="absolute top-2 left-2 bg-terrakotta text-white text-xs px-2.5 py-1 rounded-full font-medium">
            Empfohlen
          </div>
        )}
        {vendor.plan === 'premium' && !vendor.is_featured && (
          <div className="absolute top-2 left-2 bg-white text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-200">
            Premium
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-anthrazit text-sm leading-snug group-hover:text-terrakotta transition-colors">
            {vendor.name}
            {vendor.is_verified && (
              <CheckCircle size={13} className="inline ml-1 text-terrakotta mb-0.5" />
            )}
          </h3>
          <PriceBadge vendor={vendor} />
        </div>

        {vendor.tagline && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
            {vendor.tagline}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} />
            <span>{vendor.city}</span>
          </div>
          <StarRating rating={vendor.avg_rating} count={vendor.review_count} />
        </div>

        {vendor.tags.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {vendor.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
