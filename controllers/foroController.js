import PostForo from '../models/postForoModel.js';
import Reply from '../models/replyForoModel.js';
import ArchivoModel from '../models/archivoModel.js';

const postForo = new PostForo();
const reply = new Reply();
const archivoModel = new ArchivoModel();

// Crear un nuevo post
export const crearPost = async (req, res) => {
    try {
        const { autor_id, pregunta, contenido, es_anonimo } = req.body;
        const archivo = req.file;

        const { data: foroData, error: foroError } = await postForo.add({ autor_id, pregunta, contenido, es_anonimo });
        if (foroError || !foroData) {
            return res.status(400).send({ message: "Error al crear el post, no se recibieron datos." });
        }

        let archivoData = null;
        if (archivo) {
            archivoData = await archivoModel.agregarArchivo({
                entidad_tipo: 'PostForo',
                entidad_id: foroData[0].id,
                archivo,
            });
        }

        res.status(201).send({ message: "Post creado exitosamente", foro: foroData[0], archivo: archivoData });
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}


// Obtener todos los posts con detalles del autor
export const obtenerPosts = async (req, res) => {
    try {
        const { data, error } = await postForo.getAll();
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los posts: ' + error.message });
    }
};

// Crear una nueva respuesta
export const crearReply = async (req, res) => {
    try {
        const { postforo_id, autor_id, contenido } = req.body;
        const archivo = req.file;

        const { data: replyData, error: replyError } = await reply.add({ postforo_id, autor_id, contenido });

        if (replyError || !replyData) {
            return res.status(400).send({ message: "Error al crear la respuesta, no se recibieron datos." });
        }

        let archivoData = null;
        if (archivo) {
            archivoData = await archivoModel.agregarArchivo({
                entidad_tipo: 'Reply',
                entidad_id: replyData[0].id,
                archivo,
            });
        }

        res.status(201).send({ message: "Respuesta ingresada exitosamente", reply: replyData[0], archivo: archivoData });
    } catch (error) {
        console.error("Error interno del servidor:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
}

// Obtener todas las respuestas de un post
export const obtenerReplies = async (req, res) => {
    try {
        const { postId } = req.params;
        const { data, error } = await reply.getAllByPostId(postId);
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las respuestas: ' + error.message });
    }
};