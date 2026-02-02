import express from 'express';
import cors from 'cors';
import { sql, initDb } from '../server/db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Inicializar DB
let dbInitialized = false;
async function ensureDbInit() {
    if (!dbInitialized) {
        await initDb();
        dbInitialized = true;
    }
}

// Health check
app.get('/health', async (req, res) => {
    await ensureDbInit();
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- PRODUCTOS ---
app.get('/products', async (req, res) => {
    try {
        await ensureDbInit();
        const products = await sql`SELECT * FROM products ORDER BY nombre ASC`;
        const mapped = products.map(p => ({
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            stockActual: p.stock_actual,
            stockMinimo: p.stock_minimo,
            precio: parseFloat(p.precio)
        }));
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/products', async (req, res) => {
    const { id, codigo, nombre, stockActual, stockMinimo, precio } = req.body;
    try {
        await ensureDbInit();
        await sql`
      INSERT INTO products (id, codigo, nombre, stock_actual, stock_minimo, precio)
      VALUES (${id}, ${codigo}, ${nombre}, ${stockActual}, ${stockMinimo}, ${precio})
      ON CONFLICT (id) DO UPDATE SET
        codigo = EXCLUDED.codigo,
        nombre = EXCLUDED.nombre,
        stock_actual = EXCLUDED.stock_actual,
        stock_minimo = EXCLUDED.stock_minimo,
        precio = EXCLUDED.precio
    `;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        await ensureDbInit();
        await sql`DELETE FROM products WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- MOVIMIENTOS ---
app.get('/movements', async (req, res) => {
    try {
        await ensureDbInit();
        const movements = await sql`SELECT * FROM movements ORDER BY fecha DESC`;
        const mapped = movements.map(m => ({
            id: m.id,
            fecha: m.fecha.toLocaleString(),
            productoId: m.producto_id,
            productoNombre: m.producto_nombre,
            tipo: m.tipo,
            cantidad: m.cantidad,
            motivo: m.motivo,
            usuario: m.usuario
        }));
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/movements', async (req, res) => {
    const { id, productoId, productoNombre, tipo, cantidad, motivo, usuario } = req.body;
    try {
        await ensureDbInit();
        await sql`
      INSERT INTO movements (id, producto_id, producto_nombre, tipo, cantidad, motivo, usuario)
      VALUES (${id}, ${productoId}, ${productoNombre}, ${tipo}, ${cantidad}, ${motivo}, ${usuario})
    `;

        if (tipo === 'Entrada') {
            await sql`UPDATE products SET stock_actual = stock_actual + ${cantidad} WHERE id = ${productoId}`;
        } else {
            await sql`UPDATE products SET stock_actual = stock_actual - ${cantidad} WHERE id = ${productoId}`;
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- AUTENTICACIÓN ---
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        await ensureDbInit();
        const users = await sql`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
        if (users.length > 0) {
            const { password, ...userWithoutPassword } = users[0];
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        await ensureDbInit();
        const users = await sql`SELECT id, nombre, email, role, avatar FROM users ORDER BY nombre ASC`;
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users', async (req, res) => {
    const { id, nombre, email, password, role, avatar } = req.body;
    try {
        await ensureDbInit();
        await sql`
      INSERT INTO users (id, nombre, email, password, role, avatar)
      VALUES (${id}, ${nombre}, ${email}, ${password}, ${role}, ${avatar})
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        avatar = EXCLUDED.avatar
    `;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        await ensureDbInit();
        await sql`DELETE FROM users WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/users/:id/role', async (req, res) => {
    const { role } = req.body;
    try {
        await ensureDbInit();
        await sql`UPDATE users SET role = ${role} WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exportar para Vercel Serverless
export default app;
