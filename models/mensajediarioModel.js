import { supabase } from '../config/supabaseClient.js';


class MensajeDiario {

    async getAllWithImages() {
        const { data: mensajes, error: mensajeError } = await supabase
            .from('mensajediario')
            .select('*')


        if (mensajeError) {
            throw new Error('Error al obtener los mensajes diarios: ' + mensajeError.message);
        }

        const mensajesConImagenes = await Promise.all(mensajes.map(async mensaje => {
            const { data: imagenes, error: imagenError } = await supabase
                .from('archivo')
                .select('archivo_url')
                .eq('entidad_id', mensaje.id)
                .eq('entidad_tipo', 'MensajeDiario');

            if (imagenError) {
                console.error('Error al recuperar imágenes para el mensaje diario:', imagenError);
            }

            return {
                ...mensaje,
                imagenes: imagenes.map(imagen => imagen.archivo_url)
            };
        }));

        return mensajesConImagenes;
    }

    async toggleActivo(mensajeId, activo) {
        const { data, error } = await supabase
            .from('mensajediario')
            .update({ activo })
            .eq('id', mensajeId)
            .select('*')
            .single();

        if (error) {
            throw new Error('Error al actualizar el estado del mensaje diario: ' + error.message);
        }

        return data;
    }

    async add({ mensaje, contexto }) {
        const { data, error } = await supabase
            .from('mensajediario')
            .insert([{
                mensaje,
                contexto,
                activo: true
            }])
            .select();

        if (error) throw new Error('Error al crear el mensaje diario: ' + error.message);
        if (!data || data.length === 0) throw new Error('No se recibieron datos de la inserción del mensaje diario');

        return data[0];
    }

    async remove(mensajeId) {
        const { data: imagenesData, error: imagenesError } = await supabase
            .from('archivo')
            .delete()
            .eq('entidad_id', mensajeId)
            .eq('entidad_tipo', 'MensajeDiario');

        if (imagenesError) {
            throw new Error('Error al eliminar las imágenes del mensaje diario: ' + imagenesError.message);
        }

        const { data: mensajeData, error: mensajeError } = await supabase
            .from('mensajediario')
            .delete()
            .eq('id', mensajeId)
            .single();

        if (mensajeError) {
            throw new Error('Error al eliminar el mensaje diario: ' + mensajeError.message);
        }

        return mensajeData;
    }
}

export default MensajeDiario;