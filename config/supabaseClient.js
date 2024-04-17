const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Environment variables for Supabase are not properly set.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
