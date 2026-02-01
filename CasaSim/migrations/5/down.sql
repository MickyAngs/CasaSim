
-- Remove BLOB fields
ALTER TABLE base_materiales DROP COLUMN imagen_render_generada;
ALTER TABLE base_materiales DROP COLUMN imagen_detalle_generada;

-- Restore TEXT fields
ALTER TABLE base_materiales ADD COLUMN imagen_render_generada TEXT;
ALTER TABLE base_materiales ADD COLUMN imagen_detalle_generada TEXT;
