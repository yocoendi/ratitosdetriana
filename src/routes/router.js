import express from "express";
import { vistaHome,postMetodo,vistaGallery} from "../controller/indexRoutex.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import multer from "multer"; // Importar multer
// Con estas líneas:
import fs from 'fs';


const router = express.Router();
const uploadDirectory = 'src/uploads/';

// Verificar si el directorio existe
if (!fs.existsSync(uploadDirectory)) {
  // Si no existe, créalo
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Crear nuestras rutas para las diferentes páginas
router.get("/", vistaHome);
router.get("/gallery", vistaGallery);
router.post("/", postMetodo);

//VISITAS

// GET: Renderizar VISITAS
router.get("/visita", (req, res) => {
  req.session.usuario = "Jorge";
  req.session.rol = "Administrador";
  req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
  res.send(
    `El usuario <Strong>${req.session.usuario}</Strong> con el privilegio de <Strong>${req.session.rol}</Strong> ha visitado la web <Strong>${req.session.visitas}</Strong>`
  );
});

//POT PARA MANDAR CV CON ARCHIVO ADJUTO

router.post("/cv", upload.single("file"), async (req, res) => {
  try {
    // Obtener los datos del formulario
    const emailAddress = req.body.emailAddress;
    const message = req.body.message;
    const file = req.file; // Utilizar req.file en lugar de req.files.file

    // Verificar si se envió un archivo adjunto
    if (!file) {
      return res.send(
        '<script>alert("No se ha adjuntado ningún archivo"); window.location.href="/";</script>'
      );
    }

    // Log del tamaño del archivo adjunto
    console.log("Tamaño del archivo adjunto:", file.size);

    // Configurar el transporter de nodemailer para enviar correos electrónicos
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Configura tu host de correo electrónico aquí
      port: 587, // Configura el puerto de correo electrónico aquí
      secure: false, // Si el servidor utiliza SSL/TLS, cambia a true
      auth: {
        user: "losratitosdetriana@gmail.com", // Tu dirección de correo electrónico
        pass: "ncg quy xke pfr exsv", // Tu contraseña de correo electrónico
      },
    });

    // Configurar el mensaje de correo electrónico
    const mailOptions = {
      from: emailAddress, // Dirección de correo electrónico del remitente
      to: "losratitosdetriana@gmail.com", // Dirección de correo electrónico del destinatario
      subject: "CV recibido - Confirmación de recepción", // Asunto del correo electrónico
      text: message, // Cuerpo del correo electrónico

      attachments: [
        {
          filename: file.originalname,
          content: fs.createReadStream(file.path),
        },
      ],
    };
        // Cerrar el stream después de adjuntarlo
        fs.createReadStream(file.path).on("end", () => {
          fs.unlinkSync(file.path); // Eliminar el archivo temporal después de cerrar el stream
        });


    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.send(
          '<script>alert("Error al enviar el correo electrónico"); window.location.href="/";</script>'
        );
      } else {
        console.log("Correo electrónico enviado:", info.response);
        return res.send(
          '<script>alert("Correo electrónico enviado con éxito"); window.location.href="/";</script>'
        );
      }
    });
  } catch (error) {
    console.log(error);
    return res.send(
      '<script>alert("Error en el servidor"); window.location.href="/";</script>'
    );
  }
});

//exportar enrutador
export default router;
