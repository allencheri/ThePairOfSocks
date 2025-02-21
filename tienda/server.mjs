import express from 'express';
import jsonServer from 'json-server';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const router = jsonServer.router('db.json');
const upload = multer({ dest: 'public/img/' }); // Directorio de imágenes

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static('public'));

// Middleware para cargar imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    const filename = req.file.filename + path.extname(req.file.originalname);
    fs.renameSync(req.file.path, `public/img/${filename}`);
    res.json({ message: 'Imagen cargada exitosamente', filename: `/img/${filename}` });
});

// Usar el router de json-server
app.use(router);

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
