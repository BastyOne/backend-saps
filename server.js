import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// Manejo de la ruta raíz
app.get('/', (req, res) => {
  res.send('Backend S.A.P.S está funcionando correctamente.');
});

import alumnosRoutes from './routes/alumnosRoutes.js';
import personalRoutes from './routes/personalRoutes.js';
import authRoutes from './routes/authRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import incidenciaRoutes from './routes/incidenciaRoutes.js';
import reunionRoutes from './routes/reunionRoutes.js';
import mensajeDiarioRoutes from './routes/mensajeDiarioRoutes.js';
import foroRoutes from './routes/foroRoutes.js';

app.use('/alumnos', alumnosRoutes);
app.use('/personal', personalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/incidencia', incidenciaRoutes);
app.use('/api/reunion', reunionRoutes);
app.use('/api', mensajeDiarioRoutes);
app.use('/api/foro', foroRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://192.168.100.81:${PORT}`);
});
