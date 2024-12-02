import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
};


const pool = new Pool(poolConfig);

pool.connect()
    .then(client => {
        console.log('Conexión exitosa a la base de datos');
        client.release();
    })
    .catch(err => {
        console.error('Error completo:', err);
    });

export default pool;