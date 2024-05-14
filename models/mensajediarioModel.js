const { supabase } = require('../config/supabaseClient');

class MensajeDiario {
    async getAllWithImages() {
        const { data: mensajes, error: mensajeError } = await supabase
            .from('mensajediario')
            .select('*')
            .eq('activo', true);

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
}

module.exports = MensajeDiario;
