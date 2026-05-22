import { createClient } from '@supabase/supabase-js';

// Pegamos as variáveis de ambiente injetadas pelo Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Credenciais do Supabase não encontradas no arquivo .env");
}

// Inicializa a conexão com o banco de dados
// Removemos '/rest/v1/' caso o usuário tenha copiado a URL da aba Data API por engano
const cleanSupabaseUrl = supabaseUrl ? supabaseUrl.replace('/rest/v1/', '').replace(/\/$/, '') : 'https://placeholder.supabase.co';

export const supabase = createClient(
  cleanSupabaseUrl,
  supabaseAnonKey || 'placeholder'
);
