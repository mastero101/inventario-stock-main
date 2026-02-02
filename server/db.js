import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

export async function initDb() {
  try {
    // Tabla de Productos
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        codigo TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        stock_actual INTEGER DEFAULT 0,
        stock_minimo INTEGER DEFAULT 5,
        precio DECIMAL(10, 2) DEFAULT 0
      )
    `;

    // Tabla de Usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'USER',
        avatar TEXT
      )
    `;

    // Tabla de Movimientos
    await sql`
      CREATE TABLE IF NOT EXISTS movements (
        id TEXT PRIMARY KEY,
        fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        producto_id TEXT REFERENCES products(id) ON DELETE CASCADE,
        producto_nombre TEXT,
        tipo TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        motivo TEXT,
        usuario TEXT
      )
    `;

    // Usuario inicial si no existe
    const adminExists = await sql`SELECT * FROM users WHERE email = 'neelsoon64@gmail.com'`;
    if (adminExists.length === 0) {
      await sql`
        INSERT INTO users (id, nombre, email, password, role, avatar)
        VALUES ('1', 'Nelson Administrador', 'neelsoon64@gmail.com', 'Luna2187', 'ADMIN', 'NA')
      `;
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  }
}

export { sql };
