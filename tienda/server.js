const express = require('express');
const jsonServer = require('json-server');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');


const app = express();
const router = jsonServer.router('./src/bbdd/datos.json');
const upload = multer({ dest: 'public/img/' });

app.use(cors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type',
}));
// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }
    
    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = `public/img/${filename}`;
    
    fs.renameSync(req.file.path, filepath);
    
    res.json({ message: 'Imagen subida exitosamente', filename: `${filename}` });
});

app.delete('/upload/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = `public/img/${filename}`;      

    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'No se encontró la imagen' });
        }

        fs.unlinkSync(filepath);
        res.json({ message: 'Imagen eliminada exitosamente' });
    });
});

// Usar JSON Server como API REST
app.use(router);

// Iniciar el servidor
app.listen(5000, () => {
    console.log('✅ Servidor corriendo en http://localhost:5000');
});
