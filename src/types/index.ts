export type Category = {
  id: string
  slug: string
  name: string
  icon: string | null
  description: string | null
  sort_order: number
}

export type Vendor = {
  id: string
  created_at: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  category_id: string | null
  city: string
  state: string | null
  zip: string | null
  lat: number | null
  lng: number | null
  service_radius_km: number
  email: string | null
  phone: string | null
  website: string | null
  instagram: string | null
  cover_image_url: string | null
  gallery_urls: string[]
  price_from: number | null
  price_to: number | null
  price_unit: string
  is_featured: boolean
  is_verified: boolean
  is_active: boolean
  plan: 'free' | 'premium' | 'featured'
  views_count: number
  inquiry_count: number
  tags: string[]
  // joined
  category?: Category
  avg_rating?: number
  review_count?: number
}

export type Review = {
  id: string
  created_at: string
  vendor_id: string
  reviewer_name: string
  rating: number
  text: string | null
  wedding_date: string | null
  is_approved: boolean
}

export type Inquiry = {
  vendor_id: string
  partner1_name: string
  partner2_name?: string
  email: string
  phone?: string
  wedding_date?: string
  guest_count?: number
  location_city?: string
  budget_range?: string
  message?: string
}

export type SearchParams = {
  category?: string
  city?: string
  query?: string
  page?: number
}
