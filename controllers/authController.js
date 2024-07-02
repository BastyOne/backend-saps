import AuthModel from '../models/authModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const authModel = new AuthModel();

export async function login(req, res) {
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
        res.status(200).send({
            message: "Login exitoso",
            token,
            userId: user.id,
            userType: user.tipopersona_id ? 'personal' : 'alumno',
            rol: user.rol_id,
            carrera_id: user.carrera_id
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

export async function forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ message: "Email es requerido." });
    }

    try {
        console.log(`Buscando usuario con email: ${email}`);
        const user = await authModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        console.log(`Generando token de restablecimiento de contraseña para: ${email}`);
        const token = await authModel.generatePasswordResetToken(email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: `Has solicitado un restablecimiento de contraseña. Utiliza el siguiente código para restablecer tu contraseña: ${token}`,
        };

        console.log(`Enviando email a: ${email}`);
        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'Token de restablecimiento de contraseña enviado al correo' });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

export async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).send({ message: "Token y nueva contraseña son requeridos." });
    }

    try {
        console.log(`Restableciendo contraseña con token: ${token}`);
        await authModel.resetPassword(token, newPassword);
        res.status(200).send({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

export async function updatePassword(req, res) {
    const { rut, currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!rut || !currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).send({ message: "Todos los campos son requeridos." });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).send({ message: "Las nuevas contraseñas no coinciden." });
    }

    try {
        const numericRut = rut.split('-')[0];
        await authModel.updatePassword(numericRut, currentPassword, newPassword);
        res.status(200).send({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        if (error.message === 'Contraseña actual incorrecta') {
            return res.status(403).send({ message: 'Contraseña actual incorrecta' });
        }
        console.error("Error en el servidor:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}

