import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Creating Supabase client...')
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Supabase URL available:', !!supabaseUrl)
  console.log('Supabase Key available:', !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = `Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`
    console.error(errorMsg)
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
    )
  }

  console.log('Creating browser client with URL:', supabaseUrl.substring(0, 30) + '...')
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
