import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import indexRoutes from './routes/router.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

dotenv.config();
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

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`El servidor escucha en http://localhost:${port}`);
});
