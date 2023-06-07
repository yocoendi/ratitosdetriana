import express from 'express';
import { pool1 } from '../db.js';
import { vistaHome, vistaLogin, vistaRegistro, vistaSuscribirse, postMetodo, vistaGallery, vistaEmpleados } from '../controller/indexRoutex.js';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from 'multer'; // Importar multer

const router = express.Router();
const upload = multer({ dest: 'src/uploads/' }); // Configurar multer para manejar la carga de archivos
const prisma = new PrismaClient(); //Instancias prisma para 

// Aquí puedes utilizar el cliente de Prisma para realizar operaciones en la base de datos

// Ejemplo de consulta de empleados
async function getEmpleados() {
  const empleados = await prisma.empleados.findMany();
  console.log(empleados);
}

async function getAdmin() {
  const admin = await prisma.admin.findMany();
  console.log(admin);
}


getEmpleados();
getAdmin();

// Cierra la conexión de Prisma al finalizar
//prisma.$disconnect();


// Crear nuestras rutas para las diferentes páginas
router.get('/', vistaHome);
router.get('/login', vistaLogin);
router.get('/registro', vistaRegistro);
router.get('/empleados', vistaEmpleados);
router.get('/suscribirse', vistaSuscribirse);
router.get('/gallery', vistaGallery);
router.post('/', postMetodo);



router.post('/auth', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      // Buscar al usuario en la base de datos utilizando Prisma
      const admin = await prisma.admin.findUnique({
        where: {
          username: username,
        },
      });

      if (!admin || !(await bcryptjs.compare(password, admin.password))) {
        // Usuario o contraseña incorrectos
        return res.send('<script>alert("Usuario o contraseña incorrectos"); window.location.href="/login";</script>');
      } else {
        // Autenticación exitosa, redirigir al dashboard
        res.render('dashboard');
      }
    } else {
      // Faltan campos obligatorios
      res.send('<script>alert("Faltan campos obligatorios"); window.location.href="/login";</script>');
    }
  } catch (error) {
    // Error de conexión con el servidor
    res.send('<script>alert("Error de conexión con el servidor"); window.location.href="/login";</script>');
  }
});

router.post('/registro', async (req, res) => {
  try {
    const username = req.body.username;
    const restaurantId = req.body.restaurantId;
    const email = req.body.email;
    const password = req.body.password;
    const passwordHash = await bcryptjs.hash(password, 8);

    // Verificar si el nombre de usuario ya está registrado utilizando Prisma
    const existingUsername = await prisma.admin.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUsername) {
      return res.send('<script>alert("El nombre de usuario ya está registrado"); window.location.href="/registro";</script>');
    }

    // Verificar si el correo electrónico ya está registrado utilizando Prisma
    const existingEmail = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      return res.send('<script>alert("El correo electrónico ya está registrado"); window.location.href="/registro";</script>');
    }

    // Insertar el nuevo usuario en la base de datos utilizando Prisma
    await prisma.admin.create({
      data: {
        username: username,
        restaurantId: restaurantId,
        email: email,
        password: passwordHash,
      },
    });

    res.send('<script>alert("Usuario insertado correctamente"); window.location.href="/login";</script>');
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/registro";</script>');
  }
});

router.post('/empleados', async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const position = req.body.position;
    const restaurantId = parseInt(req.body.restaurantId); // Convertir a número entero

    // Verificar si el empleado ya está registrado
    const existingEmployee = await prisma.empleados.findFirst({
      where: {
        firstName: firstName,
        lastName: lastName
      }
    });
    if (existingEmployee) {
      return res.send('<script>alert("El empleado ya está registrado"); window.location.href="/empleados";</script>');
    }

    // Insertar el nuevo empleado en la base de datos
    await prisma.empleados.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        position: position,
        restaurant: {
          connect: { id: restaurantId }
        }
      }
    });

    res.send('<script>alert("Empleado insertado correctamente"); window.location.href="/empleados";</script>');
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/empleados";</script>');
  }
});

router.post('/suscribirse', async (req, res) => {
  try {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;

    // Verificar si el correo electrónico ya existe en la base de datos utilizando Prisma
    const existingUser = await prisma.cliente.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.send('<script>alert("El correo electrónico ya está registrado"); window.location.href="/suscribirse";</script>');
    }

    // Insertar el nuevo cliente en la base de datos utilizando Prisma
    await prisma.cliente.create({
      data: {
        name: name,
        surname: surname,
        email: email,
      },
    });

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


export default router;
