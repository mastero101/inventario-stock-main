# 🚀 Inicio Rápido - Sistema de Gestión de Inventario

## 📦 Un Solo Ejecutable (Frontend + Backend)

Este sistema funciona con **un solo comando**: `node index.js`

---

## 🎯 Uso Simplificado

### 🔧 Modo Desarrollo

```bash
node index.js
```

o usando npm:

```bash
npm run dev
```

Esto iniciará:
- ✅ Backend API en `http://localhost:3001/api`
- ✅ Frontend con Vite HMR en `http://localhost:3001`
- ✅ Recarga automática al editar código
- ✅ Todo en un solo proceso

**Accede a**: `http://localhost:3001`

---

### 📦 Modo Producción

**Paso 1: Compilar el frontend**
```bash
npm run build
```

**Paso 2: Ejecutar en producción**

Windows:
```bash
npm run start:win
```

Linux/Mac:
```bash
npm run start
```

O todo en un comando:

Windows:
```bash
npm run prod
```

Linux/Mac:
```bash
npm run prod:linux
```

**Accede a**: `http://localhost:3001`

---

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `node index.js` | **Ejecutar todo (desarrollo)** |
| `npm run dev` | Alias de `node index.js` |
| `npm run build` | Compilar frontend para producción |
| `npm run start:win` | Ejecutar en producción (Windows) |
| `npm run start` | Ejecutar en producción (Linux/Mac) |
| `npm run prod` | Build + Start (Windows) |
| `npm run prod:linux` | Build + Start (Linux/Mac) |

---

## 🎬 Primera Instalación

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

### 3️⃣ Ejecutar
```bash
node index.js
```

### 4️⃣ Abrir en el navegador
```
http://localhost:3001
```

---

## 🔍 Cómo Funciona

### Modo Desarrollo (`node index.js`)
El archivo `index.js` hace lo siguiente:
1. ✅ Inicia el servidor Express (Backend)
2. ✅ Integra Vite como middleware (Frontend)
3. ✅ Sirve todo desde el puerto 3001
4. ✅ Habilita Hot Module Replacement (HMR)

**Ventajas**:
- Un solo proceso
- Un solo puerto
- Recarga automática
- Fácil de debuggear

### Modo Producción (`npm run prod`)
1. ✅ Compila el frontend con Vite (`npm run build`)
2. ✅ Inicia Express sirviendo archivos estáticos
3. ✅ Todo optimizado y minificado

**Ventajas**:
- Código optimizado
- Más rápido
- Listo para desplegar

---

## 🚀 Despliegue

### Servidor Local
```bash
# Compilar
npm run build

# Ejecutar
npm run start:win  # Windows
npm run start      # Linux
```

### Servidor Remoto
```bash
# Subir estos archivos:
# - index.js
# - server/
# - dist/ (después de compilar)
# - package.json
# - .env.local

# En el servidor:
npm install --production
NODE_ENV=production node index.js
```

---

## 💡 Diferencias entre Modos

| Característica | Desarrollo | Producción |
|---------------|-----------|------------|
| Comando | `node index.js` | `npm run prod` |
| Puerto | 3001 | 3001 |
| HMR | ✅ Sí | ❌ No |
| Optimización | ❌ No | ✅ Sí |
| Velocidad | Normal | Rápido |
| Tamaño | Grande | Pequeño |

---

## 🐛 Solución de Problemas

### ❌ Error: "Cannot find module 'vite'"
**Solución**: 
```bash
npm install
```

### ❌ Error: "Port 3001 already in use"
**Solución**: 
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <numero_pid> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### ❌ Error: "Cannot GET /" en producción
**Solución**: Compila primero
```bash
npm run build
npm run start:win
```

### ❌ La página no carga
**Solución**: Verifica que el servidor esté corriendo
```bash
# Verificar health check
curl http://localhost:3001/api/health
```

---

## 🎯 Estructura del Proyecto

```
inventario-stock-main/
├── index.js            # ⭐ ARCHIVO PRINCIPAL (ejecuta todo)
├── server/
│   ├── db.js          # Configuración de base de datos
│   └── index.js       # (Ya no se usa, todo está en index.js raíz)
├── components/         # Componentes React
├── services/          # Servicios del frontend
├── dist/              # Frontend compilado (generado)
├── .env.local         # Variables de entorno
├── package.json       # Dependencias y scripts
└── vite.config.ts     # Configuración de Vite
```

---

## ✨ Ventajas de esta Arquitectura

1. **Simplicidad**: Un solo comando para todo
2. **Desarrollo Rápido**: HMR integrado
3. **Fácil Despliegue**: Un solo proceso
4. **Menos Configuración**: No necesitas concurrently ni scripts complejos
5. **Debugging Simple**: Todo en un solo proceso

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que Node.js esté instalado: `node --version`
2. Instala dependencias: `npm install`
3. Verifica `.env.local` existe
4. Revisa los logs en la consola

---

**¡Listo! Ahora solo ejecuta `node index.js` y todo funciona** 🎉
