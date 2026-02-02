<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 📦 Sistema de Gestión de Inventario
## Secretaría de Trabajo del Chubut

Sistema web moderno para la gestión integral de inventario, movimientos de stock, personal y análisis con IA.

**✨ Un solo comando para ejecutar todo: `node index.js`**

---

## 🚀 Inicio Rápido

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Configurar variables de entorno
Crea el archivo `.env.local`:
```env
GEMINI_API_KEY=tu_api_key_aqui
DATABASE_URL=tu_url_postgresql_aqui
```

### 3️⃣ Ejecutar la aplicación

**Desarrollo (con HMR):**
```bash
node index.js
```

**Producción:**
```bash
npm run prod
```

Accede a: `http://localhost:3001`

---

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `node index.js` | **Ejecutar todo (desarrollo)** |
| `npm run dev` | Alias de `node index.js` |
| `npm run build` | Compilar frontend |
| `npm run prod` | Build + Start (Windows) |
| `npm run prod:linux` | Build + Start (Linux/Mac) |

---

## 🎯 Características

- ✅ **Un Solo Ejecutable**: `node index.js` ejecuta frontend y backend
- ✅ **Vite Integrado**: HMR en desarrollo sin procesos separados
- ✅ **Dashboard en Tiempo Real**: Estadísticas y métricas actualizadas
- ✅ **Gestión de Inventario**: CRUD completo de productos
- ✅ **Control de Stock**: Registro de entradas y salidas
- ✅ **Historial Transaccional**: Auditoría completa
- ✅ **Gestión de Personal**: Usuarios y permisos
- ✅ **Asistente IA**: Búsqueda inteligente con Google Gemini
- ✅ **PWA**: Instalable como aplicación

---

## 🔐 Credenciales por Defecto

**Administrador:**
- Email: `admin@chubut.gov.ar`
- Contraseña: `admin123`

**Operador:**
- Email: `operador@chubut.gov.ar`
- Contraseña: `operador123`

---

## 🛠️ Arquitectura

```
┌─────────────────────────────────────┐
│         node index.js               │
│  ┌───────────────────────────────┐  │
│  │  Express Server (Backend)     │  │
│  │  - API REST en /api/*         │  │
│  │  - Puerto 3001                │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  Vite Middleware (Frontend)   │  │
│  │  - React + TypeScript         │  │
│  │  - HMR en desarrollo          │  │
│  │  - Archivos estáticos en prod │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Ventajas:**
- Un solo proceso
- Un solo puerto (3001)
- Fácil de debuggear
- Simple de desplegar

---

## 📚 Documentación

- 📖 [**Inicio Rápido**](INICIO_RAPIDO.md) - Guía de ejecución
- 📖 [**Instrucciones de Instalación**](INSTRUCCIONES_INSTALACION.md) - Instalación completa
- 📖 [**Manual de Usuario**](MANUAL_USUARIO.md) - Guía de uso del sistema

---

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Base de Datos**: PostgreSQL (Neon Database)
- **IA**: Google Gemini API
- **Build**: Vite (integrado como middleware)

---

## 📞 Soporte

Para problemas o consultas, revisa la [documentación completa](INSTRUCCIONES_INSTALACION.md) o contacta al administrador del sistema.

---

**Desarrollado para**: Gobierno del Chubut - Secretaría de Trabajo  
**Versión**: 1.0.0  
**Última actualización**: Febrero 2026
