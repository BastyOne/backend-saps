require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Manejo de la ruta raíz
app.get('/', (req, res) => {
  res.send('Backend S.A.P.S está funcionando correctamente.');
});

const alumnosRoutes = require('./routes/alumnosRoutes');
const personalRoutes = require('./routes/personalRoutes');
const authRoutes = require('./routes/authRoutes');
const faqRoutes = require('./routes/faqRoutes');

app.use('/alumnos', alumnosRoutes);
app.use('/personal', personalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/faq', faqRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
