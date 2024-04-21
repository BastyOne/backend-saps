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
    const { data, error } = await supabase.from('alumno').select('*');
    return { data, error };
  }
}

module.exports = Alumno;
