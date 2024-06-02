import { supabase } from '../config/supabaseClient.js';

class PostForo {
    async add({ autor_id, pregunta, contenido }) {
        const { data, error } = await supabase
            .from('postforo')
            .insert([{
                autor_id, pregunta, contenido
            }])
            .select('*');
        return { data, error };
    }

    async getAll() {
        const { data: posts, error: postError } = await supabase
            .from('postforo')
            .select(`
                *,
                alumno:autor_id (
                    nombre,
                    apellido,
                    email
                )
            `)
            .order('fechacreacion', { ascending: false });

        if (postError) {
            throw new Error('Error al obtener los posts: ' + postError.message);
        }

        // Obtener las imágenes de los autores y los archivos adjuntos
        const postsConArchivos = await Promise.all(posts.map(async post => {
            const { data: fotos, error: fotoError } = await supabase
                .from('archivo')
                .select('archivo_url')
                .eq('entidad_id', post.autor_id)
                .eq('entidad_tipo', 'Alumno');

            const { data: archivos, error: archivoError } = await supabase
                .from('archivo')
                .select('*')
                .eq('entidad_id', post.id)
                .eq('entidad_tipo', 'PostForo');

            if (fotoError) {
                console.error('Error al recuperar fotos para el alumno:', fotoError);
                post.foto = null;
            } else {
                post.foto = fotos.length > 0 ? fotos[0].archivo_url : null;
            }

            if (archivoError) {
                console.error('Error al recuperar archivos para el post:', archivoError);
                post.archivos = [];
            } else {
                post.archivos = archivos;
            }

            return post;
        }));

        return { data: postsConArchivos, error: null };
    }

    async getById(postId) {
        const { data: post, error: postError } = await supabase
            .from('postforo')
            .select(`
                *,
                alumno:autor_id (
                    nombre,
                    apellido,
                    email
                )
            `)
            .eq('id', postId)
            .single();

        if (postError) {
            throw new Error('Error al obtener el post: ' + postError.message);
        }

        // Obtener la imagen del autor y los archivos adjuntos
        const { data: fotos, error: fotoError } = await supabase
            .from('archivo')
            .select('archivo_url')
            .eq('entidad_id', post.autor_id)
            .eq('entidad_tipo', 'Alumno');

        const { data: archivos, error: archivoError } = await supabase
            .from('archivo')
            .select('*')
            .eq('entidad_id', post.id)
            .eq('entidad_tipo', 'PostForo');

        if (fotoError) {
            console.error('Error al recuperar fotos para el alumno:', fotoError);
            post.foto = null;
        } else {
            post.foto = fotos.length > 0 ? fotos[0].archivo_url : null;
        }

        if (archivoError) {
            console.error('Error al recuperar archivos para el post:', archivoError);
            post.archivos = [];
        } else {
            post.archivos = archivos;
        }

        return { data: post, error: null };
    }
}

export default PostForo;
