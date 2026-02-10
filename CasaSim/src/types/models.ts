/**
 * Modelos de Dominio Estrictos para CasaSim (TRL 8)
 * Definiciones de tipos para Firestore y Lógica de Negocio.
 */

export interface MaterialCost {
    id: string;
    name: string;
    category: 'structural' | 'finishing' | 'installation'; // Categorías estrictas
    unit: 'und' | 'm3' | 'kg' | 'bls' | 'm2';
    pricePerUnit: number; // En moneda local (PEN)
    co2Factor: number; // kgCO2e por unidad
}

export interface SimulationInput {
    wallArea: number;   // m2 de muro
    brickType: 'king_kong_18' | 'pandereta' | 'bloque_concreto';
    mortarRatio: '1:4' | '1:5'; // Cemento:Arena
    jointThickness: number; // cm (junta)
}

export interface SimulationResult {
    brickCount: number;
    cementBags: number; // Bolsas de 42.5kg
    sandVolume: number; // m3
    totalMaterialCost: number;
    seismicFactor: number; // 0.0 a 1.0 (Validación E.070)
}

export interface SimulationProject {
    id: string;
    ownerId: string; // UID del usuario (Crítico para seguridad)
    name: string;
    createdAt: string; // ISO Timestamp
    updatedAt: string;

    // Configuración de la simulación
    config: {
        region: string;
        budgetLimit: number;
        housingType: string;
    };

    // Resultados calculados (Persistidos para historial)
    results: SimulationResult;

    // Referencias a Assets 3D (Tipadas, no strings mágicos)
    assets: {
        renderGlbUrl: string; // URL firmada o pública de Firebase Storage
        detailGlbUrl: string;
    };
}

export interface UserConfig {
    uid: string;
    email: string;
    role: 'user' | 'admin' | 'architect';
    preferences: {
        theme: 'light' | 'dark';
        notificationsEnabled: boolean;
    };
}
