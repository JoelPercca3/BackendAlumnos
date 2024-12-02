import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();  

const app = express();
const port = process.env.PORT || 3000;  

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

export default app;
