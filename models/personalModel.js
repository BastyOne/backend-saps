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

  async getById(personalId) {
    const { data: personal, error: personalError } = await supabase
      .from('personal')
      .select(`
        nombre,
        rut,
        email,
        TipoPersona: tipopersona_id (nombre)
      `)
      .eq('id', personalId)
      .single();

    if (personalError) {
      throw new Error('Error al obtener el personal: ' + personalError.message);
    }


    if (personal) {
      const { data: fotos, error: fotoError } = await supabase
        .from('archivo')
        .select('archivo_url')
        .eq('entidad_id', personalId)
        .eq('entidad_tipo', 'Personal');

      if (fotoError) {
        console.error('Error al recuperar fotos para el personal:', fotoError);
        return { ...personal, foto: null }; 
      }


      return { ...personal, foto: fotos.length > 0 ? fotos[0].archivo_url : null };
    }

    return null;
  }
}

module.exports = Personal;
