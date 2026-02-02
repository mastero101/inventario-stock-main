import express from 'express';
import cors from 'cors';
import { sql, initDb } from './server/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const isDevelopment = process.env.NODE_ENV !== 'production';

app.use(cors());
app.use(express.json());

// Inicializar DB al arrancar
initDb();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- PRODUCTOS ---
app.get('/api/products', async (req, res) => {
    try {
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

app.post('/api/products', async (req, res) => {
    const { id, codigo, nombre, stockActual, stockMinimo, precio } = req.body;
    try {
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

app.delete('/api/products/:id', async (req, res) => {
    try {
        await sql`DELETE FROM products WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- MOVIMIENTOS ---
app.get('/api/movements', async (req, res) => {
    try {
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

app.post('/api/movements', async (req, res) => {
    const { id, productoId, productoNombre, tipo, cantidad, motivo, usuario } = req.body;
    try {
        // Registrar movimiento
        await sql`
      INSERT INTO movements (id, producto_id, producto_nombre, tipo, cantidad, motivo, usuario)
      VALUES (${id}, ${productoId}, ${productoNombre}, ${tipo}, ${cantidad}, ${motivo}, ${usuario})
    `;

        // Actualizar stock
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
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
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

app.get('/api/users', async (req, res) => {
    try {
        const users = await sql`SELECT id, nombre, email, role, avatar FROM users ORDER BY nombre ASC`;
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { id, nombre, email, password, role, avatar } = req.body;
    try {
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

app.delete('/api/users/:id', async (req, res) => {
    try {
        await sql`DELETE FROM users WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/users/:id/role', async (req, res) => {
    const { role } = req.body;
    try {
        await sql`UPDATE users SET role = ${role} WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Configurar Vite o archivos estáticos según el modo
async function startServer() {
    if (isDevelopment) {
        // Modo desarrollo: Integrar Vite middleware
        console.log('🔧 Iniciando en modo DESARROLLO...\n');

        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa'
        });

        // Usar middleware de Vite
        app.use(vite.middlewares);

        console.log('✅ Vite dev server integrado');
    } else {
        // Modo producción: Servir archivos estáticos
        console.log('📦 Iniciando en modo PRODUCCIÓN...\n');

        const distPath = path.join(__dirname, 'dist');

        // Servir archivos estáticos
        app.use(express.static(distPath));

        // Manejar rutas SPA - todas las rutas no-API devuelven index.html
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });

        console.log(`✅ Sirviendo frontend desde: ${distPath}`);
    }

    app.listen(port, () => {
        console.log('\n' + '='.repeat(50));
        console.log('🚀 SISTEMA DE GESTIÓN DE INVENTARIO');
        console.log('   Secretaría de Trabajo del Chubut');
        console.log('='.repeat(50));
        console.log(`\n📡 Backend API: http://localhost:${port}/api`);
        console.log(`🌐 Frontend: http://localhost:${port}`);

        if (isDevelopment) {
            console.log(`\n🔧 Modo: DESARROLLO`);
            console.log(`   ✓ Hot Module Replacement (HMR) activo`);
            console.log(`   ✓ Recarga automática habilitada`);
        } else {
            console.log(`\n📦 Modo: PRODUCCIÓN`);
            console.log(`   ✓ Código optimizado y minificado`);
            console.log(`   ✓ Frontend y Backend unificados`);
        }

        console.log(`\n✅ Servidor listo en http://localhost:${port}`);
        console.log('='.repeat(50) + '\n');
    });
}

// Iniciar el servidor
startServer().catch(err => {
    console.error('❌ Error al iniciar el servidor:', err);
    process.exit(1);
});
