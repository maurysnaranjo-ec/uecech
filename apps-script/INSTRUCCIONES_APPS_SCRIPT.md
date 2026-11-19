# Conectar el login con Google Sheets (Apps Script)

1. Crea una hoja de cálculo nueva en Google Sheets (por ejemplo “Usuarios Portal UE Chiriboga”).
2. Menú Extensiones → Apps Script. Borra lo que haya y pega el contenido de `Codigo.gs`. Guarda.
3. Vuelve a la hoja y recarga la página: aparecerá el menú **Portal**.
4. Portal → **1. Instalar / reparar hoja** (autoriza los permisos). Crea la hoja “Usuarios” con 3 usuarios de prueba.
5. Cambia las contraseñas: escribe la nueva en la columna B y usa Portal → **2. Procesar claves nuevas**.
   Para agregar más personas usa Portal → **Agregar usuario** o escribe filas nuevas (usuario, clave_nueva, rol, nombre, activo = SI).
6. En Apps Script: Implementar → Nueva implementación → tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   Copia la URL que termina en `/exec`.
7. En `index.html`, pega esa URL en `const URL_VALIDACION = "";` y sube el archivo a GitHub.

Si cambias `Codigo.gs` más adelante: Implementar → Administrar implementaciones → editar → Nueva versión.
