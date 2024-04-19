const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabaseClient');

exports.login = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        let { data: user, error } = await supabase
            .from('personal')
            .select('*')
            .eq('email', email)
            .single();


        if (error && !user) {
            let response = await supabase
                .from('alumno')
                .select('*')
                .eq('email', email)
                .single();
            user = response.data;
            error = response.error;
        }


        if (error || !user) throw new Error('Usuario no encontrado');


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
