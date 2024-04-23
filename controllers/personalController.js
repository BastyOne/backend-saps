const PersonalModel = require('../models/personalModel');
const personalModel = new PersonalModel();

exports.addPersonal = async (req, res) => {
    try {
        const { data, error } = await personalModel.add(req.body);

        if (error) {
            throw error;
        }

        res.status(201).send({ message: "Personal agregado exitosamente", data });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.getAllPersonal = async (req, res) => {
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
};

exports.getPersonalById = async (req, res) => {
    const { personalId } = req.params;

    try {
        const personal = await personalModel.getById(personalId);
        res.status(200).json(personal);
    } catch (error) {
        console.error("Error al obtener información del personal:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
