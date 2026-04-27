import { supabase } from './supabase'
import { Vendor, SearchParams } from '@/types'

export async function getVendors(params: SearchParams = {}): Promise<Vendor[]> {
  let query = supabase
    .from('vendors')
    .select(`
      *,
      category:categories(*),
      rating:vendor_ratings(avg_rating, review_count)
    `)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('plan', { ascending: false })

  if (params.category) {
    query = query.eq('categories.slug', params.category)
  }

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`)
  }

  if (params.query) {
    query = query.textSearch('search_vector', params.query, {
      type: 'websearch',
      config: 'german',
    })
  }

  const from = ((params.page || 1) - 1) * 12
  query = query.range(from, from + 11)

  const { data, error } = await query
  if (error) throw error
  return (data || []) as Vendor[]
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select(`
      *,
      category:categories(*),
      rating:vendor_ratings(avg_rating, review_count)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null

  // Increment view count (fire and forget)
  supabase.rpc('increment_vendor_views', { vendor_id: data.id }).then(() => {})

  return data as Vendor
}

export async function getFeaturedVendors(limit = 6): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select(`*, category:categories(*), rating:vendor_ratings(avg_rating, review_count)`)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(limit)

  if (error) throw error
  return (data || []) as Vendor[]
}

export async function submitInquiry(inquiry: {
  vendor_id: string
  partner1_name: string
  partner2_name?: string
  email: string
  phone?: string
  wedding_date?: string
  guest_count?: number
  message?: string
}) {
  const { error } = await supabase.from('inquiries').insert(inquiry)
  if (error) throw error
}

export async function getVendorReviews(vendorId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const GERMAN_CITIES = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart',
  'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden',
  'Hannover', 'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld',
  'Bonn', 'Münster', 'Mannheim', 'Heidelberg', 'Karlsruhe', 'Freiburg',
  'Augsburg', 'Wiesbaden', 'Mainz', 'Kassel', 'Halle', 'Magdeburg',
]

export const CATEGORIES = [
  { slug: 'locations',   name: 'Locations',      icon: '📍' },
  { slug: 'fotografen',  name: 'Fotografen',     icon: '📷' },
  { slug: 'floristik',   name: 'Floristik',      icon: '🌸' },
  { slug: 'catering',    name: 'Catering',       icon: '🍽️' },
  { slug: 'musik',       name: 'DJ & Musik',     icon: '🎵' },
  { slug: 'hair-makeup', name: 'Hair & Make-up', icon: '💄' },
  { slug: 'dekoration',  name: 'Dekoration',     icon: '✨' },
  { slug: 'torte',       name: 'Hochzeitstorte', icon: '🎂' },
]
