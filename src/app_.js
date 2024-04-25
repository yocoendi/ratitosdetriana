import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bodyParser from 'body-parser';
import indexRoutes from './routes/router.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 4000;

// Middleware para configurar cookies
app.use((req, res, next) => {
  // Configura una cookie llamada "miCookie" con un valor
  res.cookie('miCookie', 'valorDeCookie', { maxAge: 900000, httpOnly: true });
  next();
});

app.use(
  session({
    secret: '123456',
    resave: false,
    saveUninitialized: true
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));

app.use(indexRoutes);

app.get('/', (req, res) => {
  req.session.usuario = 'Jorge';
  req.session.rol = 'Administrador';
  req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
  console.log(req.session)
  res.send(
    `El usuario <Strong>${req.session.usuario}</Strong> con el privilegio de <Strong>${req.session.rol}</Strong> ha visitado la web <Strong>${req.session.visitas}</Strong>`
  );
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`El servidor escucha en http://localhost:${port}`);
});

