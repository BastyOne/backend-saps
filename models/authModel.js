import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';
import crypto from 'crypto';

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

    generateShortToken(length = 5) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    async generatePasswordResetToken(email) {
        try {
            const token = this.generateShortToken(5); // Genera un token de 5 caracteres
            const hashedToken = await bcrypt.hash(token, 10); // Hashea el token

            const { data, error } = await supabase
                .from('passwordresets')
                .insert({ email, token: hashedToken });

            if (error) {
                console.error("Error insertando token de restablecimiento de contraseña:", error);
                throw error;
            }

            return token;
        } catch (error) {
            console.error("Error generando token de restablecimiento de contraseña:", error);
            throw error;
        }
    }

    async findUserByEmail(email) {
        const tables = ['personal', 'alumno'];
        for (const table of tables) {
            let response;
            try {
                response = await supabase
                    .from(table)
                    .select('*')
                    .eq('email', email)
                    .maybeSingle();
            } catch (error) {
                console.error(`Error buscando usuario en tabla ${table}:`, error);
                throw error;
            }

            if (response.data) return response.data;
            if (response.error && response.error.code !== 'PGRST116') throw response.error;
        }
        return null;
    }

    async resetPassword(token, newPassword) {
        try {
            // Buscar el registro del token en la tabla PasswordResets
            const { data: resetData, error: resetError } = await supabase
                .from('passwordresets')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1);

            if (resetError || !resetData) throw new Error('Invalid or expired token');

            const resetEntry = resetData[0];
            // Verificar si el token coincide con el token hasheado en la base de datos
            const isTokenValid = await bcrypt.compare(token, resetEntry.token);
            if (!isTokenValid) throw new Error('Invalid or expired token');

            // Buscar el usuario por email
            const user = await this.findUserByEmail(resetEntry.email);
            if (!user) throw new Error('User not found');

            // Hashear la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const userType = user.tipopersona_id ? 'personal' : 'alumno';

            // Actualizar la contraseña del usuario
            const { data, error } = await supabase
                .from(userType)
                .update({ contraseña: hashedPassword })
                .eq('email', user.email);

            if (error) throw error;

            // Eliminar el token de la tabla PasswordResets
            await supabase
                .from('passwordresets')
                .delete()
                .eq('id', resetEntry.id);

            return data;
        } catch (error) {
            console.error("Error restableciendo contraseña:", error);
            throw error;
        }
    }

    async updatePassword(rut, currentPassword, newPassword) {
        const user = await this.findUserByRut(rut);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isValidPassword = await this.comparePassword(currentPassword, user.contraseña);
        if (!isValidPassword) {
            throw new Error('Contraseña actual incorrecta');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const userType = user.tipopersona_id ? 'personal' : 'alumno';

        const { data, error } = await supabase
            .from(userType)
            .update({ contraseña: hashedNewPassword })
            .eq('rut', user.rut);

        if (error) {
            throw new Error('Error actualizando la contraseña');
        }

        return data;
    }
}

export default AuthModel;
