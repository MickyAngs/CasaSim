import type { ConstructionSystemType } from "./types";

export const constructionSystems: ConstructionSystemType[] = [
  {
    id: "base-tradicional",
    nombre: "Albañilería Confinada (Base)",
    descripcion: "Sistema base de ladrillo y concreto vaciado in-situ, según el 'PRESUPUESTO fain.pdf'.",
    costo_factor: 1.00,
    tiempo_factor: 1.00,
    aislamiento_termico: "Bajo",
    huella_carbono: "Alta (Cemento Portland, Ladrillo cocido)",
    ventaja_clave: "Mano de obra conocida en Perú.",
    fuente: "PRESUPUESTO fain.pdf"
  },
  {
    id: "sip",
    nombre: "Paneles SIP (Opción 2)",
    descripcion: "Paneles estructurales aislados (OSB+EPS). Construcción en seco, ligera y de rápido montaje.",
    costo_factor: 0.67,
    tiempo_factor: 0.38,
    aislamiento_termico: "Muy Alto (Núcleo de Poliestireno)",
    huella_carbono: "Baja-Media (70% menos que tradicional)",
    ventaja_clave: "Equilibrio costo-velocidad y alto aislamiento.",
    fuente: "mocha data.pdf / Documento Informativo 4.docx"
  },
  {
    id: "icf",
    nombre: "Sistema ICF (Opción 3)",
    descripcion: "Bloques de EPS (Tecnopor) que sirven de encofrado perdido para un núcleo de concreto armado.",
    costo_factor: 0.85,
    tiempo_factor: 0.50,
    aislamiento_termico: "Superior (Ahorro > 40% energía)",
    huella_carbono: "Media-Alta (Alto contenido de Cemento)",
    ventaja_clave: "Máximo confort térmico y ahorro energético a largo plazo (LCC).",
    fuente: "nuevo sistema 2.2.docx / 2.3.docx"
  },
  {
    id: "pp-reciclado",
    nombre: "Bloques PP Reciclado (Opción 4)",
    descripcion: "Bloques tipo 'Lego' hechos de plástico polipropileno reciclado. Promueve la economía circular.",
    costo_factor: 0.60,
    tiempo_factor: 0.24,
    aislamiento_termico: "Alto (Propiedades del polímero)",
    huella_carbono: "Muy Baja (Material 100% reciclado, secuestra carbono)",
    ventaja_clave: "El más rápido y económico. Fuerte impacto en sostenibilidad.",
    fuente: "nuevo sistema 2.1.docx"
  }
];

export const getConstructionSystemById = (id: string): ConstructionSystemType | undefined => {
  return constructionSystems.find(system => system.id === id);
};

export const getBaseSystem = (): ConstructionSystemType => {
  return constructionSystems[0]; // Albañilería Confinada (Base)
};
