# Transporte Ecológico Compás — Presentación Interactiva

Sitio web estático para la presentación del proyecto **Transporte Ecológico Compás**, servicio de movilidad sostenible, accesible e inclusivo para el **Carnaval de Santa Cruz de Tenerife**.

![Logo Compás](https://github.com/user-attachments/assets/8689e5c6-91f1-4379-814c-582bf1c24546)

---

## Contenido del proyecto

| Archivo/Directorio | Descripción |
|--------------------|-------------|
| `index.html` | Sitio web interactivo principal |
| `css/style.css` | Estilos (paleta azul marino/azul corporativo del logotipo) |
| `js/main.js` | Lógica interactiva: búsqueda, navegación, acordeones |
| `source/312.txt` | Fuente documental completa del proyecto |
| `assets/` | Recursos gráficos locales |
| `.nojekyll` | Desactiva el procesado Jekyll en GitHub Pages |

### Secciones del documento

1. Concepto del proyecto  
2. Sistema de reservas y gestión  
3. Operativa durante el Carnaval  
4. Rutas principales y puntos de recogida  
5. Flota y sostenibilidad  
6. Capacidad estimada y beneficios  
7. Encuesta de satisfacción  
8. Carta de Servicios  
9. Garantías del servicio  
10. Reclamaciones y sugerencias  
11. Presupuesto estimado  
12. Análisis de mercado, DAFO y Lean Canvas  
13. Plan operativo  
14. Plan de sostenibilidad  
15. Sección en alemán (para visitantes germanófonos)  
16. Memoria de Sostenibilidad  

---

## Cómo ejecutar localmente

No se requiere ningún servidor ni herramienta de compilación. El sitio es HTML/CSS/JS puro.

### Opción 1 — Abrir directamente en el navegador

```bash
# Clona el repositorio
git clone https://github.com/Nemnok/PROJECT-PRESENTACION.git
cd PROJECT-PRESENTACION

# Abre en el navegador (cualquier sistema operativo)
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

### Opción 2 — Servidor local con Python (recomendado para evitar restricciones CORS)

```bash
# Python 3
python3 -m http.server 8080
# Luego abre http://localhost:8080
```

### Opción 3 — Extensión Live Server (VS Code)

Instala la extensión **Live Server** y haz clic en *Go Live* en la barra de estado inferior.

---

## Despliegue en GitHub Pages

El repositorio incluye `.nojekyll` para evitar el procesado Jekyll y asegurar compatibilidad total.

### Pasos

1. Ve a **Settings → Pages** en el repositorio.
2. En *Source*, selecciona la rama principal (p. ej. `main`) y la carpeta raíz (`/`).
3. Haz clic en **Save**.
4. El sitio estará disponible en `https://nemnok.github.io/PROJECT-PRESENTACION/`.

### Logo en producción

El logotipo se sirve directamente desde la CDN de GitHub (`github.com/user-attachments`), que es pública y permanente. No se requiere ningún paso adicional.

Si en algún momento deseas alojar el logo dentro del repositorio:

```bash
# Descarga el logo y guárdalo en assets/
curl -L "https://github.com/user-attachments/assets/8689e5c6-91f1-4379-814c-582bf1c24546" \
     -o assets/Logo.png

# En index.html, sustituye la URL de la CDN por la ruta relativa:
# src="https://github.com/user-attachments/..." → src="assets/Logo.png"
```

---

## Funcionalidades del sitio

| Función | Descripción |
|---------|-------------|
| **Búsqueda cliente** | Busca en todo el documento en tiempo real (atajo `Ctrl+K`) |
| **Índice lateral** | Navegación por las 16 secciones con submenús desplegables |
| **Sección activa** | IntersectionObserver resalta la sección visible en el índice |
| **Encuesta interactiva** | Formulario de satisfacción con estrellas y rango |
| **Hoja de reclamaciones** | Formulario completo de reclamaciones/sugerencias |
| **Diseño adaptativo** | Responsive para móvil, tablet y escritorio |
| **Modo oscuro** | Adaptación automática con `prefers-color-scheme: dark` |
| **Accesibilidad** | Skip link, roles ARIA, jerarquía de encabezados, contraste AA |
| **Impresión** | Estilos `@media print` optimizados |
| **Multilingüe** | Sección 15 completamente en alemán (`lang="de"`) |

---

## Tecnologías utilizadas

- **HTML5** semántico
- **CSS3** (variables, grid, flexbox, media queries, dark mode)
- **JavaScript** vanilla (sin frameworks externos)

Compatible con todos los navegadores modernos. No requiere Node.js, npm ni ningún proceso de compilación.
