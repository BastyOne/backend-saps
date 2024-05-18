const IncidenciaModel = require('../models/incidenciaModel');
const ArchivoModel = require('../models/archivoModel');
const upload = require('../middleware/uploadMiddleware');

const incidenciaModel = new IncidenciaModel();
const archivoModel = new ArchivoModel();

exports.createIncidencia = async (req, res) => {
    const { alumno_id, categoriaincidencia_id, descripcion, personal_id, prioridad } = req.body;
    const archivo = req.file;

    try {
        const incidenciaData = await incidenciaModel.add({
            alumno_id, categoriaincidencia_id, descripcion, personal_id, prioridad
        });

        // Asegúrate de que incidenciaData existe antes de proceder
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
};

exports.getIncidenciasPorPersonal = async (req, res) => {
    const { personalId } = req.params;

    try {
        const incidencias = await incidenciaModel.getByPersonalId(personalId);
        res.status(200).json(incidencias);
    } catch (error) {
        console.error("Error al obtener incidencias para el personal:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Función para obtener categorías padre
exports.getCategoriasPadre = async (req, res) => {
    try {
        const categoriasPadre = await incidenciaModel.getCategoriasPadre();
        res.status(200).json(categoriasPadre);
    } catch (error) {
        console.error("Error al obtener categorías padre:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Función para obtener categorías hijo
exports.getCategoriasHijo = async (req, res) => {
    const { padreId } = req.params;

    try {
        const categoriasHijo = await incidenciaModel.getCategoriasHijo(padreId);
        res.status(200).json(categoriasHijo);
    } catch (error) {
        console.error("Error al obtener categorías hijo:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

