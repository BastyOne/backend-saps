import { supabase } from '../config/supabaseClient.js';

class Reply {
    async add({ postforo_id, autor_id, contenido }) {
        const { data, error } = await supabase
            .from('reply')
            .insert([{
                postforo_id, autor_id, contenido
            }])
            .select('*');
        return { data, error };
    }

    async getAllByPostId(postId) {
        const { data: replies, error: replyError } = await supabase
            .from('reply')
            .select(`
                *,
                alumno:autor_id (
                    nombre,
                    apellido,
                    email
                )
            `)
            .eq('postforo_id', postId)
            .order('fechacreacion', { ascending: true });

        if (replyError) {
            throw new Error('Error al obtener las respuestas: ' + replyError.message);
        }

        // Obtener las imágenes de los autores y los archivos adjuntos
        const repliesConArchivos = await Promise.all(replies.map(async reply => {
            const { data: fotos, error: fotoError } = await supabase
                .from('archivo')
                .select('archivo_url')
                .eq('entidad_id', reply.autor_id)
                .eq('entidad_tipo', 'Alumno');

            const { data: archivos, error: archivoError } = await supabase
                .from('archivo')
                .select('*')
                .eq('entidad_id', reply.id)
                .eq('entidad_tipo', 'Reply');

            if (fotoError) {
                console.error('Error al recuperar fotos para el alumno:', fotoError);
                reply.foto = null;
            } else {
                reply.foto = fotos.length > 0 ? fotos[0].archivo_url : null;
            }

            if (archivoError) {
                console.error('Error al recuperar archivos para la respuesta:', archivoError);
                reply.archivos = [];
            } else {
                reply.archivos = archivos;
            }

            return reply;
        }));

        return { data: repliesConArchivos, error: null };
    }
}

export default Reply;
