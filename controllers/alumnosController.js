const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabaseClient');

exports.addAlumno = async (req, res) => {
    const {
        nivel, rut, nombre, apellido, email, contraseña, activo, celular,
        contactoemergencia, categoriaalumno_id, ciudadactual, ciudadprocedencia,
        suspensiónrangofecha, rol_id, carrera_id
    } = req.body;


    const saltRounds = 10;

    if (!contraseña) {
        return res.status(400).send({ error: "La contraseña no puede estar vacía." });
    }

    const carreraExists = await supabase
        .from('carrera')
        .select('*')
        .eq('id', carrera_id)
        .single();

    if (carreraExists.error || !carreraExists.data) {
        return res.status(404).send({ error: "La carrera especificada no existe." });
    }

    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        const result = await supabase
            .from('alumno')
            .insert([{
                nivel,
                rut,
                nombre,
                apellido,
                email,
                contraseña: hashedPassword,
                activo,
                celular,
                contactoemergencia,
                categoriaalumno_id,
                ciudadactual,
                ciudadprocedencia,
                suspensiónrangofecha,
                rol_id,
                carrera_id
            }]);

        if (result.error) {
            console.error('Error de Supabase al intentar insertar:', result.error);
            return res.status(400).send({ error: "Error al interactuar con Supabase", details: result.error.message || JSON.stringify(result.error) });
        }

        res.status(201).send({ message: "Alumno agregado exitosamente", data: result.data });
    } catch (err) {
        console.error('Error completo al agregar alumno:', err);
        res.status(500).send({
            error: "Error interno del servidor",
            message: err.message,
            details: err.stack
        });
    }
};


exports.getAllAlumnos = async (req, res) => {
    const { data, error } = await supabase.from('alumno').select('*');
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send(data);
};
