const AuthModel = require('../models/authModel');
const authModel = new AuthModel();

exports.login = async (req, res) => {
    const { rut, contraseña } = req.body;
    const numericRut = rut.split('-')[0];

    if (!rut || !contraseña) {
        return res.status(400).send({ message: "RUT y contraseña son requeridos." });
    }

    try {
        const user = await authModel.findUserByRut(numericRut);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const isValidPassword = await authModel.comparePassword(contraseña, user.contraseña);
        if (!isValidPassword) {
            return res.status(403).send({ message: 'Contraseña incorrecta' });
        }

        const token = authModel.generateToken(user);
        res.status(200).send({ message: "Login exitoso", token });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
