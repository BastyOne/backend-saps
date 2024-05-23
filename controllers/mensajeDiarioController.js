import MensajeDiario from '../models/mensajediarioModel.js'; // Import the model
const mensajeDiario = new MensajeDiario();

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
