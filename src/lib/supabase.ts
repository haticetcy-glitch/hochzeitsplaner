import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Legacy client — used by existing vendor/inquiry queries
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// SSR-aware browser client — sessions stored in cookies (required for middleware auth)
export function getBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Admin client with service role — server-only, never expose to browser
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
