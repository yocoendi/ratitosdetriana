import express from "express";
import multer from "multer";
import { vistaHome, postMetodo, vistaGallery, vistaPrivacy, enviarCV } from "../controller/indexRoutex.js";

const router = express.Router();

// Configuración ultra-simple: Multer crea la carpeta 'uploads' si no existe
const upload = multer({ dest: 'src/uploads/' });

// Rutas de navegación
router.get("/", vistaHome);
router.get("/gallery", vistaGallery);
router.get("/privacy-policy/", vistaPrivacy);

// Rutas de acción
router.post("/", postMetodo);

// Ruta para CV (toda la lógica de nodemailer se va al controlador 'enviarCV')
router.post("/cv", upload.single("file"), enviarCV);

export default router;
