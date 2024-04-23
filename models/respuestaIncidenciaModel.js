const { supabase } = require('../config/supabaseClient');

class RespuestaIncidencia {
  async addRespuesta({ incidencia_id, personal_id, contenido }) {
    const { data, error } = await supabase
      .from('respuestaincidencia')
      .insert([{
        incidencia_id,
        personal_id,
        contenido,
        fecharespuesta: new Date()
      }])
      .select();

    if (error) {
      throw new Error('Error al agregar respuesta a la incidencia: ' + error.message);
    }

    return data[0];
  }
}

module.exports = RespuestaIncidencia;
