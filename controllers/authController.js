const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabaseClient');

exports.login = async (req, res) => {
    const { rut, contraseña } = req.body;
    const numericRut = rut.split('-')[0];

    if (!rut || !contraseña) {
        return res.status(400).send({ message: "RUT y contraseña son requeridos." });
    }

    try {
        let user = null;

        const tables = ['personal', 'alumno'];
        for (const table of tables) {
            if (!user) {  
                let response = await supabase
                    .from(table)
                    .select('*')
                    .ilike('rut', `${numericRut}-%`)
                    .single();

                if (response.data) {
                    user = response.data;
                    break;  
                }
            }
        }

        if (!user) throw new Error('Usuario no encontrado');  

       
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) throw new Error('Contraseña incorrecta');

       
        const token = jwt.sign(
            { userId: user.id, email: user.email, rol: user.rol_id, userType: user.tipopersona_id ? 'personal' : 'alumno' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).send({ message: "Login exitoso", token });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};
