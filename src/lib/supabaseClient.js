import { createClient } from '@supabase/supabase-js'

// Você vai pegar esses dados no painel do Supabase depois
const supabaseUrl = 'SUA_URL_DO_SUPABASE_AQUI'
const supabaseKey = 'SUA_CHAVE_ANONIMA_AQUI'

export const supabase = createClient(supabaseUrl, supabaseKey)