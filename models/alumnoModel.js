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

  async getAll() {
    const { data, error } = await supabase
      .from('alumno')
      .select('*');
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
}

export default Alumno;
