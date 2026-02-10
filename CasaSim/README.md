# CasaSim v2.0 (TRL 8) - Plataforma de Simulación de Vivienda
[![Status](https://img.shields.io/badge/Status-Production%20Ready-green)]() [![Tests](https://img.shields.io/badge/Tests-Vitest%20Passed-blue)]() [![Architecture](https://img.shields.io/badge/Architecture-Clean-purple)]()

Plataforma SaaS profesional para la simulación, optimización financiera y visualización en Realidad Aumentada de viviendas sociales mediante Métodos Modernos de Construcción (MMC).

---

## 🏗 Arquitectura de Simulación (Motor TRL 8)

El corazón de CasaSim ha sido rediseñado para cumplir estándares de ingeniería comercial.

### Motor de Albañilería (`src/core/MasonryEngine.ts`)
A diferencia de las versiones prototipo, CasaSim v2.0 cuenta con un núcleo lógico totalmente desacoplado de la interfaz gráfica.
- **Precisión Normativa**: Realiza el metrado de materiales (ladrillos, cemento, arena) basándose estrictamente en la **Norma E.070 de Albañilería Confinada**.
- **Independencia**: El motor es una librería TypeScript pura, lo que permite su validación matemática sin interferencia de la UI.
- **Escalabilidad**: Diseñado para integrar futuros módulos (Cimentación, Instalaciones) sin refactorizar el frontend.

### Validación de Calidad (Quality Assurance)
La fiabilidad de los cálculos está garantizada mediante:
1.  **Tests Unitarios Automáticos**: Cada cambio en la lógica se verifica contra casos de prueba estándar.
    ```bash
    npm run test
    ```
2.  **Safety Gate (CI/CD)**: El pipeline de despliegue en GitHub Actions bloquea cualquier actualización a producción si los tests fallan, asegurando la estabilidad del servicio.

---

## 👓 Realidad Aumentada para Constructores

CasaSim integra visualización 3D interactiva directamente en el navegador.

### Funcionalidad "Ver en mi espacio"
Utilizando la tecnología `<model-viewer>` de Google optimizada para web:
1.  **Visualización**: Permite rotar y hacer zoom en los detalles constructivos (ej. aparejo de bloques apilables).
2.  **Escala Real**: En dispositivos móviles compatibles (Android/iOS), el botón **"Ver en mi espacio"** proyecta el modelo en el entorno físico del usuario a escala 1:1, permitiendo verificar dimensiones y espacios antes de construir.

---

## 🛠 Tecnologías Core

*   **Frontend**: React + TypeScript + Vite (Optimizado para Performance).
*   **Backend**: Firebase (Firestore, Auth, Hosting) + Cloudflare Workers (Backend Logic).
*   **Testing**: Vitest (Unit Testing ultrarrápido).
*   **Visualización**: Google Model-Viewer (WebXR).

## 🚀 Despliegue a Producción

El ciclo de vida del software está completamente automatizado.

### Comandos de Publicación
Para desplegar una nueva versión, el equipo de ingeniería solo necesita realizar un push a la rama principal:

```bash
git add .
git commit -F COMMIT_MESSAGE.txt
git push origin main
```

Esto dispara el pipeline de CI/CD que:
1.  Instala dependencias.
2.  Ejecuta la suite de pruebas (Safety Gate).
3.  Construye la aplicación optimizada.
4.  Despliega los artefactos a Firebase Hosting.

---
**CasaSim Engineering** - *Ingeniería de Software aplicada a la Vivienda Social.*
