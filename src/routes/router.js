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

router.post('/', postMetodo);

router.post('/auth', async (req, res) => {
  try {
    const user = req.body.username;
    const pass = req.body.password;
    if (user && pass) {
      const [results] = await pool1.query('SELECT * from admin where username = ?', [user]);
      if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].password))) {
        res.send('<script>alert("Usuario o contraseña incorrectos"); window.location.href="/login";</script>');
      } else {
        res.render('dashboard');
      }
    } else {
      res.send('<script>alert("Faltan campos obligatorios"); window.location.href="/login";</script>');
    }
  } catch (error) {
    res.send('<script>alert("Error de conexión con el servidor"); window.location.href="/login";</script>');
  }
});

router.get('/dashboard', (req, res) => {
  if (req.session.usuario && req.session.rol) {
    res.render('dashboard');
  } else {
    res.send('<script>alert("Debes iniciar sesión para acceder al panel de control"); window.location.href="/login";</script>');
  }
});

router.post('/registro', async (req, res) => {
  try {
    const username = req.body.username;
    const restaurantId = req.body.restaurantId;
    const email = req.body.email;
    const pass = req.body.password;
    const passwordHash = await bcryptjs.hash(pass, 8);

    // Verificar si el nombre de usuario ya está registrado
    const [existingUsername] = await pool1.query('SELECT * FROM admin WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return res.send('<script>alert("El nombre de usuario ya está registrado"); window.location.href="/registro";</script>');
    }

    // Verificar si el correo electrónico ya está registrado
    const [existingEmail] = await pool1.query('SELECT * FROM admin WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.send('<script>alert("El correo electrónico ya está registrado"); window.location.href="/registro";</script>');
    }

    // Insertar el nuevo usuario en la base de datos
    await pool1.query('INSERT INTO admin SET ?', { username, restaurantId, email, password: passwordHash });
    res.send('<script>alert("Usuario insertado correctamente"); window.location.href="/login";</script>');
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/registro";</script>');
  }
});


router.post('/suscribirse', async (req, res) => {
  try {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;

    // Verificar si el correo electrónico ya existe en la base de datos
    const [existingUser] = await pool1.query('SELECT * FROM cliente WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.send('<script>alert("El correo electrónico ya está registrado"); window.location.href="/suscribirse";</script>');
    }

    // Insertar el nuevo cliente en la base de datos
    await pool1.query('INSERT INTO cliente SET ?', { name, surname, email });
    return res.send('<script>alert("Suscripción correcta, en breve recibirá noticias nuestras"); window.location.href="/";</script>');
  } catch (error) {
    console.log(error);
    return res.send('<script>alert("Error en el servidor"); window.location.href="/suscribirse";</script>');
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
      return res.send('<script>alert("No se ha adjuntado ningún archivo"); window.location.href="/";</script>');
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
      from: emailAddress, // Dirección de correo electrónico del remitente
      to: 'losratitosdetriana@gmail.com', // Dirección de correo electrónico del destinatario
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
        return res.send('<script>alert("Error al enviar el correo electrónico"); window.location.href="/";</script>');
      } else {
        console.log('Correo electrónico enviado:', info.response);
        return res.send('<script>alert("Correo electrónico enviado con éxito"); window.location.href="/";</script>');
      }
    });
  } catch (error) {
    console.log(error);
    return res.send('<script>alert("Error en el servidor"); window.location.href="/";</script>');
  }
});

// Manejo de errores
router.use((err, req, res, next) => {
  console.error(err); // Imprime el error en la consola para fines de depuración
  res.status(500).send('Error en el servidor'); // Responde con un mensaje genérico de error
});



export default router;
