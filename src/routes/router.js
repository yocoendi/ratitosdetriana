import { Router } from 'express';
import { pool1 } from '../db.js';
import { vistaHome, vistaLogin, vistaRegistro, vistaSuscribirse, postMetodo } from '../controller/indexRoutex.js';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const router = Router()



// Crear nuestras rutas para las diferentes paginas
router.get('/', vistaHome)
router.get('/login', vistaLogin)
router.get('/registro', vistaRegistro)
router.get('/suscribirse', vistaSuscribirse)
router.post('/', postMetodo)

router.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    if (user && pass) {
        try {
            const [results] = await pool1.query('SELECT * from Users where user = ?', [user]);
            if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                res.send('Usuario o contraseña incorrectos')
            } else {
                res.send('Login correcto')
            }
        } catch (error) {

        }
    }
})

router.post('/registro', async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const user = req.body.user;
    const email = req.body.email;
    const pass = req.body.pass;
    let passwordHash = await bcryptjs.hash(pass, 8);
    pool1.query('INSERT INTO Users SET ?', { name: name, surname: surname, email: email, pass: passwordHash, user: user, })
        .then(() => {
            res.send('Usuario insertado correctamente')
        })
        .catch((error) => {
            console.log(error)
        })
});

router.post('/suscribirse', async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    pool1.query('INSERT INTO Users SET ?', { name: name, surname: surname, email: email})
        .then(() => {
            res.send('Usuario insertado correctamente')
        })
        .catch((error) => {
            console.log(error)
        })
});




export default router;

