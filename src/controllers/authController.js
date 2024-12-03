import pool from '../config/db.js';

// Función para registrar un nuevo alumno
export const registerAlumno = async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validación básica
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Insertar el alumno en la tabla (sin encriptar la contraseña)
    const result = await pool.query(
      'INSERT INTO alumnos (nombre, email, password) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, password]  // Usamos la contraseña tal cual sin encriptarla
    );

    res.status(201).json({
      message: 'Alumno registrado exitosamente',
      alumno: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    res.status(500).json({ error: 'Error al registrar al alumno' });
  }
};

// Función para iniciar sesión
export const loginAlumno = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica si el usuario existe
    const result = await pool.query('SELECT * FROM alumnos WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña sin encriptación
    if (password !== user.password) {  // Compara la contraseña directamente
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Responder con un mensaje de éxito
    res.status(200).json({ message: 'Login exitoso', user: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para obtener todos los alumnos
export const getAlumnos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alumnos');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener alumnos:', error.message);
    res.status(500).json({ message: 'Error al obtener los alumnos' });
  }
};

// Función para actualizar un alumno
export const updateAlumno = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  try {
    // Si se pasa una nueva contraseña, la actualizamos
    const query = `
      UPDATE alumnos 
      SET 
        nombre = $1, 
        email = $2, 
        password = COALESCE($3, password) 
      WHERE id = $4 
      RETURNING *`;
    const values = [nombre, email, password, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    res.status(200).json({ message: 'Alumno actualizado correctamente', alumno: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar alumno:', error.message);
    res.status(500).json({ message: 'Error al actualizar el alumno' });
  }
};

// Función para eliminar un alumno
export const deleteAlumno = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM alumnos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    res.status(200).json({ message: 'Alumno eliminado correctamente', alumno: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar alumno:', error.message);
    res.status(500).json({ message: 'Error al eliminar el alumno' });
  }
};
