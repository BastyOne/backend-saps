import { supabase } from '../config/supabaseClient.js';

class Incidencia {
  async add({ alumno_id, categoriaincidencia_id, descripcion, personal_id, prioridad, carrera_id }) {
    const { data, error } = await supabase
      .from('incidencia')
      .insert([{
        alumno_id,
        categoriaincidencia_id,
        descripcion,
        personal_id,
        carrera_id,
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
      .select(`
        *,
        alumno:alumno_id(id, nombre, apellido, rut, email, carrera: carrera_id (nombre)),
        reunion(*),
        respuestaincidencia(*)
      `)
      .eq('personal_id', personalId);

    if (incidenciaError) {
      throw new Error('Error al obtener incidencias: ' + incidenciaError.message);
    }

    // Para cada incidencia, consulta los archivos asociados.
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

  async getByAlumnoId(alumnoId) {
    const { data: incidencias, error: incidenciaError } = await supabase
      .from('incidencia')
      .select(`
        *,
        reunion(*),
        respuestaincidencia(*)
      `)
      .eq('alumno_id', alumnoId);

    if (incidenciaError) {
      throw new Error('Error al obtener incidencias: ' + incidenciaError.message);
    }

    return incidencias;
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

  async cerrarIncidencia(incidenciaId) {
    const { data, error } = await supabase
      .from('incidencia')
      .update({ estado: 'cerrada', fechahoracierre: new Date() })
      .eq('id', incidenciaId)
      .select();

    if (error) throw new Error('Error al cerrar la incidencia: ' + error.message);
    if (!data || data.length === 0) throw new Error('No se encontró la incidencia para cerrar');

    return data[0];
  }

  async reabrirIncidencia(incidenciaId) {
    const { data, error } = await supabase
      .from('incidencia')
      .update({ estado: 'pendiente', fechahoracierre: null, reabierta: true })
      .eq('id', incidenciaId)
      .select();

    if (error) throw new Error('Error al reabrir la incidencia: ' + error.message);
    if (!data || data.length === 0) throw new Error('No se encontró la incidencia para reabrir');

    return data[0];
  }
}

export default Incidencia;
