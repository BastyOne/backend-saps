const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabaseClient');

class AuthModel {
    async findUserByRut(rut) {
        let user = null;
        const tables = ['personal', 'alumno'];
        for (const table of tables) {
            let response = await supabase
                .from(table)
                .select('*')
                .ilike('rut', `${rut}-%`)
                .maybeSingle();

            if (response.data) {
                user = response.data;
                break;
            }

            if (response.error && response.error.code !== 'PGRST116') {
                console.error('Error fetching user:', response.error);
                throw response.error;
            }
        }
        return user;
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    generateToken(user) {
        const userType = user.tipopersona_id ? 'personal' : 'alumno';
        return jwt.sign(
            { userId: user.id, email: user.email, rol: user.rol_id, userType: userType, carrera_id: user.carrera_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }
}

module.exports = AuthModel;
