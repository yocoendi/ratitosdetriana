import fs from 'fs';
import { Resend } from 'resend';

// 1. Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

console.log("🚀 Resend configurado para Railway");

// --- VISTAS ---
export const vistaHome = (req, res) => res.render('index', { title: 'Home' });
export const vistaGallery = (req, res) => res.render('gallery', { title: 'Gallery' });
export const vistaPrivacy = (req, res) => res.render('privacy', { title: 'PrivaciCookies' });

// --- LÓGICA DE DATOS ---
export const postMetodo = (req, res) => {
    res.json({ mensaje: "Formulario recibido correctamente" });
};

// --- FUNCIÓN DE ENVÍO CON RESEND ---
export const enviarCV = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.send('<script>alert("No se ha adjuntado ningún archivo"); window.location.href="/";</script>');
  }

  try {
    const { emailAddress, message } = req.body;

    // Usamos resend en lugar de transporter.sendMail
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Resend requiere este remitente por defecto al inicio
      to: "losratitosdetriana@gmail.com",
      subject: "CV recibido - Confirmación de recepción",
      html: `<p><strong>Mensaje de:</strong> ${emailAddress}</p><p>${message}</p>`,
      attachments: [
        {
          filename: file.originalname,
          content: fs.readFileSync(file.path), // Leemos el archivo para enviarlo
        },
      ],
    });

    res.send('<script>alert("CV enviado con éxito"); window.location.href="/";</script>');
  } catch (error) {
    console.error("Error en el envío con Resend:", error);
    res.send('<script>alert("Error al enviar el correo"); window.location.href="/";</script>');
  } finally {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};
