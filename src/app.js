import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import indexRoutes from './routes/router.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); //Instancias prisma para 
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

// Obtener datos de empleados y administradores
async function obtenerDatosDashboard() {
  const empleado = await prisma.empleados.findMany();
  const administradores = await prisma.admin.findMany();
  const restaurantes = await prisma.restaurant.findMany();
  const factura = await prisma.facturas.findMany();
  const clientes = await prisma.cliente.findMany();
  const proveedor = await prisma.proveedores.findMany();

  return { empleado, administradores, restaurantes, factura, clientes, proveedor };
}

app.get('/deleteAdmin/:id', async (req, res) => {
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


app.get('/deleteEmpleados/:id', async (req, res) => {
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

app.get('/deleteProveedores/:id', async (req, res) => {
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


app.get('/deleteFacturas/:id', async (req, res) => {
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

app.get('/deleteClientes/:id', async (req, res) => {
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

app.get('/deleteRestaurantes/:id', async (req, res) => {
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





app.get('/visita', (req, res) => {
  req.session.usuario = 'Jorge';
  req.session.rol = 'Administrador';
  req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
  res.send(
    `El usuario <Strong>${req.session.usuario}</Strong> con el privilegio de <Strong>${req.session.rol}</Strong> ha visitado la web <Strong>${req.session.visitas}</Strong>`
  );
});

// Crear el servidor
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`El servidor escucha en http://localhost:${port}`);
});
