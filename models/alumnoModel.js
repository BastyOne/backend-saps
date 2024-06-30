import { hash } from 'bcrypt';
import { supabase } from '../config/supabaseClient.js';

class Alumno {
  async add({ nivel, rut, nombre, apellido, email, contraseña, activo, celular, contactoemergencia, categoriaalumno_id, ciudadactual, ciudadprocedencia, suspensiónrangofecha, rol_id, carrera_id }) {
    const saltRounds = 10;
    const hashedPassword = await hash(contraseña, saltRounds);

    const { data, error } = await supabase
      .from('alumno')
      .insert([{
        nivel, rut, nombre, apellido, email, contraseña: hashedPassword, activo, celular, contactoemergencia, categoriaalumno_id, ciudadactual, ciudadprocedencia, suspensiónrangofecha, rol_id, carrera_id
      }]);
    return { data, error };
  }

  async getAll({ carrera_id, nivel } = {}) {
    let query = supabase
      .from('alumno')
      .select(`
        *,
        carrera: carrera_id (nombre)
      `);

    if (carrera_id) {
      query = query.eq('carrera_id', carrera_id);
    }

    if (nivel) {
      query = query.eq('nivel', nivel);
    }

    const { data, error } = await query;
    return { data, error };
  }


  async getById(alumnoId) {
    const { data: alumno, error: alumnoError } = await supabase
      .from('alumno')
      .select(`
        nombre,
        apellido,
        rut,
        email,
        carrera: carrera_id (nombre)
      `)
      .eq('id', alumnoId)
      .single();

    if (alumnoError) {
      throw new Error('Error al obtener el alumno: ' + alumnoError.message);
    }

    if (alumno) {
      const { data: fotos, error: fotoError } = await supabase
        .from('archivo')
        .select('archivo_url')
        .eq('entidad_id', alumnoId)
        .eq('entidad_tipo', 'Alumno');

      if (fotoError) {
        console.error('Error al recuperar fotos para el alumno:', fotoError);
        return { ...alumno, foto: null };
      }

      return { ...alumno, foto: fotos.length > 0 ? fotos[0].archivo_url : null };
    }

    return null;
  }

  async update(alumnoId, { celular, contactoemergencia, ciudadactual }) {
    const { data, error } = await supabase
      .from('alumno')
      .update({ celular, contactoemergencia, ciudadactual })
      .eq('id', alumnoId)
      .select();

    if (error) throw new Error('Error al actualizar alumno: ' + error.message);
    if (!data || data.length === 0) throw new Error('Alumno no encontrado o no se realizaron cambios');

    return data[0];
  }
}

export default Alumno;
