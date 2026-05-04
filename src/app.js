import 'dotenv/config';
import express from 'express';
import { join } from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import indexRoutes from './routes/router.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configuraciones y Motor de Plantillas
app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), 'src/views')); // process.cwd() es más limpio que __dirname

// 2. Middlewares base
app.use(express.static(join(process.cwd(), 'src/public')));
// Esto hace que si el HTML busca "logo.png", Express lo busque dentro de "public/img" automáticamente
app.use(express.static(join(process.cwd(), 'src/public/css')));
app.use(express.static(join(process.cwd(), 'src/public/img')));
app.use(express.static(join(process.cwd(), 'src/public/js')));
app.use(express.static(join(process.cwd(), 'src/public/video')));
app.use(express.json()); // Sustituye a body-parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Sesiones y Cookies personalizadas
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto-por-defecto', // Mejor usar .env
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  if (!req.cookies.miCookie) {
    res.cookie('miCookie', 'valorDeCookie', { maxAge: 900000, httpOnly: true });
  }
  next();
});

// 4. Rutas
app.use(indexRoutes);

// Ruta de prueba (Sugerencia: Muévela a tu archivo de rutas luego)
app.get('/', (req, res) => {
  req.session.usuario = 'Jorge';
  req.session.rol = 'Administrador';
  req.session.visitas = (req.session.visitas || 0) + 1;
  
  res.send(`
    El usuario <strong>${req.session.usuario}</strong> (${req.session.rol}) 
    ha visitado la web <strong>${req.session.visitas}</strong> veces. 
    <a href="/popup">Abrir ventana emergente</a>
  `);
});

// 5. Manejo de errores simplificado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

app.listen(PORT, () => console.log(`🚀 Servidor en: http://localhost:${PORT}`));
