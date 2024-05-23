const { supabase } = require('../config/supabaseClient');

class Archivo {
    async agregarArchivo({ entidad_tipo, entidad_id, archivo }) {
        if (!archivo || !archivo.originalname || !archivo.buffer) {
            throw new Error('Archivo no válido o faltan datos necesarios.');
        }

        // Reemplazar espacios en el nombre del archivo
        const safeFileName = archivo.originalname.replace(/\s/g, '_');

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('archivos')
            .upload(`${entidad_tipo}/${entidad_id}/${safeFileName}`, archivo.buffer);

        if (uploadError) {
            throw new Error('Error al subir el archivo: ' + uploadError.message);
        }

        // Verificar si la subida fue exitosa
        if (!uploadData) {
            throw new Error('Error: no se recibieron datos después de la subida del archivo.');
        }

        // Generar URL firmada para el archivo subido
        const filePath = `${entidad_tipo}/${entidad_id}/${safeFileName}`;
        const { data: signedURLData, error: signedUrlError } = await supabase.storage
            .from('archivos')
            .createSignedUrl(filePath, 60 * 60); // URL válida por 1 hora

        if (signedUrlError) {
            throw new Error('Error al generar URL firmada: ' + signedUrlError.message);
        }

        if (!signedURLData || !signedURLData.signedUrl) {
            throw new Error('Error: no se recibió una URL firmada.');
        }

        const archivoUrl = signedURLData.signedUrl;

        const { data: archivoData, error: archivoInsertError } = await supabase
            .from('archivo')
            .insert([{
                entidad_tipo,
                entidad_id,
                archivo_url: archivoUrl,
                archivo_nombre: safeFileName,
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
