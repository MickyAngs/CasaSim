# CASASIM - HOJA DE RUTA Y ARQUITECTURA

## PROPÓSITO DEL PROYECTO
CasaSim es una plataforma tecnológica avanzada diseñada para transformar la planificación y ejecución de proyectos de vivienda social en el Perú mediante la simulación y análisis de Métodos Modernos de Construcción (MMC).

## ESTADO ACTUAL (v1.0.0 Beta)
- **Frontend**: React + TypeScript + Vite.
- **Estilos**: Tailwind CSS.
- **Autenticación**: LocalAuth (simulación local).
- **Backend (Worker)**: Hono (Cloudflare Workers, actualmente simulado).
- **Dependencias Críticas**: `getmocha` y `mocha-cdn` (DEBEN SER ELIMINADAS).

---

## FASE 1: MIGRACIÓN DE INFRAESTRUCTURA (Prioridad: Alta)
**Objetivo**: Eliminar dependencias externas y asegurar la soberanía de los datos.

### Tareas:
1.  **Auditoría de Assets**: Identificar todas las URLs hardcodeadas (`mocha-cdn`, `getmocha`).
2.  **Migración de Assets**:
    -   Script `scripts/migrate_assets.cjs` (YA CREADO) para descargar assets.
    -   Subida manual o automática a Firebase Storage (`gs://casasim-assets`).
    -   Generación de `assets_map.json`.
3.  **Configuración de CORS**: Permitir peticiones desde `*` en Firebase Storage para WebGL/ModelViewer.
4.  **Refactorización de Código**:
    -   Crear utilidad `src/utils/getAssetUrl.ts`.
    -   Reemplazar strings hardcodeados por llamadas a esta utilidad.

---

## FASE 2: REALIDAD AUMENTADA "WOW" (Prioridad: Alta)
**Objetivo**: Implementar visualización profesional en AR para impresionar a los usuarios.

### Tareas:
1.  **Componente ARViewer**:
    -   Ubicación: `src/components/ARViewer.tsx`.
    -   Tecnología: `@google/model-viewer`.
    -   Atributos: `ar`, `ar-modes="webxr scene-viewer quick-look"`, `camera-controls`.
    -   Soporte: `.glb` (Android/Web) y `.usdz` (iOS opcional).
2.  **UI/UX**:
    -   Botón "Ver en mi espacio" (FAB) con estilo Glassmorphism.
    -   Icono 3D inyectado vía `slot="ar-button"`.
    -   Manejo de errores y estados de carga (Lazy Loading).

---

## FASE 3: MADUREZ Y CI/CD (Prioridad: Media)
**Objetivo**: Código mantenible, seguro y despliegue automatizado.

### Tareas:
1.  **Refactorización a TypeScript Estricto**:
    -   Renombrar componentes `.js`/`.jsx` a `.tsx`.
    -   Definir interfaces estrictas para modelos de datos (`ConstructionSystem`, `CostMetrics`).
    -   Eliminar `any`.
2.  **Pipeline de Despliegue (CI/CD)**:
    -   Workflow: `.github/workflows/deploy.yml`.
    -   Trigger: Push a `main`.
    -   Steps: Build (`npm run build`) -> Deploy to Firebase Hosting.
