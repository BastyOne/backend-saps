const express = require('express');
const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabaseClient');

const router = express.Router();

// Endpoint para añadir nuevo personal
router.post('/add', async (req, res) => {
    const { tipopersona_id, nombre, email, rol_id, contraseña } = req.body;
    const saltRounds = 10;

    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        // Insertar el nuevo personal en la base de datos
        const { data, error } = await supabase
            .from('personal')
            .insert([{
                tipopersona_id,
                nombre,
                email,
                rol_id,
                contraseña: hashedPassword  
            }]);

        if (error) throw error;

        res.status(201).send({ message: "Personal agregado exitosamente", data });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;

// Ruta para obtener todos los alumnos
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('personal')
        .select('*');

    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send(data);
});

module.exports = router;
