# CasaSim v2.0 - Plataforma de Simulación de Vivienda Social

CasaSim es una plataforma tecnológica avanzada diseñada para transformar la planificación y ejecución de proyectos de vivienda social mediante la simulación y análisis de Métodos Modernos de Construcción (MMC).

![Estado del Proyecto](https://img.shields.io/badge/Estado-Producci%C3%B3n-green)
![Tecnología](https://img.shields.io/badge/React-Vite-blue)
![Backend](https://img.shields.io/badge/Firebase-Serverless-orange)

## 🚀 Características Clave

- **Simulación Avanzada**: Motor de cálculo preciso para costos directos, tiempos de ejecución y optimización de materiales.
- **Visualización 3D & Realidad Aumentada**: 
  - Visor AR integrado con `@google/model-viewer`.
  - Soporte para visualización en espacio real (WebXR).
  - Carga optimizada de activos desde Firebase Storage.
- **Optimización Sostenible**: Cálculo de huella de carbono, eficiencia energética y reducción de horas-hombre.
- **Infraestructura Robusta**: 
  - Autenticación segura.
  - Almacenamiento en la nube escalable.
  - Despliegue automatizado (CI/CD).

## 🛠 Guía de Instalación

### Prerrequisitos
- Node.js v18+
- NPM v9+

### Pasos

1. **Clonar el repositorio**:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd CasaSim
   ```

2. **Instalar dependencias**:
   ```bash
   npm ci --legacy-peer-deps
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=casasim-app
   VITE_FIREBASE_STORAGE_BUCKET=casasim-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## 📦 Despliegue Automatizado (CI/CD)

El proyecto cuenta con un pipeline de integración continua configurado en GitHub Actions (`.github/workflows/deploy.yml`).

**Flujo de trabajo:**
1. Al hacer `push` o `merge` a la rama `main`.
2. GitHub Actions inicia el job de construcción.
3. Se instalan dependencias y se ejecuta el build de producción (`npm run build`).
4. Se despliega automáticamente a Firebase Hosting.

### Configuración de Secretos en GitHub
Para que el despliegue funcione, debes configurar los siguientes **Repository Secrets** en GitHub:

- `FIREBASE_SERVICE_ACCOUNT`: El JSON completo de tu cuenta de servicio de Firebase (descárgalo desde la consola de Google Cloud).
- `VITE_FIREBASE_API_KEY`, etc.: Todas las variables de entorno necesarias para el build.

## 📱 Gestión de Activos 3D

Para actualizar los modelos de Realidad Aumentada:

1. Prepara tus modelos en formato `.glb` (Android/Web) y opcionalmente `.usdz` (iOS).
2. Nombra los archivos siguiendo la convención simplificada (ej. `albanileria_confinada_base.glb`).
3. Sube los archivos a la carpeta `assets/` en tu bucket de Firebase Storage.
4. La aplicación resolverá automáticamente las URLs usando la utilidad `getAssetUrl`.

## 📄 Estructura del Proyecto

- `src/react-app`: Frontend React (SPA).
- `src/worker`: Backend Cloudflare Workers (API Layer).
- `src/shared`: Tipos y constantes compartidas.
- `src/utils`: Utilidades auxiliares (ej. `getAssetUrl`).
- `scripts/`: Scripts de mantenimiento y migración.

---
Desarrollado para ProCiencia / Ministerio de Vivienda.
Simulación CasaSim v2.0
