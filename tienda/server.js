const express = require('express'); //servidor web
const jsonServer = require('json-server');
const multer = require('multer'); //middleware para subir archivos
const path = require('path'); //para obtener la ruta de los archivos
const fs = require('fs'); //para crear y eliminar archivos
const morgan = require('morgan'); //middleware para registrar las peticiones en el servidor
const cors = require('cors'); //middleware para permitir las peticiones desde otros dominios

//crear el servidor
const app = express();

//ponemos ruta de los archivos
const router = jsonServer.router('./src/bbdd/datos.json');

//ruta de subir archivos
const upload = multer({ dest: 'public/img/' });

//configuracion de CORS
app.use(cors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type',
}));

//configuracion
app.use(morgan('dev'));
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Metodo post para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }
    
    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = `public/img/${filename}`;
    
    fs.renameSync(req.file.path, filepath);
    
    res.json({ message: 'Imagen subida exitosamente', filename: `${filename}` });
});


// Metodo delete para eliminar imágenes
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = `public/img/${filename}`;      

    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'No se encontró la imagen' });
        }

        fs.unlink(filepath, (err) => {
            if(err) {
                return res.status(500).json({ error: 'Error al eliminar la imagen' });
            }
            res.json({ message: 'Imagen eliminada exitosamente' });
        });
        
    });
});

// Usar JSON Server como API REST
app.use(router);

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
