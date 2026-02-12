# CasaSim: Plataforma de Ingeniería de Costos y Visualización Avanzada

CasaSim es una solución SaaS profesional diseñada para optimizar presupuestos de vivienda social mediante ingeniería de valor y Métodos Modernos de Construcción (MMC).

![Status TRL 8](https://img.shields.io/badge/Status-Production%20Ready-green)
![CI/CD](https://img.shields.io/badge/CI%2FCD-Active-blue)
![Engine](https://img.shields.io/badge/Masonry%20Engine-Norma%20E.070-purple)

## 🏗 Arquitectura Técnica

El sistema se basa en una arquitectura desacoplada y escalable de nivel empresarial:

1.  **Frontend Optimizado**: Construido con **React + TypeScript + Vite**. Garantiza una experiencia de usuario fluida y tipado estricto (Zero Any Policy).
2.  **Motor de Cálculo (`MasonryEngine`)**: Núcleo lógico independiente que realiza el metrado preciso de materiales (ladrillos, mortero, concreto) siguiendo estrictamente la **Norma Técnica Peruana E.070**.
    *   *Ventaja*: Permite auditoría de cálculos y reutilización en otros entornos (Backend/Mobile).
3.  **Backend Serverless**: Utiliza **Firebase** (Firestore, Auth, Hosting) para escalabilidad automática y seguridad multi-tenant.
4.  **Realidad Aumentada (WebXR)**: Integración nativa de `<model-viewer>` de Google.
    *   **Detección Inteligente**: El sistema identifica automáticamente el dispositivo:
        *   **Android**: Carga modelos `.glb` optimizados.
        *   **iOS (iPhone/iPad)**: Sirve archivos `.usdz` para Quick Look nativo.
    *   **Escala 1:1**: Permite visualizar componentes constructivos en tamaño real mediante el botón **"Ver en mi espacio"**.

## ✅ Estado del Sistema y Calidad (QA)

El proyecto cuenta con un pipeline de Integración Continua (CI/CD) activo en GitHub Actions:

*   **Tests Unitarios**: Cada cambio de código dispara una batería de pruebas automatizadas (`npm run test`) mediante **Vitest**.
*   **Safety Gate**: El despliegue a producción se bloquea automáticamente si alguna prueba falla, garantizando la estabilidad operativa.
*   **Build Seguro**: El proceso de compilación verifica tipos estáticos y optimiza los assets para producción.

## 🚀 Despliegue

El despliegue está totalmente automatizado. Para publicar una nueva versión:

```bash
git push origin main
```

Esto activará el workflow de validación y despliegue a Firebase Hosting.

---
**CasaSim Engineering Team**
*Ingeniería de Software aplicada a la Construcción.*
