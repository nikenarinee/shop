import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'PASTE_PROJECT_URL'
const supabaseKey = 'PASTE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)