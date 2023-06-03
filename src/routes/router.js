import express from 'express';
import { pool1 } from '../db.js';
import { vistaHome, vistaLogin, vistaRegistro, vistaSuscribirse, vistaDashboard, postMetodo } from '../controller/indexRoutex.js';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from 'multer'; // Importar multer

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' }); // Configurar multer para manejar la carga de archivos

// Crear nuestras rutas para las diferentes páginas
router.get('/', vistaHome);
router.get('/login', vistaLogin);
router.get('/registro', vistaRegistro);
router.get('/suscribirse', vistaSuscribirse);
router.get("/dashboard", vistaDashboard);
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
        res.render('dashboard'); // Renderizar la vista sidebar.ejs
      }
    } else {
      res.status(400).send('Faltan campos obligatorios');
    }
  } catch (error) {
    res.status(500).send('Error de conexion con el servidor');
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

router.post('/cv', upload.single('file'), async (req, res) => {
  try {
    // Obtener los datos del formulario
    const emailAddress = req.body.emailAddress;
    const message = req.body.message;
    const file = req.file; // Utilizar req.file en lugar de req.files.file

     // Verificar si se envió un archivo adjunto
     if (!file) {
      res.status(400).send('No se ha adjuntado ningún archivo');
      return;
    }

   // Configurar el transporter de nodemailer para enviar correos electrónicos
   const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Configura tu host de correo electrónico aquí
    port: 587, // Configura el puerto de correo electrónico aquí
    secure: false, // Si el servidor utiliza SSL/TLS, cambia a true
    auth: {
      user: 'losratitosdetriana@gmail.com', // Tu dirección de correo electrónico
      pass: 'kpanscacwppqzyln' // Tu contraseña de correo electrónico
    }


   
  });

    // Configurar el mensaje de correo electrónico
    const mailOptions = {
      from :emailAddress,  // Dirección de correo electrónico del remitente
      to:  'losratitosdetriana@gmail.com', // Dirección de correo electrónico del destinatario
      subject: 'CV recibido - Confirmación de recepción', // Asunto del correo electrónico
      text: message, // Cuerpo del correo electrónico
      attachments: [
        {
           filename: file.originalname, // Nombre del archivo adjunto
          content: file.buffer // Contenido del archivo adjunto
        }
      ]
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error al enviar el correo electrónico');
      } else {
        console.log('Correo electrónico enviado:', info.response);
        res.status(200).send('Correo electrónico enviado con éxito');
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
  }
});


export default router;
