import express from 'express';
import { pool1 } from '../db.js';
import { vistaHome, vistaLogin, vistaRegistro, vistaSuscribirse, postMetodo } from '../controller/indexRoutex.js';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const router = express.Router();

// Crear nuestras rutas para las diferentes páginas
router.get('/', vistaHome);
router.get('/login', vistaLogin);
router.get('/registro', vistaRegistro);
router.get('/suscribirse', vistaSuscribirse);
router.post('/', postMetodo);

router.post('/auth', async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;
    if (user && pass) {
      const [results] = await pool1.query('SELECT * from Users where user = ?', [user]);
      if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
        res.status(401).send('Usuario o contraseña incorrectos');
      } else {
        res.status(200).send('Login correcto');
      }
    } else {
      res.status(400).send('Faltan campos obligatorios');
    }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

router.post('/registro', async (req, res) => {
  try {
    const name = req.body.name;
    const surname = req.body.surname;
    const user = req.body.user;
    const email = req.body.email;
    const pass = req.body.pass;
    const passwordHash = await bcryptjs.hash(pass, 8);
    await pool1.query('INSERT INTO Users SET ?', { name, surname, email, pass: passwordHash, user });
    res.status(200).send('Usuario insertado correctamente');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
});

router.post('/suscribirse', async (req, res) => {
  try {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    await pool1.query('INSERT INTO Users SET ?', { name, surname, email });
    res.status(200).send('Suscripción correcta');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;
