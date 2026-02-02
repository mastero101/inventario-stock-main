# 📦 Sistema de Gestión de Inventario - Secretaría de Trabajo del Chubut

## 🚀 Guía de Instalación y Configuración

Este documento contiene las instrucciones completas para instalar y ejecutar el Sistema de Gestión de Inventario en tu máquina local.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

### 1. **Node.js** (versión 18 o superior)
   - **Descargar**: [https://nodejs.org/](https://nodejs.org/)
   - **Verificar instalación**: Abre una terminal/consola y ejecuta:
     ```bash
     node --version
     npm --version
     ```
   - Deberías ver las versiones instaladas (ejemplo: `v18.17.0` y `9.6.7`)

### 2. **Git** (opcional, pero recomendado)
   - **Descargar**: [https://git-scm.com/](https://git-scm.com/)
   - **Verificar instalación**:
     ```bash
     git --version
     ```

### 3. **Editor de Código** (recomendado)
   - **Visual Studio Code**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - O cualquier editor de tu preferencia

---

## 📥 Paso 1: Obtener el Código del Proyecto

### Opción A: Clonar con Git (recomendado)
```bash
git clone <URL_DEL_REPOSITORIO>
cd inventario-stock-main
```

### Opción B: Descargar ZIP
1. Descarga el archivo ZIP del proyecto
2. Extrae el contenido en una carpeta de tu elección
3. Abre una terminal en esa carpeta

---

## 🔧 Paso 2: Instalar Dependencias

Dentro de la carpeta del proyecto, ejecuta:

```bash
npm install
```

Este comando descargará e instalará todas las bibliotecas necesarias (React, Express, Neon Database, etc.). El proceso puede tardar 2-5 minutos dependiendo de tu conexión a internet.

**Nota**: Si aparecen advertencias (warnings) en amarillo, puedes ignorarlas. Solo preocúpate si ves errores en rojo.

---

## 🔐 Paso 3: Configurar Variables de Entorno

El proyecto requiere un archivo `.env.local` con las credenciales de conexión a la base de datos y servicios externos.

### Crear el archivo `.env.local`:

1. En la raíz del proyecto, crea un archivo llamado `.env.local`
2. Copia el siguiente contenido:

```env
GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
DATABASE_URL=TU_URL_DE_CONEXION_POSTGRESQL
```

### Obtener las Credenciales:

#### 🔹 DATABASE_URL (Obligatorio)
**Contacta al administrador del sistema** para obtener la URL de conexión a la base de datos PostgreSQL.

La URL tiene el siguiente formato:
```
postgres://usuario:contraseña@host:puerto/nombre_base_datos?sslmode=require
```

**Ejemplo** (NO usar en producción):
```
postgres://miusuario:mipassword@localhost:5432/inventario?sslmode=require
```

#### 🔹 GEMINI_API_KEY (Opcional)
Solo necesaria si vas a usar las funciones de IA (Asistente y Estudio Creativo).

Para obtener tu API Key:
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Cópiala y pégala en el archivo `.env.local`

### ⚠️ IMPORTANTE - Seguridad:
- ❌ **NUNCA** compartas el archivo `.env.local` públicamente
- ❌ **NUNCA** subas este archivo a GitHub o repositorios públicos
- ❌ **NUNCA** incluyas credenciales en capturas de pantalla
- ✅ El archivo ya está incluido en `.gitignore` para evitar commits accidentales
- ✅ Cada desarrollador debe tener su propio archivo `.env.local`
- ✅ En producción, usa variables de entorno del servidor (no archivos)

---

## ▶️ Paso 4: Iniciar el Sistema

### 🎯 Opción 1: Script de Inicio Interactivo (Más Fácil)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

El script te permitirá elegir:
1. **Modo Desarrollo** - Frontend y Backend separados con hot-reload
2. **Modo Producción** - Ejecutable único optimizado
3. **Solo Compilar** - Generar archivos de producción

### 🔧 Opción 2: Modo Desarrollo (Recomendado para programar)

```bash
npm run dev:all
```

Este comando iniciará:
- **Backend (API)** en `http://localhost:3001`
- **Frontend (Interfaz)** en `http://localhost:5173`

**Ventajas**: Recarga automática al editar código, mensajes de error detallados.

### 📦 Opción 3: Modo Producción (Ejecutable Único)

**Windows:**
```bash
npm run prod
```

**Linux/Mac:**
```bash
npm run prod:linux
```

Este comando:
1. Compilará el frontend (React + TypeScript)
2. Iniciará el servidor Express
3. Servirá frontend y backend desde `http://localhost:3001`

**Ventajas**: Un solo puerto, un solo proceso, optimizado y rápido.

---

## 🌐 Paso 5: Acceder al Sistema

### En Modo Desarrollo:
1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Navega a: **`http://localhost:5173`**
3. Deberías ver la pantalla de inicio de sesión

### En Modo Producción:
1. Abre tu navegador web
2. Navega a: **`http://localhost:3001`**
3. Deberías ver la pantalla de inicio de sesión

### 👤 Credenciales de Acceso por Defecto

**Usuario Administrador:**
- **Email**: `admin@chubut.gov.ar`
- **Contraseña**: `admin123`

**Usuario Operador:**
- **Email**: `operador@chubut.gov.ar`
- **Contraseña**: `operador123`

---

## 🛠️ Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia solo el frontend (Vite dev server) |
| `npm run server` | Inicia solo el backend (Express API) |
| `npm run dev:all` | **Modo desarrollo: Frontend + Backend** |
| `npm run build` | Genera la versión de producción del frontend |
| `npm run prod` | **Modo producción: Compila + Ejecuta todo (Windows)** |
| `npm run prod:linux` | **Modo producción: Compila + Ejecuta todo (Linux/Mac)** |
| `npm run start:win` | Ejecuta en modo producción (Windows, requiere build previo) |
| `npm run start` | Ejecuta en modo producción (Linux/Mac, requiere build previo) |
| `npm run preview` | Previsualiza la versión de producción |

---

## 📱 Características del Sistema

### Módulos Principales:
1. **Dashboard** - Panel de control con estadísticas en tiempo real
2. **Inventario Total** - Gestión completa de productos (CRUD)
3. **Movimientos de Stock** - Registro de entradas y salidas
4. **Historial Transaccional** - Auditoría de todas las operaciones
5. **Gestión de Personal** - Administración de usuarios y permisos
6. **Asistente IA** - Búsqueda inteligente con Google Gemini
7. **Estudio Creativo** - Generación de imágenes con IA

### Tecnologías Utilizadas:
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Base de Datos**: PostgreSQL (Neon Database)
- **IA**: Google Gemini API
- **Build Tool**: Vite

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Cannot find module"
**Solución**: Ejecuta nuevamente `npm install`

### ❌ Error: "Port 3001 is already in use"
**Solución**: Cierra cualquier aplicación que esté usando el puerto 3001
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <numero_pid> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### ❌ Error: "Database connection failed"
**Solución**: Verifica que el archivo `.env.local` existe y contiene la URL correcta de la base de datos

### ❌ Error: "Cannot GET /" en modo producción
**Solución**: Asegúrate de haber compilado el frontend primero
```bash
npm run build
npm run start:win  # Windows
# o
npm run start      # Linux/Mac
```

### ❌ La página no carga en el navegador
**Solución**: 
1. Verifica que el servicio esté corriendo
2. Revisa la consola de la terminal en busca de errores
3. En modo desarrollo, accede a `http://localhost:5173`
4. En modo producción, accede a `http://localhost:3001`
5. Verifica el health check: `http://localhost:3001/api/health`

### ❌ Error: "npm: command not found"
**Solución**: Node.js no está instalado correctamente. Descárgalo desde [nodejs.org](https://nodejs.org/)

---

## 🔄 Actualizar el Sistema

Si recibes una nueva versión del código:

```bash
# Detén los servicios (Ctrl + C en la terminal)
git pull origin main  # Si usas Git
npm install           # Instalar nuevas dependencias
npm run dev:all       # Reiniciar el sistema
```

---

## 🚪 Detener el Sistema

Para detener los servicios:
1. Ve a la terminal donde está corriendo el sistema
2. Presiona `Ctrl + C` (Windows/Linux) o `Cmd + C` (Mac)
3. Confirma la detención si se solicita

---

## 📞 Soporte Técnico

Si encuentras problemas que no puedes resolver:

1. **Revisa los logs** en la terminal para identificar el error exacto
2. **Verifica la configuración** del archivo `.env.local`
3. **Contacta al administrador del sistema** con una captura de pantalla del error

---

## 🔒 Seguridad y Mejores Prácticas

### ✅ Recomendaciones:
- **Cambia las contraseñas por defecto** después del primer inicio de sesión
- **No expongas** el puerto 3000 a internet sin configurar un firewall
- **Realiza backups** periódicos de la base de datos
- **Mantén actualizado** Node.js y las dependencias del proyecto

### ⚠️ Advertencias:
- El archivo `.env.local` contiene información sensible
- No subas este archivo a repositorios públicos
- Usa HTTPS en producción (no HTTP)

---

## 📚 Estructura del Proyecto

```
inventario-stock-main/
├── components/          # Componentes React (UI)
├── services/           # Lógica de negocio y APIs
├── server/             # Backend Express
│   ├── index.js        # Servidor principal
│   └── db.js           # Configuración de base de datos
├── .env.local          # Variables de entorno (NO SUBIR A GIT)
├── package.json        # Dependencias del proyecto
├── vite.config.ts      # Configuración de Vite
└── README.md           # Documentación básica
```

---

## 🎓 Primeros Pasos Después de la Instalación

1. **Explora el Dashboard** para familiarizarte con la interfaz
2. **Crea un producto de prueba** en "Inventario Total"
3. **Registra un movimiento** de entrada o salida
4. **Revisa el historial** para ver la auditoría
5. **Crea un nuevo usuario** desde "Gestión de Personal"

---

## 🌟 ¡Listo para Usar!

El sistema está completamente funcional y listo para gestionar el inventario de la Secretaría de Trabajo. Todas las operaciones se sincronizan automáticamente con la base de datos en la nube.

**¡Bienvenido al Sistema de Gestión Institucional!** 🚀

---

**Última actualización**: Febrero 2026  
**Versión del Sistema**: 1.0.0  
**Desarrollado para**: Gobierno del Chubut - Secretaría de Trabajo
