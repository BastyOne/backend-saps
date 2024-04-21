const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabaseClient');

class Personal {
  async add({ tipopersona_id, nombre, email, rol_id, contraseña, rut }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const { data, error } = await supabase
      .from('personal')
      .insert([{ tipopersona_id, nombre, email, rol_id, contraseña: hashedPassword, rut }]);
    return { data, error };
  }

  async getAll() {
    const { data, error } = await supabase.from('personal').select('*');
    return { data, error };
  }
}

module.exports = Personal;
