# Manual de Mantenimiento - CasaSim (v2.0)

Este documento detalla la gestión técnica de la base de datos Firestore y las políticas de seguridad para el mantenimiento de largo plazo.

---

## 🏗 Estructura de Base de Datos (Firestore)

El sistema opera sobre un modelo NoSQL jerárquico. Las colecciones principales son:

### 1. `simulations/`
Almacena los proyectos de optimización de los usuarios.
- **Document ID**: Unique `simulationId` (generado automáticamente).
- **Campos TRL 8**:
    - `ownerId` (String): UID del usuario creador (Crucial para seguridad).
    - `name` (String): Nombre del proyecto (e.g., "Módulo Básico en Callao").
    - `config` (Map): Parámetros de entrada utilizados por el MasonryEngine.
    - `results` (Map): Resultados calculados (Ladrillos, Cemento, Arena, Costos).
    - `createdAt` (Timestamp): Fecha de simulación.

### 2. `materials/`
Catálogo maestro de materiales y precios de referencia.
- **Document ID**: `materialId` (e.g., `bloques_silice`).
- **Campos**:
    - `nombre_material` (String).
    - `costo_m2_soles` (Number): Precio base actualizado periódicamente.
    - `imagen_render_3d` (String): URL del modelo GLB.
    - `ficha_tecnica` (String): URL del PDF técnico.

---

## 🔐 Reglas de Seguridad (Firestore Security Rules)

El archivo `firestore.rules` gobierna el acceso a los datos. La política actual es **MULTI-TENANT STRICT**:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    // Proyectos de Simulación: Acceso PRIVADO
    match /simulations/{simulationId} {
      allow create: if request.auth != null;
      allow read, update, delete: if resource.data.ownerId == request.auth.uid;
    }
    
    // Materiales: Acceso PÚBLICO (Solo Lectura)
    match /materials/{materialId} {
      allow read: if true;
      allow write: if false; // Solo administradores desde consola
    }
  }
}
```

### Modificación de Reglas
Para actualizar las políticas de seguridad:
1.  Edita el archivo `firestore.rules` localmente.
2.  Utiliza el comando de despliegue parcial:
    ```bash
    firebase deploy --only firestore:rules
    ```

---

## 🔄 Actualización de Precios y Catálogo

Para reflejar cambios en el mercado sin tocar el código:
1.  Ingresa a la **Consola de Firebase** > Firestore Database.
2.  Navega a la colección `materials`.
3.  Edita directamente el campo `costo_m2_soles` del documento correspondiente.
4.  Los cambios se reflejarán instantáneamente en todas las nuevas simulaciones.

---
**CasaSim Operations** - *Mantenimiento de Infraestructura Crítica.*
