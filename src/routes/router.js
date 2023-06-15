import express from 'express';
import { pool1 } from '../db.js';
import { vistaHome, vistaLogin, vistaRegistro, vistaCvnews, postMetodo, vistaGallery, vistaEmpleados, vistaRestaurantes, vistaFacturas,vistaProveedores, vistaClientes } from '../controller/indexRoutex.js';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from 'multer'; // Importar multer



const router = express.Router();
const upload = multer({ dest: 'src/uploads/' }); // Configurar multer para manejar la carga de archivos
const prisma = new PrismaClient(); //Instancias prisma para 


async function obtenerDatosDashboard() {
  const empleado = await prisma.empleados.findMany();
  const administradores = await prisma.admin.findMany();
  const restaurantes = await prisma.restaurant.findMany();
  const factura = await prisma.facturas.findMany();
  const clientes = await prisma.cliente.findMany();
  const proveedor = await prisma.proveedores.findMany();

  return { empleado, administradores, restaurantes, factura, clientes, proveedor };
}

// Crear nuestras rutas para las diferentes páginas
router.get('/', vistaHome);
router.get('/login', vistaLogin);
router.get('/cvnews', vistaCvnews);
router.get('/gallery', vistaGallery);




router.post('/', postMetodo);


//REGISTRO

// POST: LOGIN DE admin en la base de datos
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
        req.session.userId = admin.id;
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
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

//LOGOUT

// GET: Renderizar la página de cierre de sesión
router.get('/logout', (req, res) => {
  // Destruye la sesión del usuario
  req.session.destroy(err => {
    if (err) {
      // Si ocurre un error al destruir la sesión, muestra un mensaje de error en la consola
      console.error('Error al destruir la sesión:', err);
    } else {
      // Redirige al usuario a la página principal después de cerrar sesión
      res.redirect('/');
    }
  });
});

//DASHBOARD 

// GET: Renderizar EL DASHBOARD 
router.get('/dashboard', async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      // El usuario está autenticado, mostrar enlace a la vista de clientes
     
      const { administradores, empleado, proveedor, factura, clientes, restaurantes } = await obtenerDatosDashboard();
      res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes });
    } else {
      // El usuario no está autenticado, redirigir a la página de inicio de sesión
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error al obtener los datos del dashboard:', error);
    res.render('dashboard', { administradores: [], empleado: [], proveedor: [], factura: [], clientes: [], restaurantes: [] });
  }
});



router.get('/dashboard/clientes', (req, res) => {
  if (req.session && req.session.userId) {
    vistaClientes(req, res);
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard/registro', (req, res) => {
  if (req.session && req.session.userId) {
    vistaRegistro(req, res);
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard/restaurantes', (req, res) => {
  if (req.session && req.session.userId) {
    vistaRestaurantes(req, res);
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard/empleados', (req, res) => {
  if (req.session && req.session.userId) {
    vistaEmpleados(req, res);
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard/proveedores', (req, res) => {
  if (req.session && req.session.userId) {
    vistaProveedores(req, res);
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard/facturas', (req, res) => {
  if (req.session && req.session.userId) {
    vistaFacturas(req, res);
  } else {
    res.redirect('/login');
  }
});









//VISITAS 

// GET: Renderizar VISITAS 
router.get('/visita', (req, res) => {
  req.session.usuario = 'Jorge';
  req.session.rol = 'Administrador';
  req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
  res.send(
    `El usuario <Strong>${req.session.usuario}</Strong> con el privilegio de <Strong>${req.session.rol}</Strong> ha visitado la web <Strong>${req.session.visitas}</Strong>`
  );
});



//ADMIN

// POST: registrar el admin en la base de datos
router.post('/registro', registro);
// Función de controlador para el registro de usuarios
async function registro(req, res) {
  try {
    const username = req.body.username;
    const dni = req.body.dni;
    const restaurantId = parseInt(req.body.restaurantId); // Convertir a número entero
    const email = req.body.email;
    const password = req.body.password;
    const passwordHash = await bcryptjs.hash(password, 8);

    // Verificar si el DNI ya está registrado utilizando Prisma
    const existingUsername = await prisma.admin.findUnique({
      where: {
        dni: dni,
      },
    });
    if (existingUsername) {
      return res.send('<script>alert("El DNI ya está registrado"); window.location.href="/registro";</script>');
    }

    // Insertar el nuevo usuario en la base de datos utilizando Prisma
    await prisma.admin.create({
      data: {
        dni: dni,
        username: username,
        email: email,
        password: passwordHash,
        restaurant: {
          connect: { id: restaurantId }
        }
      },
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/registro";</script>');
  }
}
// POST: Actualizar el administrador en la base de datos
router.post('/updateAdmin', postUpdateAdmin);
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
    const admin = await prisma.admin.update({
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

       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });

  } catch (error) {
    console.error('Error al actualizar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
}
// GET: Renderizar la página de actualización del administrador
router.get('/updateAdmin/:id', getUpdateAdmin);
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
// Función de controlador para borrar del administrador
router.get('/deleteAdmin/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Realiza la lógica necesaria para eliminar el administrador
    await prisma.admin.delete({
      where: {
        id: id
      }
    });
       // Autenticación exitosa, redirigir al dashboard
        const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
        res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
      
  } catch (error) {
    console.error('Error al eliminar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
});


//EMPLEADOS

// POST: registrar el empleado en la base de datos
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
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/empleados";</script>');
  }
});
// POST: Actualizar el empleado en la base de datos
router.post('/updateEmpleados', postUpdateEmpleado);
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

       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    res.redirect('/dashboard');
  }
}
// GET: Renderizar la página de actualización del empleado
router.get('/updateEmpleados/:id', getUpdateEmpleado);
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
// GET: para borrar el empleado
router.get('/deleteEmpleados/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Realiza la lógica necesaria para eliminar el administrador
    await prisma.empleados.delete({
      where: {
        id: id
      }
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
    
  } catch (error) {
    console.error('Error al eliminar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
});



//FACTURAS

// POST: registrar el facturas en la base de datos
router.post('/facturas', registroFactura);
// Función de controlador para actualizar facturas en la base de datos
async function registroFactura(req, res) {
  try {
    const { facturaNumber, date, total, proveedorId, restaurantId, cif } = req.body;
    console.log(req.body);

    // Parsear la fecha en el formato deseado y establecer la parte de tiempo en cero
    const [day, month, year] = date.split('/');
    const parsedDate = new Date(`${year}-${month}-${day}`);
    parsedDate.setHours(0, 0, 0, 0);

    // Insertar la nueva factura en la base de datos utilizando Prisma
    await prisma.facturas.create({
      data: {
        facturaNumber,
        date: parsedDate,
        total: parseFloat(total),
        proveedor: {
          connect: { cif: cif }
        },
        restaurant: {
          connect: { id: parseInt(restaurantId) }
        }
      }
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });

  } catch (error) {
    console.error('Error al registrar la factura:', error);
    res.send('Ocurrió un error al registrar la factura');
  }
}
// Router para actualizar una factura en la base de datos
router.post('/updateFacturas', updateFactura);
// Función de controlador para actualizar una factura en la base de datos
async function updateFactura(req, res) {
  try {
  
    const { id,facturaNumber, date, total, restaurantId, cif } = req.body;

    // Parsear la fecha en el formato deseado y establecer la parte de tiempo en cero
    const [day, month, year] = date.split('/');
    const parsedDate = new Date(`${year}-${month}-${day}`);
    parsedDate.setHours(0, 0, 0, 0);

    // Actualizar la factura en la base de datos utilizando Prisma
    await prisma.facturas.update({
      where: { id: parseInt(id)},
      data: {
        facturaNumber,
        date: parsedDate,
        total: parseFloat(total),
        proveedor: {
          connect: { cif: cif }
        },
        restaurant: {
          connect: { id: parseInt(restaurantId, 10) } // Parsear el ID del restaurante como número entero
        }
      }
    });

       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });

  } catch (error) {
    console.error('Error al actualizar la factura:', error);
    res.send('Ocurrió un error al actualizar la factura');
  }
}
// GET: Renderizar la página de actualización de una factura
router.get('/updateFacturas/:id', renderUpdateFacturaPage);
// Función de controlador para renderizar la página de actualización de una factura
async function renderUpdateFacturaPage(req, res) {
  try {
    const id = parseInt(req.params.id);

    // Obtener la factura de la base de datos utilizando Prisma
    const factura = await prisma.facturas.findUnique({
      where: {
        id
      },
      include: {
        proveedor: true,
        restaurant: true
      }
    });
    
    
   // Renderizar la página de actualización de la factura con los datos obtenidos
    res.render('updateFacturas', { facturas : factura });
   

  } catch (error) {
    console.error('Error al obtener la factura:', error);
    res.send('Ocurrió un error al obtener la factura');
  }
}
// GET: Borrar una factura
router.get('/deleteFacturas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Realiza la lógica necesaria para eliminar el administrador
    await prisma.facturas.delete({
      where: {
        id: id
      }
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
    
  } catch (error) {
    console.error('Error al eliminar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
});


//PROVEEDORES

//POST: registro de proveedores en la base de datos
router.post('/proveedores', async (req, res) => {
  try {
    const { cif, name, address, state, zipCode, phone, email, restaurantId } = req.body;

// Verificar si el empleado ya está registrado
    const existingProveedor = await prisma.proveedores.findUnique({
    where: {
     cif:cif
  }
  });
  if (existingProveedor) {
  return res.send('<script>alert("El proveedor ya está registrado"); window.location.href="/proveedores";</script>');
  }

    // Insertar el nuevo proveedor en la base de datos utilizando Prisma
    await prisma.proveedores.create({
      data: {
        cif,
        name,
        address,
        state,
        zipCode,
        phone,
        email,
        restaurant: {
          connect: { id: parseInt(restaurantId) },
        },
      },
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.error('Error al registrar el proveedor:', error);
    res.status(500).json({ error: 'Ocurrió un error al registrar el proveedor' });
  }
});
// POST: Modificación de proveedores en la base de datos
router.post('/updateProveedores', async (req, res) => {
  try {
    const { id, cif, name, address, state, zipCode, phone, email, restaurantId } = req.body;

    // Verificar si el valor de id es un número válido
    if (!id || isNaN(parseInt(id))) {
      throw new Error('El valor de id no es válido');
    }

    // Actualizar los datos del proveedor en la base de datos utilizando Prisma
    await prisma.proveedores.update({
      where: { id: parseInt(id) },
      data: {
        cif,
        name,
        address,
        state,
        zipCode,
        phone,
        email,
        restaurant: {
          connect: { id: parseInt(restaurantId) },
        },
      },
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.error('Error al modificar el proveedor:', error);
    res.status(500).json({ error: 'Ocurrió un error al modificar el proveedor' });
  }
});
// GET: Renderizar página de actualización de proveedores
router.get('/updateProveedores/:id', getUpdateProveedor);
// Función de controlador para renderizar la página de actualización del proveedor
async function getUpdateProveedor(req, res) {
  try {
    const id = parseInt(req.params.id);
/*     console.log('Valor de req.params.id:', req.params.id);
    console.log('ID del proveedor:', id); */

    const proveedores = await prisma.proveedores.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    console.log('Proveedor encontrado:', proveedores);

    res.render('updateProveedores', { proveedores });
  } catch (error) {
    console.error('Error al obtener el proveedor:', error);
    res.redirect('/proveedores');
  }
}
//GET: Borrar los proveedores por id
router.get('/deleteProveedores/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Realiza la lógica necesaria para eliminar el administrador
    await prisma.proveedores.delete({
      where: {
        id: id
      }
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
    
  } catch (error) {
    console.error('Error al eliminar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
});


//RESTAURANTES

// POST: registrar el RESTAURANTES en la base de datos
router.post('/restaurantes', async (req, res) => {
  try {
    const {
      name,
      address,
      city,
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
      await prisma.restaurant.create({
      data: {
        restaurantId: restaurantId,
        name: name,
        address: address,
        city: city,
        zipCode: zipCode,
        phone: phone,
        email: email,
        website: website,
      },
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/empleados";</script>');
  }
});
// POST: registrar el RESTAURANTES en la base de datos
router.post('/updateRestaurantes', async (req, res) => {
  try {
    const { id,name, address, city, state, zipCode, phone, email, website } = req.body;

        // Verificar si el valor de id es un número válido
        if (!id || isNaN(parseInt(id))) {
          throw new Error('El valor de id no es válido');
        }

    // Crear un nuevo restaurante en la base de datos
      await prisma.restaurant.update({
        where: {id: parseInt(id)},  
      data: {
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
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/empleados";</script>');
  }
});
router.get('/updateRestaurantes/:id', getUpdateRestaurante);
// Función de controlador para renderizar la página de actualización del proveedor
async function getUpdateRestaurante(req, res) {
  try {
    const id = parseInt(req.params.id);
/*     console.log('Valor de req.params.id:', req.params.id);
    console.log('ID del proveedor:', id); */

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    console.log('Proveedor encontrado:', restaurant);

    res.render('updateRestaurantes', { restaurant });
  } catch (error) {
    console.error('Error al obtener el proveedor:', error);
    res.redirect('/proveedores');
  }
}
//GET: Borra los restaurantes por id
router.get('/deleteRestaurantes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Realiza la lógica necesaria para eliminar el administrador
    await prisma.restaurant.delete({
      where: {
        id: id
      }
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
    
  } catch (error) {
    console.error('Error al eliminar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
});



//CLIENTES

// POST: registrar el CLIENTES en la base de datos
router.post('/clientes', async (req, res) => {
  try {
    const { name, surname, email, phone, address, city, zipCode } = req.body;

   // Verificar si el DNI ya está registrado utilizando Prisma
   const existingemail = await prisma.cliente.findUnique({
    where: {
      email: email,
    },
  });
  if (existingemail) {
    return res.send('<script>alert("El email ya esta registrado ya está registrado"); window.location.href="/clientes";</script>');
  }

    // Crear un nuevo restaurante en la base de datos
      await prisma.cliente.create({
      data: {
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        address: address,
        city: city,
        zipCode: zipCode,
      },
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/empleados";</script>');
  }
});
// POST: registrar el CLIENTES en la base de datos
router.post('/updateClientes', async (req, res) => {
  try {

    const { id, name, surname, email, phone, address, city, zipCode } = req.body;

    // Verificar si el valor de id es un número válido
    if (!id || isNaN(parseInt(id))) {
      throw new Error('El valor de id no es válido');
    }

    // Actualizar los datos del cliente en la base de datos
    await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        address: address,
        city: city,
        zipCode: zipCode,
      },
    });

       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
  } catch (error) {
    console.log(error);
    res.send('<script>alert("Error en el servidor"); window.location.href="/dashboard";</script>');
  }
});
// GET: Renderizar página de actualización de CLIENTES
router.get('/updateClientes/:id', getUpdateCliente);
// Función de controlador para renderizar la página de actualización del proveedor
async function getUpdateCliente(req, res) {
  try {
    const id = parseInt(req.params.id);
    const cliente = await prisma.cliente.findUnique({
      where: {
        id
      }
    });

    console.log('Cliente encontrado:', cliente);

    res.render('updateClientes', { cliente });
  } catch (error) {
    console.error('Error al obtener el proveedor:', error);
    res.redirect('/proveedores');
  }
}
//GET: Borra los clientes por id
router.get('/deleteClientes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Realiza la lógica necesaria para eliminar el administrador
    await prisma.cliente.delete({
      where: {
        id: id
      }
    });
       // Autenticación exitosa, redirigir al dashboard
       const { empleado, administradores, proveedor,factura, clientes, restaurantes } = await obtenerDatosDashboard();
       res.render('dashboard', { administradores, empleado, proveedor, factura, clientes, restaurantes  });
    
  } catch (error) {
    console.error('Error al eliminar el administrador:', error);
    res.redirect('/dashboard'); // Redirige al dashboard si ocurre un error
  }
});









//POT PARA MANDAR CV CON ARCHIVO ADJUTO

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

router.post('/cvnews', upload.single('file'), async (req, res) => {
  try {
    // Obtener los datos del formulario
    const emailAddress = req.body.emailAddress;
    const message = req.body.message;
    /* const file = req.file; // Utilizar req.file en lugar de req.files.file

    // Verificar si se envió un archivo adjunto
    if (!file) {
      return res.send('<script>alert("No se ha adjuntado ningún archivo"); window.location.href="/";</script>');
    } */

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
      subject: 'Información de Franquicia solicitada - Confirmación de recepción', // Asunto del correo electrónico
      text: message, // Cuerpo del correo electrónico
/*       attachments: [
        {
          filename: file.originalname, // Nombre del archivo adjunto
          content: file.buffer // Contenido del archivo adjunto
        }
      ] */
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

/* router.post('/suscribirse_', async (req, res) => {
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
}); */




//exportar enrutador
export default router;
