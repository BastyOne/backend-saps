import ReunionModel from '../models/reunionModel.js';
const reunionModel = new ReunionModel();

export async function programarReunion(req, res) {
    const { fecha, hora, lugar, tema, incidencia_id } = req.body;

    try {
        const reunion = await reunionModel.agregarReunion({
            fecha,
            hora,
            lugar,
            tema,
            incidencia_id
        });

        res.status(201).json({ message: "Reunión programada exitosamente", reunion });
    } catch (error) {
        console.error("Error al programar la reunión:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export async function obtenerReuniones(req, res) {
    const { personal_id } = req.params;

    try {
        const reuniones = await reunionModel.getReunionesByPersonalId(personal_id);
        res.status(200).json(reuniones);
    } catch (error) {
        console.error('Error al obtener reuniones:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}
