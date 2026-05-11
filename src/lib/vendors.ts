import { supabase } from './supabase'
import { Vendor, SearchParams } from '@/types'

export async function getVendors(params: SearchParams = {}): Promise<Vendor[]> {
  let query = supabase
    .from('vendors')
    .select(`*, category:categories(*)`)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })

  if (params.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as Vendor[]
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select(`*, category:categories(*)`)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as Vendor
}

export async function getFeaturedVendors(limit = 6): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select(`*, category:categories(*)`)
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
  { slug: 'locations',   name: 'Locations' },
  { slug: 'fotografen',  name: 'Fotografen' },
  { slug: 'videografen', name: 'Videografen' },
  { slug: 'catering',    name: 'Catering' },
  { slug: 'musik',       name: 'Musik' },
  { slug: 'makeup',      name: 'Makeup' },
  { slug: 'floristik',   name: 'Floristik' },
]