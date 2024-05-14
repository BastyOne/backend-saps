const MensajeDiario = require('../models/mensajediarioModel');
const mensajeDiario = new MensajeDiario();

exports.getMensajesConImagenes = async (req, res) => {
    try {
        const mensajesConImagenes = await mensajeDiario.getAllWithImages();
        res.json(mensajesConImagenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleActivo = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const updatedMensaje = await mensajeDiario.toggleActivo(id, activo);
        res.json(updatedMensaje);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
