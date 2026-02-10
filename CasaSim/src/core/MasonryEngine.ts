import { SimulationInput, SimulationResult } from '../types/models';

/**
 * Motor de Cálculo Puro de Albañilería (Norma E.070 - Perú).
 * Desacoplado de la interfaz gráfica para pruebas unitarias y reusabilidad.
 */
export class MasonryEngine {
    // Dimensiones estándar Ladrillo King Kong 18 Huecos (m)
    static readonly BRICK_KK18 = {
        length: 0.24,
        height: 0.09,
        width: 0.13,
    };

    /**
     * Calcula la cantidad de materiales para muros de albañilería confinada.
     * Aplica desperdicio estándar (5% ladrillo, 10% mezcla).
     */
    static calculateWallMaterials(input: SimulationInput): SimulationResult {
        const { wallArea, jointThickness } = input;
        const jointM = jointThickness / 100; // cm a m
        const brick = this.BRICK_KK18;

        // 1. Cantidad de Ladrillos por m2 (Asentado de Soga)
        // C = 1 / ((L + J) * (H + J))
        const bricksPerM2 = 1 / ((brick.length + jointM) * (brick.height + jointM));
        const totalBricksWithoutWaste = bricksPerM2 * wallArea;
        const totalBricks = Math.ceil(totalBricksWithoutWaste * 1.05); // +5% Desperdicio

        // 2. Volumen de Mortero por m2
        // Vm = 1m2 * espesor - (cantidad_ladrillos * volumen_ladrillo)
        // Volumen unitario ladrillo sin huecos (geometría exterior)
        const brickVol = brick.length * brick.height * brick.width;
        const wallVolPerM2 = 1.0 * brick.width; // 1m x 1m x ancho
        const bricksVolTotal = bricksPerM2 * brickVol;

        const mortarVolPerM2 = wallVolPerM2 - bricksVolTotal;
        const totalMortarVol = mortarVolPerM2 * wallArea * 1.10; // +10% Desperdicio

        // 3. Insumos (Proporción 1:5 Cemento:Arena - Capeco)
        // 1m3 Mortero 1:5 = 7.4 bls Cemento + 1.05 m3 Arena Gruesa
        const CEMENT_FACTOR = 7.4;
        const SAND_FACTOR = 1.05;

        const cementBags = Math.ceil(totalMortarVol * CEMENT_FACTOR);
        const sandVolume = Number((totalMortarVol * SAND_FACTOR).toFixed(2));

        // 4. Costos Referenciales (Para TRL 8, estos deberían venir de BD, aquí constantes)
        const COST_CEMENT = 26.50; // Soles
        const COST_SAND = 55.00;
        const COST_BRICK = 0.95;

        const totalCost = (cementBags * COST_CEMENT) + (sandVolume * COST_SAND) + (totalBricks * COST_BRICK);

        return {
            brickCount: totalBricks,
            cementBags,
            sandVolume,
            totalMaterialCost: Number(totalCost.toFixed(2)),
            seismicFactor: 1.0 // Placeholder por ahora
        };
    }
}
