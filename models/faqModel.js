const { supabase } = require('../config/supabaseClient');

class FAQ {
  async getAll() {
    const { data, error } = await supabase.from('faq').select('pregunta, respuesta');
    return { data, error };
  }
  async getByCategory(categoriafaq_id) {
    const { data, error } = await supabase.from('faq').select('*').eq('categoriafaq_id', categoriafaq_id);
    return { data, error };
  }

  async add({ categoriafaq_id, pregunta, respuesta }) {
    const { data, error } = await supabase.from('faq').insert([{ categoriafaq_id, pregunta, respuesta }]);
    return { data, error };
  }

  async update(id, updates) {
    const { data, error } = await supabase.from('faq').update(updates).match({ id });
    return { data, error };
  }

  async delete(id) {
    const { data, error } = await supabase.from('faq').delete().match({ id });
    return { data, error };
  }
}

module.exports = FAQ;
