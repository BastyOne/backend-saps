const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabaseClient');

exports.addPersonal = async (req, res) => {
    const { tipopersona_id, nombre, email, rol_id, contraseña, rut } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const { data, error } = await supabase
            .from('personal')
            .insert([{ tipopersona_id, nombre, email, rol_id, contraseña: hashedPassword, rut }]);

        if (error) throw error;
        res.status(201).send({ message: "Personal agregado exitosamente", data });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.getAllPersonal = async (req, res) => {
    const { data, error } = await supabase.from('personal').select('*');
    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send(data);
};
