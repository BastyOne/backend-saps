const { createClient } = require('@supabase/supabase-js');

// Usa variables de entorno para configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
