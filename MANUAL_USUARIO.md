# 📖 Manual de Usuario - Sistema de Gestión de Inventario

## Guía Completa de Uso del Sistema

---

## 🔐 1. Inicio de Sesión

### Acceso al Sistema
1. Abre tu navegador y ve a `http://localhost:5173`
2. Ingresa tu correo electrónico y contraseña
3. Haz clic en "INICIAR SESIÓN"

### Tipos de Usuario
- **ADMIN**: Acceso completo (crear, editar, eliminar productos y usuarios)
- **USER**: Acceso limitado (solo visualizar y registrar movimientos)

---

## 🏠 2. Dashboard (Panel Principal)

### ¿Qué verás?
Al iniciar sesión, verás cuatro tarjetas con estadísticas en tiempo real:

1. **Productos en Stock**: Total de artículos registrados
2. **Alertas Reposición**: Productos con stock crítico (por debajo del mínimo)
3. **Movimientos Hoy**: Transacciones realizadas en el día
4. **Sin Existencias**: Productos con stock en cero

### Actividad Reciente
En la parte inferior del dashboard, se muestra un listado de los últimos movimientos de stock con:
- Nombre del producto
- Tipo de operación (Entrada/Salida)
- Cantidad modificada
- Usuario responsable
- Fecha y hora

### Botón de Actualización
- Haz clic en el ícono de **actualizar** (↻) para refrescar las estadísticas

---

## 📦 3. Inventario Total

### Visualizar Productos
Esta sección muestra una tabla con todos los productos registrados:
- **Código/Ref**: Identificador único del producto
- **Descripción**: Nombre completo del artículo
- **Stock Actual**: Cantidad disponible (con indicador visual de estado)
- **Precio**: Valor unitario en pesos argentinos

### Indicadores de Stock
- 🟢 **Verde**: Stock normal (por encima del mínimo)
- 🔴 **Rojo + "Crítico"**: Stock bajo (igual o menor al mínimo)

### Agregar un Nuevo Producto (Solo ADMIN)
1. Haz clic en el botón **"+ Nuevo Artículo"** (esquina superior derecha)
2. Completa el formulario:
   - **Referencia/Código**: Identificador único (ej: "RES-001")
   - **Precio Unitario**: Valor en pesos (ej: 1500.50)
   - **Descripción del Material**: Nombre completo (ej: "Resma A4 75g")
   - **Umbral Mínimo**: Cantidad mínima antes de alerta (ej: 10)
3. Haz clic en **"CONFIRMAR REGISTRO"**

### Editar un Producto (Solo ADMIN)
1. Pasa el mouse sobre la fila del producto (en escritorio) o toca la fila (en móvil)
2. Aparecerán dos botones:
   - 🔵 **Editar** (ícono de diskette)
   - 🔴 **Eliminar** (ícono de papelera)
3. Haz clic en **Editar**
4. Modifica los campos necesarios
5. Haz clic en **"ACTUALIZAR CAMBIOS"**

### Eliminar un Producto (Solo ADMIN)
1. Haz clic en el botón **Eliminar** (🔴)
2. Confirma la acción en el cuadro de diálogo
3. **⚠️ Advertencia**: Esta acción es irreversible

### Buscar Productos
- Usa el campo de búsqueda en la parte superior
- Escribe el código o nombre del producto
- La tabla se filtrará automáticamente

---

## 📊 4. Movimientos de Stock

### Registrar una Entrada (Ingreso de Mercadería)
1. Haz clic en el botón **"ENTRADA"** (verde, con flecha hacia abajo)
2. Selecciona el producto del menú desplegable
3. Ingresa la cantidad a agregar
4. Escribe el motivo (ej: "Compra a proveedor XYZ")
5. Haz clic en **"REGISTRAR MOVIMIENTO"**
6. El stock se actualizará automáticamente

### Registrar una Salida (Retiro de Mercadería)
1. Haz clic en el botón **"SALIDA"** (rojo, con flecha hacia arriba)
2. Selecciona el producto
3. Ingresa la cantidad a retirar
4. Escribe el motivo (ej: "Entrega a Departamento de RRHH")
5. Haz clic en **"REGISTRAR MOVIMIENTO"**

### Vista Previa del Movimiento
Antes de confirmar, verás una tarjeta de previsualización que muestra:
- **Stock Actual**: Cantidad antes del movimiento
- **Cambio**: Cantidad que se agregará o quitará
- **Stock Resultante**: Cantidad después del movimiento
- **Alerta**: Si el stock quedará por debajo del mínimo

### Validaciones Automáticas
- ❌ No puedes retirar más stock del disponible
- ❌ No puedes ingresar cantidades negativas o cero
- ⚠️ Recibirás una advertencia si el stock queda crítico

---

## 📜 5. Historial Transaccional

### Consultar Movimientos
Esta sección muestra un registro completo de todas las operaciones realizadas:
- **Fecha/Hora**: Momento exacto de la transacción
- **Producto Afectado**: Nombre del artículo
- **Tipo de Operación**: Entrada o Salida
- **Cantidad**: Unidades movidas
- **Responsable**: Usuario que realizó la operación
- **Motivo/Observación**: Justificación del movimiento

### Filtrar Registros
- Usa el campo de búsqueda para filtrar por:
  - Nombre del producto
  - Usuario responsable
  - Motivo de la operación

### Exportar Auditoría
1. Haz clic en **"EXPORTAR AUDITORÍA (CSV)"**
2. Se descargará un archivo Excel con todos los movimientos filtrados
3. El archivo incluye:
   - ID de transacción
   - Fecha y hora
   - Producto
   - Tipo de operación
   - Cantidad
   - Usuario
   - Motivo

### Refrescar Datos
- Haz clic en el ícono de filtro (⚙️) para actualizar la lista

---

## 👥 6. Gestión de Personal (Solo ADMIN)

### Ver Usuarios Registrados
La tabla muestra todos los usuarios del sistema con:
- **Nombre Completo**
- **Correo Electrónico**
- **Permisos** (ADMIN o USER)
- **Avatar** (inicial del nombre)

### Agregar un Nuevo Usuario
1. Haz clic en **"+ DAR DE ALTA AGENTE"**
2. Completa el formulario:
   - **Nombre y Apellido**: Nombre completo del usuario
   - **Correo Electrónico**: Email institucional (ej: juan.perez@chubut.gov.ar)
   - **Contraseña Temporal**: Clave inicial (el usuario debería cambiarla)
   - **Asignación de Rango**: Selecciona ADMIN o AGENTE OPERADOR
3. Haz clic en **"AUTORIZAR ACCESO"**

### Cambiar Permisos de un Usuario
1. Localiza al usuario en la tabla
2. Haz clic en el botón de su rol actual (ADMIN o USER)
3. El sistema cambiará automáticamente entre:
   - **ADMIN** → **USER**
   - **USER** → **ADMIN**

### Eliminar un Usuario
1. Haz clic en el botón **rojo** (papelera) en la columna "Acciones"
2. Confirma la eliminación
3. **⚠️ Advertencia**: El usuario perderá acceso inmediatamente

---

## 🤖 7. Asistente IA (Búsqueda Inteligente)

### ¿Qué es?
Un asistente virtual impulsado por Google Gemini que puede responder preguntas sobre:
- Normativas laborales
- Precios de mercado
- Proveedores locales
- Redacción de documentos técnicos

### Cómo Usarlo
1. Escribe tu consulta en el campo de texto inferior
2. Ejemplos de preguntas:
   - "¿Cuál es el salario mínimo actual en Argentina?"
   - "Proveedores de elementos de seguridad en Chubut"
   - "¿Cómo redactar una nota de pedido formal?"
3. Haz clic en el botón **Enviar** (✈️)
4. El asistente responderá en segundos

### Fuentes Verificadas
- Las respuestas incluyen enlaces a las fuentes consultadas
- Puedes hacer clic en los enlaces para verificar la información

### Ubicación GPS
- El sistema puede usar tu ubicación para búsquedas locales
- Autoriza el acceso a la ubicación cuando el navegador lo solicite

---

## 🎨 8. Estudio Creativo (Generación de Imágenes)

### ¿Qué es?
Un generador de imágenes con IA (Google Imagen 3.0) para crear:
- Banners institucionales
- Infografías
- Material gráfico para presentaciones
- Elementos visuales personalizados

### Generar una Imagen
1. Describe tu idea en el campo de texto:
   - Ejemplo: "Un banner institucional con montañas de Chubut al fondo y elementos de oficina modernos, estilo fotorealista"
2. Selecciona el **Formato/Ratio**:
   - **1:1** (cuadrado) - Para redes sociales
   - **16:9** (horizontal) - Para presentaciones
   - **9:16** (vertical) - Para historias/stories
3. Elige el **Sello de Calidad**:
   - **Estándar** (⚡): Rápido, buena calidad
   - **Premium** (✨): Más lento, máxima calidad
4. Haz clic en **"MATERIALIZAR IMAGEN"**

### Descargar Imágenes
1. Pasa el mouse sobre la imagen generada
2. Aparecerá un botón **"BAJAR ARCHIVO ORIGINAL"**
3. La imagen se descargará en formato PNG

### Galería de Sesión
- Las últimas 4 imágenes generadas se muestran en miniaturas
- Haz clic en una miniatura para verla en grande
- Usa **"Limpiar Todo"** para borrar el historial

---

## 📱 9. Uso en Dispositivos Móviles

### Navegación
- Toca el ícono **☰** (hamburguesa) en la esquina superior izquierda
- Se abrirá el menú lateral
- Selecciona la sección deseada
- El menú se cerrará automáticamente

### Tablas y Listas
- Desliza horizontalmente para ver todas las columnas
- Los botones de acción están siempre visibles en móviles

### Formularios
- Los campos se apilan verticalmente para facilitar la escritura
- Usa el teclado virtual normalmente
- Los modales permiten scroll si son muy largos

---

## ⚙️ 10. Configuración y Preferencias

### Cerrar Sesión
1. Haz clic en tu avatar (letra inicial) en la esquina superior derecha
2. Selecciona **"Cerrar Sesión"**
3. Serás redirigido a la pantalla de login

### Cambiar Contraseña (Próximamente)
Esta funcionalidad estará disponible en una futura actualización.

---

## 🔔 11. Notificaciones y Alertas

### Alertas de Stock Crítico
- Aparecen en el Dashboard con el número de productos afectados
- Los productos críticos se marcan en rojo en el inventario
- Se recomienda revisar diariamente

### Mensajes de Confirmación
- Cada operación exitosa muestra un mensaje verde
- Los errores se muestran en rojo con descripción del problema

---

## 💡 12. Consejos y Mejores Prácticas

### Para Administradores
✅ **Revisa el Dashboard diariamente** para detectar productos críticos  
✅ **Exporta el historial mensualmente** como respaldo  
✅ **Capacita a los usuarios** en el uso correcto del sistema  
✅ **Cambia las contraseñas por defecto** inmediatamente  
✅ **Asigna permisos según necesidad** (principio de mínimo privilegio)

### Para Operadores
✅ **Registra los movimientos inmediatamente** después de realizarlos  
✅ **Escribe motivos claros y descriptivos** en cada transacción  
✅ **Verifica el stock resultante** antes de confirmar  
✅ **Reporta productos críticos** a tu supervisor  
✅ **No compartas tu contraseña** con otros usuarios

### Para Todos
✅ **Cierra sesión** al terminar de usar el sistema  
✅ **Usa descripciones estándar** para facilitar búsquedas  
✅ **Reporta errores** al administrador inmediatamente  
✅ **Mantén actualizado** tu navegador web

---

## ❓ 13. Preguntas Frecuentes (FAQ)

### ¿Puedo usar el sistema sin conexión a internet?
❌ No. El sistema requiere conexión para sincronizar con la base de datos en la nube.

### ¿Los cambios se guardan automáticamente?
✅ Sí. Cada operación se guarda inmediatamente en la base de datos.

### ¿Puedo recuperar un producto eliminado?
❌ No. Las eliminaciones son permanentes. Usa esta función con precaución.

### ¿Cuántos usuarios pueden usar el sistema simultáneamente?
✅ Ilimitados. Múltiples usuarios pueden trabajar al mismo tiempo.

### ¿El sistema funciona en tablets y celulares?
✅ Sí. La interfaz es completamente responsive y se adapta a cualquier dispositivo.

### ¿Cómo puedo ver movimientos de un producto específico?
📋 Ve a "Historial Transaccional" y usa el buscador con el nombre del producto.

### ¿Qué hago si olvidé mi contraseña?
👤 Contacta al administrador del sistema para que la restablezca.

### ¿El Asistente IA tiene acceso a datos del inventario?
❌ No. El asistente solo consulta información pública de internet.

---

## 🆘 14. Soporte y Ayuda

### Si encuentras un problema:
1. **Anota el mensaje de error** exacto que aparece
2. **Captura una pantalla** del problema
3. **Describe los pasos** que realizaste antes del error
4. **Contacta al administrador** con esta información

### Información Útil para Reportar Errores:
- Navegador y versión (ej: Chrome 120)
- Sistema operativo (Windows, Mac, Android, iOS)
- Hora aproximada del error
- Usuario con el que iniciaste sesión

---

## 📞 Contacto

**Administrador del Sistema**: [Insertar contacto]  
**Soporte Técnico**: [Insertar contacto]  
**Secretaría de Trabajo del Chubut**: [Insertar contacto]

---

## 🎓 Capacitación

Se recomienda que todos los usuarios nuevos:
1. Lean este manual completo
2. Practiquen con datos de prueba
3. Asistan a la capacitación presencial (si está disponible)
4. Consulten dudas antes de operar con datos reales

---

**¡Gracias por usar el Sistema de Gestión de Inventario!**

Este sistema fue diseñado para optimizar el control de suministros y facilitar la gestión administrativa de la Secretaría de Trabajo del Chubut.

---

**Última actualización**: Febrero 2026  
**Versión del Manual**: 1.0.0  
**Desarrollado para**: Gobierno del Chubut
