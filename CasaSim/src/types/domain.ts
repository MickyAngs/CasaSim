/**
 * Dominio de Negocio: Construcción y Materiales
 * Definiciones estrictas para el motor de cálculo.
 */

export interface ConstructionMaterial {
    id: string | number;
    name: string;
    category: 'base' | 'optimized' | 'luxury';
    costPerM2: number;
    properties: {
        energySavingsPct: number;
        laborReductionPct: number;
        co2Impact: string;
    };
    regionAvailability: string[];
}

export interface ConstructionSystemFactor {
    cost: number; // 1.0 = Base, <1.0 = Ahorro
    time: number; // 1.0 = Base, <1.0 = Rápido
}

export interface ConstructionSystem {
    id: string;
    name: string;
    description: string;
    factors: ConstructionSystemFactor;
    sustainability: {
        thermalRating: string;
        carbonFootprint: string;
    };
}

export interface SimulationInput {
    budget: number;
    unitCount: number;
    areaPerUnit: number;
    baseCostPerM2: number;
    selectedSystemFactor: number; // Factor directo del sistema elegido
}

export interface SimulationMetrics {
    baseCostPerUnit: number;
    optimizedCostPerUnit: number;
    totalBaseCost: number;
    totalOptimizedCost: number;
    totalSavings: number;
    savingsPercentage: number;
    pieChartData: { name: string; value: number; color: string }[];
}
