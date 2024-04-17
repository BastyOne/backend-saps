const express = require('express');
const app = express();

app.use(express.json());

const alumnosRoutes = require('./routes/alumnosRoutes');
app.use('/alumnos', alumnosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});