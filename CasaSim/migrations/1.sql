
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  region TEXT,
  image_urls TEXT, -- JSON array of image URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (name, description, region, image_urls) VALUES 
('Proyecto 1', 'Vivienda social moderna con diseño sostenible', 'Lima', '["https://mocha-cdn.com/019a47b5-965e-7344-8c29-7e7af8e21f38/WhatsApp-Image-2025-09-21-at-7.44.56-PM-(7).jpeg", "https://mocha-cdn.com/019a47b5-965e-7344-8c29-7e7af8e21f38/WhatsApp-Image-2025-09-21-at-7.44.56-PM-(3).jpeg", "https://mocha-cdn.com/019a47b5-965e-7344-8c29-7e7af8e21f38/WhatsApp-Image-2025-09-21-at-7.44.56-PM-(6).jpeg"]');
