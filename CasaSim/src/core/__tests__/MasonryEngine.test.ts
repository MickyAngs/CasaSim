
import { describe, it, expect } from 'vitest';
import { MasonryEngine } from '../MasonryEngine';
import { SimulationInput } from '@/types/models';

describe('MasonryEngine: Core Calculation Logic', () => {
    const baseInput: SimulationInput = {
        wallArea: 10, // 10 m2
        brickType: 'king_kong_18',
        mortarRatio: '1:5',
        jointThickness: 1.5 // 1.5 cm standard norma E.070
    };

    it('debe calcular cantidad de ladrillos dentro del rango lógico (37-39 un/m2 + desp)', () => {
        const result = MasonryEngine.calculateWallMaterials(baseInput);

        // Teoría: 1m2 soga (0.13m ancho) con junta 1.5cm -> ~38 ladrillos.
        // 10m2 -> 380 ladrillos + 5% ≈ 400.
        expect(result.brickCount).toBeGreaterThan(370);
        expect(result.brickCount).toBeLessThan(420);
        expect(result.totalMaterialCost).toBeGreaterThan(0);
    });

    it('debe calcular volumen de cemento mayor a cero para muro de 10m2', () => {
        const result = MasonryEngine.calculateWallMaterials(baseInput);
        // Para 10m2 soga, se requieren aprox 2-3 bolsas cemento (mortero).
        expect(result.cementBags).toBeGreaterThanOrEqual(2);
        expect(result.cementBags).toBeLessThan(10); // Sanity check
    });

    it('debe escalar linealmente con el área (100m2 vs 200m2 para minimizar error de redondeo)', () => {
        // Usamos áreas grandes para que el Math.ceil (enteros) tenga menos peso relativo
        const result100 = MasonryEngine.calculateWallMaterials({ ...baseInput, wallArea: 100 });
        const result200 = MasonryEngine.calculateWallMaterials({ ...baseInput, wallArea: 200 });

        // Tolerancia por redondeos de bolsas/ladrillos
        const ratio = result200.totalMaterialCost / result100.totalMaterialCost;
        expect(ratio).toBeCloseTo(2, 1); // Debe estar muy cerca de 2.0
    });
});
