# Portal institucional · U.E. “Cap. Edmundo Chiriboga.”

Página principal con acceso por perfil (Docente, Estudiante, Administración).

## Estructura
- `index.html`: página principal y login
- `guard.js`: protege las páginas internas
- `LOGO_2024-2025.png`: escudo institucional
- `docente/`, `estudiante/`, `administracion/`: una página por apartado

## Publicar en GitHub Pages
1. Sube todo el contenido de esta carpeta a un repositorio.
2. En el repositorio: Settings → Pages → Source: “Deploy from a branch” → rama `main`, carpeta `/ (root)`.
3. Espera 1 o 2 minutos: el portal quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`.

## Usuarios
Se definen en la lista `USUARIOS` de `index.html` (solo guarda el hash SHA-256 de la clave).
Usuarios de prueba: docente / Docente2026, estudiante / Estudiante2026, admin / Admin2026. Cámbialos antes de publicar.
Para crear un hash nuevo, abre la consola del navegador en el portal y ejecuta `await sha256("clave")`.

Nota: el login es solo del lado del navegador; no protege información sensible.
