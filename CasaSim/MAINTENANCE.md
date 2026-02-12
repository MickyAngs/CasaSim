# Manual de Mantenimiento para Desarrolladores

Guía técnica para la operación y evolución de CasaSim.

## 📦 Gestión de Contenidos

### 1. Actualización de Precios de Materiales
Los costos unitarios se gestionan directamente en la base de datos Firestore, sin necesidad de redesplegar el código.
1.  Accede a **Firebase Console** > **Firestore Database**.
2.  Colección: `materials`.
3.  Documento: ID del material (ej. `ladrillo_kk18`).
4.  Campo: `costo_m2_soles` (Number).
    *   *Nota*: El sistema reflejará el cambio inmediatamente en las nuevas simulaciones.

### 2. Agregar Nuevos Modelos 3D
Para incorporar nuevos sistemas constructivos:
1.  Sube los archivos 3D a **Firebase Storage** en la ruta `/assets/models/`.
    *   Formato Universal: `nombre_modelo.glb`
    *   Formato iOS (Opcional pero recomendado): `nombre_modelo.usdz`
2.  Actualiza la URL en la colección `materials` de Firestore (campo `imagen_render_3d`).

## 🛡 Protocolo de Desarrollo Seguro

Antes de realizar cambios en el código (`src/core` o `src/react-app`), sigue este protocolo para evitar regresiones:

### Ejecutar Pruebas Locales
El `MasonryEngine` está protegido por tests unitarios. Antes de cada commit, ejecuta:

```bash
npm run test
```

Si modificas la lógica de cálculo (`src/core/MasonryEngine.ts`), debes actualizar o agregar nuevos tests en `src/core/__tests__/`.

### Despliegue
El despliegue es automático al hacer push a la rama `main`.
*   **Advertencia**: Si los tests fallan en GitHub Actions, el despliegue se cancelará automáticamente. Revisa la pestaña "Actions" en GitHub para ver los logs de error.

---
**CasaSim Devs**
