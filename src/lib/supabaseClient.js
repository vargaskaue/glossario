import { createClient } from '@supabase/supabase-js'

// Dados do Supabase
const supabaseUrl = 'https://ytxbyajfxnrspylqvvmn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0eGJ5YWpmeG5yc3B5bHF2dm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNTM5MDUsImV4cCI6MjA5NDgyOTkwNX0.TwE-9LWU7R70mZ7V_zFGLdi06IxdtJa4CobDNFf2Qns'

export const supabase = createClient(supabaseUrl, supabaseKey)