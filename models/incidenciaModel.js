const { supabase } = require('../config/supabaseClient');

class Incidencia {
  async add({ alumno_id, categoriaincidencia_id, descripcion, personal_id, prioridad }) {
    const { data, error } = await supabase
      .from('incidencia')
      .insert([{
        alumno_id,
        categoriaincidencia_id,
        descripcion,
        personal_id,
        estado: 'pendiente',
        fechahoracreacion: new Date(),
        reabierta: false,
        prioridad: prioridad
      }])
      .select();

    if (error) throw new Error('Error al crear la incidencia: ' + error.message);
    if (!data || data.length === 0) throw new Error('No se recibieron datos de la inserción de la incidencia');

    return data[0];
  }

  async getByPersonalId(personalId) {
    const { data: incidencias, error: incidenciaError } = await supabase
      .from('incidencia')
      .select('*')
      .eq('personal_id', personalId);

    if (incidenciaError) {
      throw new Error('Error al obtener incidencias: ' + incidenciaError.message);
    }

    // Ahora para cada incidencia, consulta los archivos asociados.
    const incidenciasConArchivos = await Promise.all(incidencias.map(async incidencia => {
      const { data: archivos, error: archivoError } = await supabase
        .from('archivo')
        .select('*')
        .eq('entidad_id', incidencia.id)
        .eq('entidad_tipo', 'Incidencia');

      if (archivoError) {
        console.error('Error al recuperar archivos para la incidencia:', archivoError);
        return { ...incidencia, archivos: [] };
      }

      return { ...incidencia, archivos };
    }));

    return incidenciasConArchivos;
  }

  // Método para obtener categorías padre
  async getCategoriasPadre() {
    const { data, error } = await supabase
      .from('categoriaincidencia')
      .select('*')
      .is('categoriapadre_id', null);

    if (error) throw new Error('Error al obtener categorías padre: ' + error.message);

    return data;
  }

  // Método para obtener categorías hijo
  async getCategoriasHijo(padreId) {
    const { data, error } = await supabase
      .from('categoriaincidencia')
      .select('*')
      .eq('categoriapadre_id', padreId);

    if (error) throw new Error('Error al obtener categorías hijo: ' + error.message);

    return data;
  }
}

module.exports = Incidencia;