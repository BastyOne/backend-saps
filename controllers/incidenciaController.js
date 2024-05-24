import IncidenciaModel from '../models/incidenciaModel.js';
import ArchivoModel from '../models/archivoModel.js';

const incidenciaModel = new IncidenciaModel();
const archivoModel = new ArchivoModel();

export async function createIncidencia(req, res) {
    const { alumno_id, categoriaincidencia_id, descripcion, personal_id, prioridad, carrera_id } = req.body;
    const archivo = req.file;

    try {
        const incidenciaData = await incidenciaModel.add({
            alumno_id, categoriaincidencia_id, descripcion, personal_id, prioridad, carrera_id
        });

        if (!incidenciaData) {
            return res.status(400).send({ message: "Error al crear la incidencia, no se recibieron datos." });
        }

        let archivoData = null;
        if (archivo) {
            archivoData = await archivoModel.agregarArchivo({
                entidad_tipo: 'Incidencia',
                entidad_id: incidenciaData.id,
                archivo,
            });
        }

        res.status(201).send({ message: "Incidencia creada exitosamente", incidencia: incidenciaData, archivo: archivoData });
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

export async function getIncidenciasPorPersonal(req, res) {
    const { personalId } = req.params;

    try {
        const incidencias = await incidenciaModel.getByPersonalId(personalId);
        res.status(200).json(incidencias);
    } catch (error) {
        console.error("Error al obtener incidencias para el personal:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export async function getCategoriasPadre(req, res) {
    try {
        const categoriasPadre = await incidenciaModel.getCategoriasPadre();
        res.status(200).json(categoriasPadre);
    } catch (error) {
        console.error("Error al obtener categorías padre:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export async function getCategoriasHijo(req, res) {
    const { padreId } = req.params;

    try {
        const categoriasHijo = await incidenciaModel.getCategoriasHijo(padreId);
        res.status(200).json(categoriasHijo);
    } catch (error) {
        console.error("Error al obtener categorías hijo:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export async function getIncidenciasPorAlumno(req, res) {
    const { alumnoId } = req.params;

    try {
        const incidencias = await incidenciaModel.getByAlumnoId(alumnoId);
        res.status(200).json(incidencias);
    } catch (error) {
        console.error("Error al obtener incidencias para el alumno:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export async function cerrarIncidencia(req, res) {
    const { incidenciaId } = req.params;

    try {
        const incidenciaData = await incidenciaModel.cerrarIncidencia(incidenciaId);

        if (!incidenciaData) {
            return res.status(400).send({ message: "Error al cerrar la incidencia, no se encontraron datos." });
        }

        res.status(200).send({ message: "Incidencia cerrada exitosamente", incidencia: incidenciaData });
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

export async function reabrirIncidencia(req, res) {
    const { incidenciaId } = req.params;

    try {
        const incidenciaData = await incidenciaModel.reabrirIncidencia(incidenciaId);

        if (!incidenciaData) {
            return res.status(400).send({ message: "Error al reabrir la incidencia, no se encontraron datos." });
        }

        res.status(200).send({ message: "Incidencia reabierta exitosamente", incidencia: incidenciaData });
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

