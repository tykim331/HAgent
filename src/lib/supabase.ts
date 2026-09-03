import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpvmpdwoqfarwaprzdoq.supabase.co';
const supabaseKey = 'sb_publishable_O3mfZTAN-OkSUe7o5Ewaag_PvmMaYuj';

export const supabase = createClient(supabaseUrl, supabaseKey);
