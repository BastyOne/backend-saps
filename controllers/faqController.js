import FAQModel from '../models/faqModel.js';
const faqModel = new FAQModel();

export async function getFAQs(req, res) {
    const { data, error } = await faqModel.getAll();
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send(data);
}

export async function getFAQsByCategory(req, res) {
    const { categoria } = req.params;
    const { data, error } = await faqModel.getByCategory(categoria);
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send(data);
}

export async function addFAQ(req, res) {
    const { data, error } = await faqModel.add(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    res.status(201).send({ message: "FAQ agregada exitosamente", data });
}

export async function updateFAQ(req, res) {
    const { id } = req.params;
    const { data, error } = await faqModel.update(id, req.body);
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send({ message: "FAQ actualizada exitosamente", data });
}

export async function deleteFAQ(req, res) {
    const { id } = req.params;
    const { data, error } = await faqModel.delete(id);
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send({ message: "FAQ eliminada exitosamente", data });
}
