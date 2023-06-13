import express from 'express';
import { pool1 } from '../db.js';
import { vistaHome, vistaLogin, vistaRegistro, vistaSuscribirse, postMetodo, vistaGallery, vistaEmpleados, vistaRestaurantes, vistaDashboard, vistaUpdate, vistaUpdateAdmin} from '../controller/indexRoutex.js';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from 'multer'; // Importar multer


const router = express.Router();
const upload = multer({ dest: 'src/uploads/' }); // Configurar multer para manejar la carga de archivos
const prisma = new PrismaClient(); //Instancias prisma para 



// Obtener datos de empleados y administradores
async function obtenerDatosDashboard() {
  const empleados = await prisma.empleados.findMany();
  const administradores = await prisma.admin.findMany();
  return { empleados, administradores };
}


// Crear nuestras rutas para las diferentes páginas
router.get('/', vistaHome);
router.get('/login', vistaLogin);
router.get('/registro', vistaRegistro);
router.get('/empleados', vistaEmpleados);
router.get('/suscribirse', vistaSuscribirse);
router.get('/gallery', vistaGallery);
router.get('/restaurantes', vistaRestaurantes);


// GET: Renderizar la página de actualización del administrador
router.get('/updateAdmin/:id', getUpdateAdmin);

// POST: Actualizar el administrador en la base de datos
router.post('/updateAdmin', postUpdateAdmin);

// GET: Renderizar la página de actualización del empleado
router.get('/updateEmpleados/:id', getUpdateEmpleado);

// POST: Actualizar el empleado en la base de datos
router.post('/updateEmpleados', postUpdateEmpleado);

 // Aplica el middleware de verificación de sesión

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al destruir la sesión:', err);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/dashboard', async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      // El usuario está autenticado, obtén los datos de administradores y empleados
      const administradores = await prisma.admin.findMany();
      const empleados = await prisma.empleados.findMany();
      
      res.render('dashboard', { administradores, empleados });
    } else {
      // El usuario no está autenticado, redirige a la página de inicio de sesión
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los administradores:', error);
    res.render('dashboard', { administradores: [], empleados: [] });
  }
});

router.get('/visita', (req, res) => {
  req.session.usuario = 'Jorge';
  req.session.rol = 'Administrador';
  req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
  res.send(
    `El usuario <Strong>${req.session.usuario}</Strong> con el privilegio de <Strong>${req.session.rol}</Strong> ha visitado la web <Strong>${req.session.visitas}</Strong>`
  );
});

router.post('/', postMetodo);

router.post('/auth', async (req, res) => {
  try {
    
    const password = req.body.password;
    const username = req.body.username;
    
    if (username && password ) {
      // Buscar al usuario en la base de datos utilizando Prisma
      const admin = await prisma.admin.findUnique({
        where: {
          username: username
        },
      });

      if (!admin || !(await bcryptjs.compare(password, admin.password))) {
        // Usuario o contraseña incorrectos
        return res.send('<script>alert("Usuario o contraseña incorrectos"); window.location.href="/login";</script>');
      } else {
        // Autenticación exitosa, redirigir al dashboard
        const empleados = await prisma.empleados.findMany();
        const administradores = await prisma.admin.findMany();
        res.render('dashboard', { empleados, administradores });
      }
    } else {
      // Faltan campos obligatorios
      res.send('<script>alert("Faltan campos obligatorios"); window.location.href="/login";</script>');
    }
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error de conexión con el servidor"); window.location.href="/login";</script>');
  }
});

router.post('/registro', async (req, res) => {
  try {
    const username = req.body.username;
    const dni = req.body.dni;
    const restaurantId = parseInt(req.body.restaurantId); // Convertir a número entero
    const email = req.body.email;
    const password = req.body.password;
    const passwordHash = await bcryptjs.hash(password, 8);

    // Verificar si el dni ya está registrado utilizando Prisma
    const existingUsername = await prisma.admin.findUnique({
      where: {
        dni: dni,
      },
    });
    if (existingUsername) {
      return res.send('<script>alert("El Dni ya está registrado"); window.location.href="/registro";</script>');
    }

    // Insertar el nuevo usuario en la base de datos utilizando Prisma
    await prisma.admin.create({
      data: {
        dni: dni,
        username: username,
        email: email,
        password: passwordHash,
        restaurant:{
          connect:{ id: restaurantId }
        }
      },
    });

    const { empleados, administradores } = await obtenerDatosDashboard();
    res.render('dashboard', { administradores, empleados });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/registro";</script>');
  }
});

router.post('/restaurantes', async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      website
    } = req.body;

    const restaurantId = parseInt(req.body.restaurantId); // Convertir a número entero

    // Verificar si el restaurante ya existe
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: {
        restaurantId: restaurantId,
      },
    });

    if (existingRestaurant) {
      return res.send('<script>alert("El Restaurante ya está registrado"); window.location.href="/registro";</script>');
    }

    // Crear un nuevo restaurante en la base de datos
    const newRestaurant = await prisma.restaurant.create({
      data: {
        restaurantId: restaurantId,
        name: name,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode,
        phone: phone,
        email: email,
        website: website,
      },
    });

    res.send('<script>alert("Restaurante insertado correctamente"); window.location.href="/empleados";</script>');
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/empleados";</script>');
  }
});

router.post('/empleados', async (req, res) => {
  try {
    const dni = req.body.dni;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const position = req.body.position;
    const restaurantId = parseInt(req.body.restaurantId); // Convertir a número entero

    // Verificar si el empleado ya está registrado
    const existingEmployee = await prisma.empleados.findUnique({
      where: {
        dni:dni
      }
    });
    if (existingEmployee) {
      return res.send('<script>alert("El empleado ya está registrado"); window.location.href="/empleados";</script>');
    }

    // Insertar el nuevo empleado en la base de datos
    await prisma.empleados.create({
      data: {
        dni: dni,
        firstName: firstName,
        lastName: lastName,
        position: position,
        restaurant: {
          connect: { id: restaurantId }
        }
      }
    });
    const { empleados, administradores } = await obtenerDatosDashboard();
    res.render('dashboard', { administradores, empleados });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/empleados";</script>');
  }
});




// Función de controlador para renderizar la página de actualización del administrador
async function getUpdateAdmin(req, res) {
  try {
    const id = parseInt(req.params.id);
    const admin = await prisma.admin.findUnique({
      where: {
        id: id
      },
      include: {
        restaurant: true
      }
    });

    res.render('updateAdmin', { admin: admin });
  } catch (error) {
    console.error('Error al obtener el administrador:', error);
    res.redirect('/dashboard');
  }
}

// Función de controlador para actualizar el administrador en la base de datos
async function postUpdateAdmin(req, res) {
  try {
    const id = req.body.id;
    const dni = req.body.dni;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const restaurantId = req.body.restaurantId;

    // Realiza la lógica necesaria para actualizar el administrador en la base de datos
    await prisma.admin.update({
      where: {
        id: parseInt(id)
      },
      data: {
        dni: dni,
        email: email,
        username: username,
        password: password,
        restaurant: {
          connect: {
            id: parseInt(restaurantId)
          }
        }
      }
    });

    // Obtén los empleados y administradores actualizados para renderizar el dashboard
    const { empleados, administradores } = await obtenerDatosDashboard();
    res.render('dashboard', { administradores, empleados });

  } catch (error) {
    console.error('Error al actualizar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
}

// Función de controlador para renderizar la página de actualización del empleado
async function getUpdateEmpleado(req, res) {
  try {
    const id = parseInt(req.params.id);
    const empleados = await prisma.empleados.findUnique({
      where: {
        id
      }
    });

    res.render('updateEmpleados', { empleados });
  } catch (error) {
    console.error('Error al obtener el empleado:', error);
    res.redirect('/dashboard');
  }
}

// Función de controlador para actualizar el empleado en la base de datos
async function postUpdateEmpleado(req, res) {
  try {
    const { id, dni, firstName, lastName, position, restaurantId } = req.body;

    // Realizar la lógica necesaria para actualizar el empleado en la base de datos
    await prisma.empleados.update({
      where: {
        id: parseInt(id)
      },
      data: {
        dni,
        firstName,
        lastName,
        position,
        restaurant: {
          connect: {
            id: parseInt(restaurantId)
          }
        }
      }
    });

    const { empleados, administradores } = await obtenerDatosDashboard();
    res.render('dashboard', { empleados, administradores });
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    res.redirect('/dashboard');
  }
}

// Ejemplo de consulta de empleados
async function getEmpleados() {
  const empleados = await prisma.empleados.findMany();
  console.log(empleados);
}

async function getAdmin() {
  const administradores = await prisma.admin.findMany();
  console.log(administradores);
}

async function getClientes() {
  const clientes = await prisma.cliente.findMany();
  console.log(clientes);
}

async function getRestaurantes() {
  const restaurant = await prisma.restaurant.findMany();
  console.log(restaurant);
}


















router.post('/suscribirse', async (req, res) => {
  try {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;

    // Verificar si el correo electrónico ya existe en la base de datos utilizando Prisma
    const existingUser = await prisma.cliente.findFirst({
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



//exportar enrutador
export default router;
