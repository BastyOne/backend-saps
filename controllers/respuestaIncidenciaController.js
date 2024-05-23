import RespuestaIncidenciaModel from '../models/respuestaIncidenciaModel.js';
const respuestaIncidenciaModel = new RespuestaIncidenciaModel();

export async function responderIncidencia(req, res) {
  const { incidencia_id, remitente_id, remitente_tipo, contenido } = req.body;

  try {
    const respuesta = await respuestaIncidenciaModel.addRespuesta({
      incidencia_id,
      remitente_id,
      remitente_tipo,
      contenido
    });

    res.status(201).json({ message: "Respuesta agregada exitosamente", respuesta });
  } catch (error) {
    console.error("Error al responder la incidencia:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
}

export async function getRespuestasPorIncidencia(req, res) {
  const { incidenciaId } = req.params;

  try {
    const respuestas = await respuestaIncidenciaModel.getRespuestasPorIncidenciaId(incidenciaId);
    res.status(200).json(respuestas);
  } catch (error) {
    console.error("Error al obtener respuestas de la incidencia:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
}
