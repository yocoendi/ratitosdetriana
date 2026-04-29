import express from "express";
import { vistaHome, postMetodo, vistaGallery, vistaPrivacy } from "../controller/indexRoutex.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from 'fs';
import 'dotenv/config'; // 1. Cargar variables de entorno

const router = express.Router();
const uploadDirectory = 'src/uploads/';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

router.get("/", vistaHome);
router.get("/gallery", vistaGallery);
router.get("/privacy-policy/", vistaPrivacy);
router.post("/", postMetodo);

// POST PARA MANDAR CV
router.post("/cv", upload.single("file"), async (req, res) => {
  try {
    const { emailAddress, message } = req.body;
    const file = req.file;

    if (!file) {
      return res.send('<script>alert("No se ha adjuntado ningún archivo"); window.location.href="/";</script>');
    }

    console.log("Tamaño del archivo adjunto:", file.size);

    // 2. Transporter usando variables de entorno
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER, // Usar .env
        pass: process.env.EMAIL_PASS  // Usar .env (Contraseña de aplicación de 16 caracteres)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Gmail requiere que el 'from' sea el autenticado o un alias válido
      replyTo: emailAddress,        // Para que cuando respondas, le llegue al candidato
      to: "losratitosdetriana@gmail.com",
      subject: "CV recibido - Confirmación de recepción",
      text: `Mensaje de: ${emailAddress}\n\n${message}`,
      attachments: [
        {
          filename: file.originalname,
          path: file.path, // Es más sencillo pasar el path directamente
        },
      ],
    };

    // 3. Enviar correo y limpiar archivo
    transporter.sendMail(mailOptions, (error, info) => {
      // Eliminar el archivo después de intentar enviar (éxito o error)
      fs.unlinkSync(file.path); 

      if (error) {
        console.error("Error en Nodemailer:", error);
        return res.send('<script>alert("Error al enviar el correo"); window.location.href="/";</script>');
      }
      
      console.log("Correo enviado:", info.response);
      return res.send('<script>alert("CV enviado con éxito"); window.location.href="/";</script>');
    });

  } catch (error) {
    console.error("Error servidor:", error);
    if (req.file) fs.unlinkSync(req.file.path); // Limpiar en caso de crash
    return res.send('<script>alert("Error en el servidor"); window.location.href="/";</script>');
  }
});

export default router;
