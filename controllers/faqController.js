const FAQModel = require('../models/faqModel');
const faqModel = new FAQModel();

exports.getFAQs = async (req, res) => {
    const { data, error } = await faqModel.getAll();
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send(data);
};

exports.getFAQsByCategory = async (req, res) => {
    const { categoria } = req.params; 
        const { data, error } = await faqModel.getByCategory(categoria);
        if (error) {
            return res.status(400).send(error);
        }
        res.status(200).send(data);
};

exports.addFAQ = async (req, res) => {
    const { data, error } = await faqModel.add(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    res.status(201).send({ message: "FAQ agregada exitosamente", data });
};

exports.updateFAQ = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await faqModel.update(id, req.body);
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send({ message: "FAQ actualizada exitosamente", data });
};

exports.deleteFAQ = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await faqModel.delete(id);
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send({ message: "FAQ eliminada exitosamente", data });
};
