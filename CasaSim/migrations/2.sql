
CREATE TABLE base_materiales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_material TEXT NOT NULL,
  costo_m2_soles REAL NOT NULL,
  impacto_co2_texto TEXT,
  ahorro_energia_pct REAL DEFAULT 0,
  reduccion_hit_pct REAL DEFAULT 0,
  descripcion TEXT,
  categoria TEXT,
  disponibilidad_regional TEXT,
  es_material_base BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_base_materiales_nombre ON base_materiales(nombre_material);
CREATE INDEX idx_base_materiales_categoria ON base_materiales(categoria);

-- Insertar los materiales base según los datos proporcionados
INSERT INTO base_materiales (
  nombre_material, costo_m2_soles, impacto_co2_texto, ahorro_energia_pct, 
  reduccion_hit_pct, descripcion, categoria, disponibilidad_regional, es_material_base
) VALUES
(
  'Ladrillo (Línea Base)', 120.0, 'Alto (Base)', 0, 0, 
  'Material tradicional de construcción, usado como referencia base', 
  'Mampostería', 'Nacional', TRUE
),
(
  'Bloques Apilables (Hat Block)', 71.7, 'Medio', 0, 76.2, 
  'Bloques de concreto apilables con mayor eficiencia térmica', 
  'Mampostería', 'Nacional', FALSE
),
(
  'Encofrados Aislantes (ICF)', 150.0, 'Bajo (Operativo)', 40, 30, 
  'Sistema de encofrado aislante con núcleo de EPS y concreto', 
  'Sistema Constructivo', 'Nacional', FALSE
),
(
  'Bloques PP Reciclado', 90.0, 'Muy Bajo', 5, 50, 
  'Bloques fabricados con polipropileno reciclado tipo Lego', 
  'Sostenible', 'Nacional', FALSE
);
