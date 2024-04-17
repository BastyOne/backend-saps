// routes/alumnosRoutes.js
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');

// Ruta para obtener todos los alumnos
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('alumno')
        .select('*');

    if (error) {
        return res.status(400).send(error);
    }
    res.status(200).send(data);
});

module.exports = router;