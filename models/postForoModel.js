import { supabase } from '../config/supabaseClient.js';

class PostForo {
    async add({ autor_id, pregunta, contenido, es_anonimo }) {
        const { data, error } = await supabase
            .from('postforo')
            .insert([{
                autor_id, pregunta, contenido, es_anonimo
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

        const postsConArchivos = await Promise.all(posts.map(async post => {
            if (!post.es_anonimo) {
                const { data: fotos, error: fotoError } = await supabase
                    .from('archivo')
                    .select('archivo_url')
                    .eq('entidad_id', post.autor_id)
                    .eq('entidad_tipo', 'Alumno');

                if (fotoError) {
                    console.error('Error al recuperar fotos para el alumno:', fotoError);
                    post.foto = null;
                } else {
                    post.foto = fotos.length > 0 ? fotos[0].archivo_url : null;
                }
            } else {
                post.foto = null;
                post.alumno = { nombre: "Anónimo", apellido: "", email: "" };
            }

            const { data: archivos, error: archivoError } = await supabase
                .from('archivo')
                .select('*')
                .eq('entidad_id', post.id)
                .eq('entidad_tipo', 'PostForo');

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
}

export default PostForo;
