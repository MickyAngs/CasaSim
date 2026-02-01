
-- Remove existing TEXT fields
ALTER TABLE base_materiales DROP COLUMN imagen_render_generada;
ALTER TABLE base_materiales DROP COLUMN imagen_detalle_generada;

-- Add new BLOB fields for images
ALTER TABLE base_materiales ADD COLUMN imagen_render_generada BLOB;
ALTER TABLE base_materiales ADD COLUMN imagen_detalle_generada BLOB;
