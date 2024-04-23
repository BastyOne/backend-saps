const { supabase } = require('../config/supabaseClient');

class Archivo {
    async agregarArchivo({ entidad_tipo, entidad_id, archivo }) {
        if (!archivo || !archivo.originalname || !archivo.buffer) {
            throw new Error('Archivo no válido o faltan datos necesarios.');
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('archivos')
            .upload(`${entidad_tipo}/${entidad_id}/${archivo.originalname}`, archivo.buffer);

        if (uploadError) {
            throw new Error('Error al subir el archivo: ' + uploadError.message);
        }

        const archivoUrl = `https://[sxgobywsaifnczjstxqe].supabase.co/storage/v1/object/public/${uploadData.fullPath}`;

        const { data: archivoData, error: archivoInsertError } = await supabase
            .from('archivo')
            .insert([{
                entidad_tipo,
                entidad_id,
                archivo_url: archivoUrl,
                archivo_nombre: archivo.originalname,
            }])
            .select();

        if (archivoInsertError) {
            throw new Error('Error al insertar datos del archivo: ' + archivoInsertError.message);
        }

        if (!archivoData || archivoData.length === 0) {
            throw new Error('No se recibieron datos de la inserción de datos del archivo.');
        }

        return archivoData[0];
    }
}

module.exports = Archivo;
