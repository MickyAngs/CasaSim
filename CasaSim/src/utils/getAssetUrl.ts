const FIREBASE_BUCKET_NAME = import.meta.env.VITE_FIREBASE_BUCKET_NAME || 'casasim-app.appspot.com';
const ASSETS_BASE_PATH = 'assets';

// Mapeo de nombres de archivo antiguos (legacy) a los nuevos nombres simplificados en Firebase
const legacyAssetMap: Record<string, string> = {
    // Albañilería Confinada (Base)
    'Albañilería-confinada-(Base).png': 'albanileria_confinada_base.png',
    'Bloques-Apilables-(Flat-Block).png': 'bloques_apilables_flat_block.png',

    // Mapeo directo de las URLs completas antiguas por si acaso se pasan completas
    'https://mocha-cdn.com/019a47b5-965e-7344-8c29-7e7af8e21f38/Alba%C3%B1ileria-confinada-(Base).png': 'albanileria_confinada_base.png',
    'https://mocha-cdn.com/019a47b5-965e-7344-8c29-7e7af8e21f38/Bloques-Apilables-(Flat-Block).png': 'bloques_apilables_flat_block.png',
};

/**
 * Retorna la URL completa de Firebase Storage para un activo dado.
 * Maneja el mapeo de nombres antiguos de mocha-cdn a los nuevos nombres simplificados.
 * 
 * @param filenameOrUrl El nombre del archivo o URL antigua.
 * @returns La URL pública de Firebase Storage.
 */
export const getAssetUrl = (filenameOrUrl: string): string => {
    // Verificar si tenemos un mapeo para este nombre/URL
    const filename = legacyAssetMap[filenameOrUrl] || filenameOrUrl;

    // Construir la URL de descarga de Firebase Storage
    // Usamos el formato alt=media para acceso directo a texturas e imágenes
    // Nota: Esto asume que las reglas de Firebase Storage permiten lectura pública.
    return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET_NAME}/o/${ASSETS_BASE_PATH}%2F${encodeURIComponent(filename)}?alt=media`;
};
