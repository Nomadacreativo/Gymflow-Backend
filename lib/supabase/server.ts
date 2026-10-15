import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

export function createClient(request: Request) {
  const headers = new Headers()
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://igcmvzwwowdrvbujjvmk.supabase.co'
  const supabasePublishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_GxavaevJYilJMev9n_kS-w_Q1zP01ps'

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '') as {
            name: string
            value: string
          }[]
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
          )
        },
      },
    }
  )

  return { supabase, headers }
}
