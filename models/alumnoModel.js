const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabaseClient');

class Alumno {
  async add({ nivel, rut, nombre, apellido, email, contraseña, activo, celular, contactoemergencia, categoriaalumno_id, ciudadactual, ciudadprocedencia, suspensiónrangofecha, rol_id, carrera_id }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

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
    const { data, error } = await supabase
        .from('alumno')
        .select(`
            nombre,
            rut,
            email,
            carrera: carrera_id (
                nombre
            )
        `)
        .eq('id', alumnoId)
        .single(); 

    if (error) throw new Error('Error al obtener el alumno: ' + error.message);
    return data;
}

}

module.exports = Alumno;
