# Portal institucional · U.E. “Cap. Edmundo Chiriboga.”

## Estructura
- `index.html`: página principal con acceso por perfil (Docente, Estudiante, Administración)
- `indice.html`: índice de todos los apartados del sitio, con menú horizontal en cascada y buscador
- `guard.js`: protege las páginas internas (se agrega en el `<head>` de cada una)
- `LOGO_2024-2025.png` y `UECECH.jpeg`: escudo e imagen institucional
- `docente/`, `estudiante/`, `administracion/`: una página por apartado (por llenar)
- `apps-script/`: `Codigo.gs` e instrucciones para validar usuarios con Google Sheets

## Publicar en GitHub Pages
1. Sube todo el contenido de esta carpeta a la raíz de un repositorio (arrastra los archivos y carpetas, no el ZIP).
2. En el repositorio: Settings → Pages → Source: “Deploy from a branch” → rama `main`, carpeta `/ (root)`.
3. En 1 o 2 minutos el portal quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`.

## Login con Google Sheets
Sigue `apps-script/INSTRUCCIONES_APPS_SCRIPT.md` y pega la URL `/exec` en `URL_VALIDACION` dentro de `index.html`.
Los archivos del repositorio son públicos: el login ordena el acceso, pero no protege información sensible.
