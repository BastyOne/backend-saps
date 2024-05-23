import PersonalModel from '../models/personalModel.js';
const personalModel = new PersonalModel();

export async function addPersonal(req, res) {
    try {
        const { data, error } = await personalModel.add(req.body);

        if (error) {
            throw error;
        }

        res.status(201).send({ message: "Personal agregado exitosamente", data });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

export async function getAllPersonal(req, res) {
    try {
        const { data, error } = await personalModel.getAll();

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
}

export async function getPersonalById(req, res) {
    const { personalId } = req.params;

    try {
        const personal = await personalModel.getById(personalId);
        if (!personal) {
            return res.status(404).json({ message: "Personal no encontrado" });
        }
        res.status(200).json(personal);
    } catch (error) {
        console.error("Error al obtener información del personal:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}
