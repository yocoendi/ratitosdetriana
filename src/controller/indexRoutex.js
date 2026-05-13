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

// --- FUNCIÓN DE ENVÍO CON RESEND (CORREGIDA) ---
export const enviarCV = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.send('<script>alert("No se ha adjuntado ningún archivo"); window.location.href="/";</script>');
  }

  try {
    const { emailAddress, message } = req.body;

    // Leemos el archivo y lo convertimos a Base64 para que Resend no se quede colgado
    const attachmentContent = fs.readFileSync(file.path).toString("base64");

    await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: "losratitosdetriana@gmail.com", // <-- IMPORTANTE: Debe ser el mismo correo de tu cuenta de Resend
      subject: "CV recibido - Confirmación de recepción",
      html: `<p><strong>Mensaje de:</strong> ${emailAddress}</p><p>${message}</p>`,
      attachments: [
        {
          filename: file.originalname,
          content: attachmentContent, // Pasamos el contenido en base64
        },
      ],
    });

    res.send('<script>alert("CV enviado con éxito"); window.location.href="/";</script>');
  } catch (error) {
    console.error("❌ Error en el envío con Resend:", error);
    res.send('<script>alert("Error al enviar el correo"); window.location.href="/";</script>');
  } finally {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};
