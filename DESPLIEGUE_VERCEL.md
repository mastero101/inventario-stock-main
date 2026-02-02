# 🚀 Despliegue en Vercel

## ⚠️ Importante: Limitaciones de Vercel

Vercel está diseñado para **funciones serverless**, no para servidores Node.js persistentes. Por eso hemos adaptado el proyecto:

- ✅ **Frontend**: Se despliega como sitio estático (carpeta `dist/`)
- ✅ **Backend**: Se convierte en funciones serverless (carpeta `api/`)
- ⚠️ **No hay servidor persistente**: Cada petición API es una función independiente

---

## 📋 Pasos para Desplegar

### 1️⃣ Configurar Variables de Entorno en Vercel

Antes de desplegar, necesitas configurar las variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega las siguientes variables:

```
GEMINI_API_KEY=tu_api_key_aqui
DATABASE_URL=tu_url_postgresql_aqui
```

### 2️⃣ Desplegar desde la Terminal

```bash
vercel --prod
```

O si es la primera vez:

```bash
vercel
```

### 3️⃣ Desplegar desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Conecta el repositorio en Vercel
3. Vercel desplegará automáticamente en cada push

---

## 📁 Estructura para Vercel

```
inventario-stock-main/
├── api/
│   └── index.js          # ⭐ Backend como serverless function
├── dist/                 # Frontend compilado (generado por build)
├── server/
│   └── db.js            # Configuración de DB (usado por api/index.js)
├── components/          # Componentes React
├── services/           # Servicios del frontend
├── vercel.json         # ⭐ Configuración de Vercel
└── package.json        # Scripts y dependencias
```

---

## 🔧 Archivos Creados para Vercel

### 1. `vercel.json`
Configuración de rutas y builds:
- `/api/*` → Funciones serverless en `api/index.js`
- `/*` → Archivos estáticos en `dist/`

### 2. `api/index.js`
Backend convertido a función serverless de Vercel.

### 3. Script `vercel-build` en `package.json`
Ejecuta `vite build` durante el despliegue.

---

## 🌐 URLs después del Despliegue

Vercel te dará una URL como:
```
https://inventario-stock-main.vercel.app
```

- **Frontend**: `https://tu-proyecto.vercel.app`
- **API**: `https://tu-proyecto.vercel.app/api/products`
- **Health Check**: `https://tu-proyecto.vercel.app/api/health`

---

## ⚙️ Cómo Funciona en Vercel

### Desarrollo Local (node index.js)
```
┌─────────────────────────┐
│   Servidor Persistente  │
│   - Express + Vite      │
│   - Puerto 3001         │
└─────────────────────────┘
```

### Producción en Vercel
```
┌─────────────────────────────────┐
│  Frontend (Sitio Estático)      │
│  - Archivos en dist/            │
│  - CDN de Vercel                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  Backend (Serverless Functions) │
│  - api/index.js                 │
│  - Se ejecuta por petición      │
└─────────────────────────────────┘
```

---

## 🐛 Solución de Problemas

### ❌ Error: "EPIPE" al ejecutar vercel
**Causa**: Error temporal de Vercel CLI  
**Solución**: 
```bash
# Intenta de nuevo
vercel --prod

# O actualiza Vercel CLI
npm i -g vercel@latest
```

### ❌ Error: "Database connection failed"
**Solución**: Verifica que las variables de entorno estén configuradas en Vercel Dashboard

### ❌ Error: "Cannot find module"
**Solución**: Asegúrate de que todas las dependencias estén en `dependencies` (no en `devDependencies`)

### ❌ La página carga pero la API no funciona
**Solución**: 
1. Verifica que `/api/health` responda
2. Revisa los logs en Vercel Dashboard
3. Verifica las variables de entorno

---

## 🔄 Alternativas a Vercel

Si Vercel no funciona bien para tu caso, considera:

### 1. **Railway** (Recomendado para Node.js)
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Desplegar
railway login
railway init
railway up
```
✅ Soporta servidores persistentes  
✅ Fácil de usar  
✅ Plan gratuito disponible

### 2. **Render**
✅ Soporta Node.js nativo  
✅ PostgreSQL incluido  
✅ Plan gratuito

### 3. **Fly.io**
✅ Excelente para Node.js  
✅ Múltiples regiones  
✅ Plan gratuito

---

## 📊 Comparación de Plataformas

| Plataforma | Node.js Persistente | Serverless | Gratis | Recomendado |
|------------|---------------------|------------|--------|-------------|
| **Vercel** | ❌ No | ✅ Sí | ✅ Sí | Frontend |
| **Railway** | ✅ Sí | ❌ No | ✅ Sí | ⭐ Backend |
| **Render** | ✅ Sí | ❌ No | ✅ Sí | ⭐ Fullstack |
| **Fly.io** | ✅ Sí | ❌ No | ✅ Sí | Backend |

---

## 💡 Recomendación

Para este proyecto, te recomiendo:

**Opción A: Todo en Railway**
```bash
railway up
```
Más simple, soporta `node index.js` directamente.

**Opción B: Frontend en Vercel + Backend en Railway**
- Frontend: Vercel (rápido, CDN global)
- Backend: Railway (servidor persistente)

**Opción C: Todo en Vercel (Actual)**
- Funciona, pero con limitaciones serverless
- Cada petición API es una función nueva

---

## 🚀 Próximos Pasos

1. **Configurar variables de entorno** en Vercel Dashboard
2. **Ejecutar** `vercel --prod`
3. **Verificar** que funcione en la URL de Vercel
4. Si hay problemas, considera **Railway** o **Render**

---

**¿Quieres que te ayude a configurar Railway en su lugar?** Es más adecuado para este tipo de aplicación Node.js.
