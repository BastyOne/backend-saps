import MensajeDiario from '../models/mensajediarioModel.js'; // Import the model
import ArchivoModel from '../models/archivoModel.js'; // Import the model
const mensajeDiario = new MensajeDiario();
const archivoModel = new ArchivoModel();

export async function getMensajesConImagenes(req, res) {
    try {
        const mensajesConImagenes = await mensajeDiario.getAllWithImages();
        res.json(mensajesConImagenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function toggleActivo(req, res) {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const updatedMensaje = await mensajeDiario.toggleActivo(id, activo);
        res.json(updatedMensaje);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function addMensajeDiario(req, res) {
    const { mensaje, contexto } = req.body;
    const archivo = req.file;

    try {
        const mensajeData = await mensajeDiario.add({
            mensaje, contexto
        });

        if (!mensajeData) {
            return res.status(400).send({ message: "Error al crear el mensaje diario, no se recibieron datos." });
        }

        let archivoData = null;
        if (archivo) {
            archivoData = await archivoModel.agregarArchivo({
                entidad_tipo: 'MensajeDiario',
                entidad_id: mensajeData.id,
                archivo,
            });
        }

        res.status(201).send({ message: "Mensaje diario creado exitosamente", mensaje: mensajeData, archivo: archivoData });
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

export async function removeMensajeDiario(req, res) {
    const { id } = req.params;

    try {
        const mensajeEliminado = await mensajeDiario.remove(id);
        res.json(mensajeEliminado);
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).json({ error: error.message });
    }
}