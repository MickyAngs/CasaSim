import z from "zod";

/**
 * Types shared between the client and server go here.
 */

export const OptimizacionSchema = z.object({
  concepto: z.string(),
  valorOriginal: z.string(),
  objetivo: z.string(),
  resultado: z.string(),
});

export const PartidaAhorroSchema = z.object({
  componente: z.string(),
  sistemaOriginal: z.string(),
  nuevoSistema: z.string(),
  ahorroEstimado: z.string(),
});

export const AcabadoValorSchema = z.object({
  partidaOriginal: z.string(),
  partidaOptimizada: z.string(),
  impacto: z.string(),
});

export const SimulationDataSchema = z.object({
  resumenProyecto: z.object({
    titulo: z.string(),
    descripcion: z.string(),
  }),
  optimizacionResumen: z.array(OptimizacionSchema),
  justificacionAhorro: z.object({
    partidas: z.array(PartidaAhorroSchema),
    ahorroTotal: z.object({
      componente: z.string(),
      ahorroEstimado: z.string(),
    }),
    nota: z.string(),
  }),
  acabadosValorAnadido: z.array(AcabadoValorSchema),
});

export const ConstructionSystemSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  costo_factor: z.number(),
  tiempo_factor: z.number(),
  aislamiento_termico: z.string(),
  huella_carbono: z.string(),
  ventaja_clave: z.string(),
  fuente: z.string(),
});

export const MaterialSchema = z.object({
  id: z.number().optional(),
  nombre_material: z.string(),
  costo_m2_soles: z.number().optional(),
  impacto_co2_texto: z.string().optional(),
  ahorro_energia_pct: z.number().optional(),
  reduccion_hit_pct: z.number().optional(),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  disponibilidad_regional: z.string().optional(),
  es_material_base: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const SimulationParamsSchema = z.object({
  budget: z.number(),
  region: z.string(),
  housingType: z.string(),
  familyCount: z.number(),
  wallMaterial: z.string(),
  constructionSystem: z.string().optional(),
  materialData: MaterialSchema.optional(),
});

export type OptimizacionType = z.infer<typeof OptimizacionSchema>;
export type PartidaAhorroType = z.infer<typeof PartidaAhorroSchema>;
export type AcabadoValorType = z.infer<typeof AcabadoValorSchema>;
export type SimulationDataType = z.infer<typeof SimulationDataSchema>;
export type SimulationParamsType = z.infer<typeof SimulationParamsSchema>;
export type ConstructionSystemType = z.infer<typeof ConstructionSystemSchema>;
export type MaterialType = z.infer<typeof MaterialSchema>;
