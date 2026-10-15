import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createBrowserClient, supabase as browserSupabase } from './supabase/client'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://igcmvzwwowdrvbujjvmk.supabase.co'
export const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_GxavaevJYilJMev9n_kS-w_Q1zP01ps'

// Standard JS Client
export const supabase = browserSupabase || createSupabaseClient(supabaseUrl, supabasePublishableKey)
export { createBrowserClient }

export default supabase
