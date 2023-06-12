// Importar los módulos necesarios
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './routes/router.js';
import session from 'express-session';
import { Pool } from 'mysql2';
import { pool1 } from './db.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { error } from 'console';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Importar el router de actualización genérico


const __dirname = dirname(fileURLToPath(import.meta.url));

// Crear variable para llamar express
const app = express();

// Configurar express-session
app.use(
  session({
    secret: 'secreto', // Puedes usar cualquier cadena de caracteres como secreto
    resave: false,
    saveUninitialized: true
  })
);

// Configurar body-parser para coger datos del body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar Router
app.use(indexRoutes);



// Configurar el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Configurar Public
app.use(express.static(join(__dirname, 'public')));

// verificación de sesión
const verificarSesion = (req, res, next) => {
  if (!req.session.usuario) {
    // El usuario no ha iniciado sesión, redirigirlo a la página de inicio de sesión
    return res.redirect('/login');
  }

  // El usuario ha iniciado sesión correctamente, continuar con la siguiente ruta
  next();
};

// Crear nuestras rutas para las diferentes páginas

// Ruta de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

// Ruta de dashboard que requiere verificación de sesión
app.get('/dashboard', verificarSesion, async (req, res) => {
  try {
    const administradores = await prisma.admin.findMany();
    const empleados = await prisma.empleados.findMany();

    res.render('dashboard', { administradores, empleados });
  } catch (error) {
    console.error('Error al obtener los administradores:', error);
    res.render('dashboard', { administradores: [], empleados:[] }); // Pasar un arreglo vacío si ocurre un error
  }
});

app.get('/updateEmpleados/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Realiza la lógica necesaria para obtener los detalles del resultado a editar
    const empleados = await prisma.empleados.findUnique({
      where: {
        id: id
      }
    });

    res.render('updateEmpleados', { empleados: empleados });
    

  } catch (error) {
    console.error('Error al obtener el resultado:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
}); 






// Resto de rutas sin verificación de sesión

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/gallery', (req, res) => {
  res.render('gallery');
});

app.get('/registro', (req, res) => {
  res.render('registro');
});

app.get('/empleados', (req, res) => {
  res.render('empleados');
});

app.get('/suscribirse', (req, res) => {
  res.render('suscribirse');
});

app.get('/restaurantes', (req, res) => {
  res.render('restaurantes');
});

app.get('/logout', (req, res) => {
  // Destruir la sesión
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/visita', (req, res) => {
  req.session.usuario = 'Jorge';
  req.session.rol = 'Administrador';
  req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
  res.send(
    `El usuario <Strong>${req.session.usuario}</Strong> con el privilegio de <Strong>${req.session.rol}</Strong> ha visitado la web <Strong>${req.session.visitas}</Strong>`
  );
});

// Crear el servidor
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`El servidor escucha en http://localhost:${port}`);
});
