import jwt from 'jsonwebtoken';

// Función para generar un token JWT
export const generateToken = (userId, name, email) => {
  return jwt.sign(
    { userId, name, email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
