import AlumnoModel from '../models/alumnoModel.js';
import ArchivoModel from '../models/archivoModel.js';

const alumnoModel = new AlumnoModel();

export const addAlumno = async (req, res) => {
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


export const getAllAlumnos = async (req, res) => {
    const { carrera_id, nivel } = req.query;

    try {
        const { data, error } = await alumnoModel.getAll({ carrera_id, nivel });

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

export const getAlumnoById = async (req, res) => {
    const { alumnoId } = req.params;

    try {
        const alumno = await alumnoModel.getById(alumnoId);
        if (!alumno) {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }
        res.status(200).json(alumno);
    } catch (error) {
        console.error("Error al obtener información del alumno:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export const updateAlumno = async (req, res) => {
    const { alumnoId } = req.params;
    const { celular, contactoemergencia, ciudadactual } = req.body;

    try {
        const updatedAlumno = await alumnoModel.update(alumnoId, { celular, contactoemergencia, ciudadactual });

        res.status(200).send({ message: "Datos actualizados exitosamente", alumno: updatedAlumno });
    } catch (err) {
        console.error('Error al actualizar alumno:', err);
        if (err.message.includes('Alumno no encontrado o no se realizaron cambios')) {
            res.status(404).send({ message: err.message });
        } else {
            res.status(500).send({
                error: "Error interno del servidor",
                message: err.message,
                details: err.stack
            });
        }
    }
};
