const AlumnoModel = require('../models/alumnoModel');
const alumnoModel = new AlumnoModel();

exports.addAlumno = async (req, res) => {
    try {
        const { data, error } = await alumnoModel.add(req.body);

        if (error) {
            console.error('Error de Supabase al intentar insertar:', error);
            return res.status(400).send({ error: "Error al interactuar con Supabase", details: error.message || JSON.stringify(error) });
        }

        res.status(201).send({ message: "Alumno agregado exitosamente", data });
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
    try {
        const { data, error } = await alumnoModel.getAll();

        if (error) {
            return res.status(400).send(error);
        }
        
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({
            error: "Error interno del servidor",
            message: err.message,
            details: err.stack
        });
    }
};

exports.getAlumnoById = async (req, res) => {
    const { alumnoId } = req.params;

    try {
        const alumno = await alumnoModel.getById(alumnoId);
        res.status(200).json(alumno);
    } catch (error) {
        console.error("Error al obtener información del alumno:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

