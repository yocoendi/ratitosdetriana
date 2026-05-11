import nodemailer from "nodemailer";
import fs from 'fs';

// 1. Configuración de Email (Cámbialo por tus credenciales de Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false para usar STARTTLS en puerto 587
  requireTLS: true, // Forzar TLS para evitar bloqueos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Asegúrate que sea la contraseña de aplicación de 16 caracteres
  },
  connectionTimeout: 10000, // Aumentar el tiempo de espera a 10s
});


// --- VISTAS ---
export const vistaHome = (req, res) => res.render('index', { title: 'Home' });
export const vistaGallery = (req, res) => res.render('gallery', { title: 'Gallery' });
export const vistaPrivacy = (req, res) => res.render('privacy', { title: 'PrivaciCookies' });

// --- LÓGICA DE DATOS ---
export const postMetodo = (req, res) => {
    res.json({ mensaje: "Formulario recibido correctamente" });
};


// --- ESTA ES LA FUNCIÓN QUE TE FALTABA ---
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
    // Borramos el archivo temporal siempre
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};
