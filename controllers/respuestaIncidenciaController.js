const RespuestaIncidenciaModel = require('../models/respuestaIncidenciaModel');
const respuestaIncidenciaModel = new RespuestaIncidenciaModel();

exports.responderIncidencia = async (req, res) => {
  const { incidencia_id, personal_id, contenido } = req.body;

  try {
    const respuesta = await respuestaIncidenciaModel.addRespuesta({
      incidencia_id,
      personal_id,
      contenido
    });

    res.status(201).json({ message: "Respuesta agregada exitosamente", respuesta });
  } catch (error) {
    console.error("Error al responder la incidencia:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};
