require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Manejo de la ruta raíz
app.get('/', (req, res) => {
  res.send('Backend S.A.P.S está funcionando correctamente.');
});

const alumnosRoutes = require('./routes/alumnosRoutes');
const personalRoutes = require('./routes/personalRoutes');
const authRoutes = require('./routes/authRoutes');  

app.use('/alumnos', alumnosRoutes);
app.use('/personal', personalRoutes);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
