/// <reference types="vite/types/importMeta.d.ts" />
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://igcmvzwwowdrvbujjvmk.supabase.co'
  const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_GxavaevJYilJMev9n_kS-w_Q1zP01ps'

  return createBrowserClient(supabaseUrl, supabasePublishableKey)
}

export const supabase = createClient()
