import nodemailer from "nodemailer";
import fs from 'fs';

// 1. Configuración de Nodemailer (Usamos solo el 'import' de arriba)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

// Prueba de conexión rápida
transporter.verify((error) => {
  if (error) {
    console.log("❌ Error en Railway:", error.message);
  } else {
    console.log("🚀 ¡Servidor de correo listo!");
  }
});

// --- VISTAS ---
export const vistaHome = (req, res) => res.render('index', { title: 'Home' });
export const vistaGallery = (req, res) => res.render('gallery', { title: 'Gallery' });
export const vistaPrivacy = (req, res) => res.render('privacy', { title: 'PrivaciCookies' });

// --- LÓGICA DE DATOS ---
export const postMetodo = (req, res) => {
    res.json({ mensaje: "Formulario recibido correctamente" });
};

// --- FUNCIÓN DE ENVÍO ---
export const enviarCV = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.send('<script>alert("No se ha adjuntado ningún archivo"); window.location.href="/";</script>');
  }

  try {
    const { emailAddress, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: emailAddress,
      to: "losratitosdetriana@gmail.com",
      subject: "CV recibido - Confirmación de recepción",
      text: `Mensaje de: ${emailAddress}\n\n${message}`,
      attachments: [{ filename: file.originalname, path: file.path }],
    });

    res.send('<script>alert("CV enviado con éxito"); window.location.href="/";</script>');
  } catch (error) {
    console.error("Error en el envío:", error);
    res.send('<script>alert("Error al enviar el correo"); window.location.href="/";</script>');
  } finally {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};
