import { supabase } from '../config/supabaseClient.js';

class Reunion {
    async agregarReunion({ fecha, hora, lugar, tema, incidencia_id }) {
        const { data, error } = await supabase
            .from('reunion')
            .insert([{
                fecha,
                hora,
                lugar,
                tema,
                incidencia_id
            }])
            .select();

        if (error) {
            throw new Error('Error al programar la reunión: ' + error.message);
        }

        return data[0];
    }
}

export default Reunion;
