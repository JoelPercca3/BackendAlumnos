import express from 'express';
import { registerAlumno, loginAlumno, getAlumnos, updateAlumno, deleteAlumno} from '../controllers/authController.js';

const router = express.Router();

// Ruta para registrar un alumno
router.post('/register', registerAlumno);

// Ruta para iniciar sesión
router.post('/login', loginAlumno);

// Ruta para obtener todos los alumnos
router.get('/alumnos', getAlumnos);

// Ruta para actualizar los alumnos
router.get('/alumnos/:id', updateAlumno);

// Ruta para eliminar alumnos
router.delete('/alumnos/:id', deleteAlumno);

export default router;
