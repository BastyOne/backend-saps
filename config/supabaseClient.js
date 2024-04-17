const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sxgobywsaifnczjstxqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Z29ieXdzYWlmbmN6anN0eHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2MDYyNTgsImV4cCI6MjAyODE4MjI1OH0.tWaJUSD7YVcLkWnk5Id1ck3rbBgPy4ofaKB41hfIvuM';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
