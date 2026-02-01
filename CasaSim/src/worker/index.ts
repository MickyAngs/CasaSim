import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import jsPDF from 'jspdf';

interface WorkerEnv {
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
  GEMINI_API_KEY: string;
  GOOGLE_CLOUD_API_KEY: string;
  DB: D1Database;
}

const app = new Hono<{ Bindings: WorkerEnv }>();

// Obtain redirect URL from the Mocha Users Service
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Exchange the code for a session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

// Get the current user object for the frontend
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Call this from the frontend to log out the user
app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Get all projects
app.get('/api/projects', authMiddleware, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT id, name, description, region, image_urls, created_at, updated_at 
      FROM projects 
      ORDER BY created_at DESC
    `).all();

    const projects = result.results.map((row: any) => ({
      ...row,
      image_urls: JSON.parse(row.image_urls || '[]')
    }));

    return c.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return c.json({ error: 'Error fetching projects' }, 500);
  }
});

// PDF generation route
app.post("/api/generate-pdf", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { projects } = body;

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return c.json({ error: "No se proporcionaron proyectos válidos" }, 400);
    }

    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('Reporte de Proyectos CasaSim', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`, 20, 45);
    pdf.text(`Total de proyectos: ${projects.length}`, 20, 55);
    
    let yPosition = 75;
    
    projects.forEach((project: any, index: number) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Project header
      pdf.setFontSize(16);
      pdf.text(`Proyecto ${index + 1}: ${project.name}`, 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      
      // Basic info
      pdf.text(`Región: ${project.region}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Fecha: ${project.date}`, 20, yPosition);
      yPosition += 8;
      
      if (project.results) {
        pdf.text(`Familias: ${project.results.familyCount || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Costo Original: S/. ${project.results.costoOriginal?.toLocaleString() || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Costo Optimizado: S/. ${project.results.costoOptimizado?.toLocaleString() || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Ahorro Total: S/. ${project.results.ahorroTotal?.toLocaleString() || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Área Techada: ${project.results.areaTechada?.toFixed(2) || 'N/A'} m²`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Sistema Constructivo: ${project.results.selectedSystem || 'N/A'}`, 20, yPosition);
        yPosition += 8;
      }
      
      // Parameters
      if (project.params) {
        pdf.text(`Presupuesto: S/. ${project.params.budget?.toLocaleString() || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Tipo de Vivienda: ${project.params.housingType || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`Material de Muros: ${project.params.wallMaterial || 'N/A'}`, 20, yPosition);
        yPosition += 8;
      }
      
      yPosition += 10; // Space between projects
    });
    
    // Generate PDF buffer
    const pdfBuffer = pdf.output('arraybuffer');
    
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-proyectos-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return c.json({ error: "Error al generar el PDF" }, 500);
  }
});

// Get all materials from Base_Materiales
app.get('/api/materials', authMiddleware, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT id, nombre_material, costo_m2_soles, impacto_co2_texto, 
             ahorro_energia_pct, reduccion_hit_pct
      FROM base_materiales 
      ORDER BY nombre_material ASC
    `).all();

    return c.json(result.results);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return c.json({ error: 'Error fetching materials' }, 500);
  }
});

// Get base material (Albañilería Confinada)
app.get('/api/materials/base', authMiddleware, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM base_materiales WHERE es_material_base = TRUE LIMIT 1
    `).first();

    if (!result) {
      return c.json({ error: 'Base material not found' }, 404);
    }

    return c.json(result);
  } catch (error) {
    console.error('Error fetching base material:', error);
    return c.json({ error: 'Error fetching base material' }, 500);
  }
});

// Get a single material by ID
app.get('/api/materials/:id', authMiddleware, async (c) => {
  const materialId = c.req.param('id');
  
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM base_materiales WHERE id = ?
    `).bind(materialId).first();

    if (!result) {
      return c.json({ error: 'Material not found' }, 404);
    }

    const material = result as any;

    // Convert BLOB data to base64 for frontend consumption
    if (material.imagen_render_generada) {
      const renderBlob = new Uint8Array(material.imagen_render_generada);
      material.imagen_render_generada = btoa(String.fromCharCode(...renderBlob));
    }

    if (material.imagen_detalle_generada) {
      const detailBlob = new Uint8Array(material.imagen_detalle_generada);
      material.imagen_detalle_generada = btoa(String.fromCharCode(...detailBlob));
    }

    return c.json(material);
  } catch (error) {
    console.error('Error fetching material:', error);
    return c.json({ error: 'Error fetching material' }, 500);
  }
});

// Get all FAQs
app.get('/api/faqs', authMiddleware, async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT id, pregunta, respuesta
      FROM ayuda_faq 
      ORDER BY id ASC
    `).all();

    return c.json({ faqs: result.results });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return c.json({ error: 'Error fetching FAQs' }, 500);
  }
});

// Generate 3D render for material
app.post('/api/materials/:id/generate-render', authMiddleware, async (c) => {
  const materialId = c.req.param('id');
  
  try {
    // Get material record
    const materialResult = await c.env.DB.prepare(`
      SELECT * FROM base_materiales WHERE id = ?
    `).bind(materialId).first();

    if (!materialResult) {
      return c.json({ error: 'Material not found' }, 404);
    }

    const material = materialResult as any;

    if (!material.prompt_render_3d) {
      return c.json({ error: 'No 3D render prompt available for this material' }, 400);
    }

    // Call Google Cloud Imagen API
    try {
      const imagenResponse = await fetch(`https://aiplatform.googleapis.com/v1/projects/glow-grammar-439519-p7/locations/us-central1/publishers/google/models/imagen-4.0-generate-001:predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.GOOGLE_CLOUD_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: material.prompt_render_3d
            }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_some",
            personGeneration: "dont_allow"
          }
        })
      });

      if (!imagenResponse.ok) {
        const errorText = await imagenResponse.text();
        console.error('Imagen API error:', errorText);
        throw new Error(`Imagen API error: ${imagenResponse.status}`);
      }

      const imagenData = await imagenResponse.json() as any;
      const base64Data = imagenData.predictions?.[0]?.bytesBase64Encoded;

      if (!base64Data || base64Data.length === 0) {
        console.error('Empty or missing image data from Imagen API:', imagenData);
        throw new Error('No image data received from Imagen API');
      }

      // Convert base64 to binary data for BLOB storage
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Update material record with generated image as BLOB
      await c.env.DB.prepare(`
        UPDATE base_materiales 
        SET imagen_render_generada = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).bind(binaryData, materialId).run();

      console.log('Generated 3D render for material:', material.nombre_material);

      return c.json({ 
        success: true, 
        imageData: base64Data,
        message: 'Visualización 3D generada exitosamente' 
      });

    } catch (imagenError) {
      console.error('Imagen API error:', imagenError);
      
      return c.json({ 
        success: false, 
        error: 'Error calling Google Cloud Imagen API',
        details: imagenError instanceof Error ? imagenError.message : 'Unknown error',
        message: 'Error al generar la visualización 3D' 
      }, 500);
    }

  } catch (error) {
    console.error('Error generating 3D render:', error);
    return c.json({ error: 'Error generating 3D render' }, 500);
  }
});

// Generate construction detail for material
app.post('/api/materials/:id/generate-detail', authMiddleware, async (c) => {
  const materialId = c.req.param('id');
  
  try {
    // Get material record
    const materialResult = await c.env.DB.prepare(`
      SELECT * FROM base_materiales WHERE id = ?
    `).bind(materialId).first();

    if (!materialResult) {
      return c.json({ error: 'Material not found' }, 404);
    }

    const material = materialResult as any;

    if (!material.prompt_detalle_constructivo) {
      return c.json({ error: 'No construction detail prompt available for this material' }, 400);
    }

    // Call Google Cloud Imagen API
    try {
      const imagenResponse = await fetch(`https://aiplatform.googleapis.com/v1/projects/glow-grammar-439519-p7/locations/us-central1/publishers/google/models/imagen-4.0-generate-001:predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.GOOGLE_CLOUD_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: material.prompt_detalle_constructivo
            }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_some",
            personGeneration: "dont_allow"
          }
        })
      });

      if (!imagenResponse.ok) {
        const errorText = await imagenResponse.text();
        console.error('Imagen API error:', errorText);
        throw new Error(`Imagen API error: ${imagenResponse.status}`);
      }

      const imagenData = await imagenResponse.json() as any;
      const base64Data = imagenData.predictions?.[0]?.bytesBase64Encoded;

      if (!base64Data || base64Data.length === 0) {
        console.error('Empty or missing image data from Imagen API:', imagenData);
        throw new Error('No image data received from Imagen API');
      }

      // Convert base64 to binary data for BLOB storage
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Update material record with generated image as BLOB
      await c.env.DB.prepare(`
        UPDATE base_materiales 
        SET imagen_detalle_generada = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).bind(binaryData, materialId).run();

      console.log('Generated construction detail for material:', material.nombre_material);

      return c.json({ 
        success: true, 
        imageData: base64Data,
        message: 'Detalle constructivo generado exitosamente' 
      });

    } catch (imagenError) {
      console.error('Imagen API error:', imagenError);
      
      return c.json({ 
        success: false, 
        error: 'Error calling Google Cloud Imagen API',
        details: imagenError instanceof Error ? imagenError.message : 'Unknown error',
        message: 'Error al generar el detalle constructivo' 
      }, 500);
    }

  } catch (error) {
    console.error('Error generating construction detail:', error);
    return c.json({ error: 'Error generating construction detail' }, 500);
  }
});

// AI Chat endpoint with Gemini integration
app.post('/api/chat', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { message } = body;

  try {
    // Call Gemini API with structured JSON response
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${c.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Eres 'CasaSim', un asistente experto en arquitectura sostenible y construcción de vivienda social en Perú, basado en la 'Tesis Chancay' y Métodos Modernos de Construcción (MMC). El usuario te hará una pregunta.

Tu misión es doble:
1. Responde a la pregunta del usuario de forma concisa y profesional.
2. Genera 5 preguntas de seguimiento inteligentes y relevantes que el usuario podría hacer a continuación para profundizar en el tema.

Pregunta del usuario: ${message}`
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: "Debes responder SIEMPRE en formato JSON, siguiendo este schema exacto:"
            }
          ]
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              respuesta: {
                type: "STRING",
                description: "La respuesta directa y concisa a la pregunta del usuario."
              },
              preguntas_sugeridas: {
                type: "ARRAY",
                description: "Una lista de exactamente 5 preguntas de seguimiento.",
                items: {
                  type: "STRING"
                }
              }
            }
          }
        }
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json() as any;
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('No response from Gemini');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(responseText);

    return c.json({ 
      message: parsedResponse.respuesta,
      suggestedQuestions: parsedResponse.preguntas_sugeridas || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback responses if Gemini fails
    let fallbackResponse = "Hola! Soy tu asistente de CasaSim. ¿En qué puedo ayudarte hoy?";
    const fallbackQuestions = [
      "¿Qué tipos de materiales son mejores para la costa peruana?",
      "¿Cuál es el presupuesto promedio para una vivienda social?",
      "¿Qué son los Métodos Modernos de Construcción?",
      "¿Cómo puedo reducir costos en mi proyecto?",
      "¿Qué sistemas constructivos recomiendas?"
    ];
    
    if (message.toLowerCase().includes('hola')) {
      fallbackResponse = "¡Hola! ¿Cómo puedo ayudarte con tus proyectos de vivienda social?";
    } else if (message.toLowerCase().includes('presupuesto')) {
      fallbackResponse = "Te puedo ayudar con el cálculo de presupuestos. ¿Qué región y tipo de vivienda estás considerando?";
    } else if (message.toLowerCase().includes('material')) {
      fallbackResponse = "Los materiales más utilizados en Perú son: ladrillo, adobe, concreto y madera. ¿Necesitas recomendaciones específicas?";
    } else if (message.toLowerCase().includes('region') || message.toLowerCase().includes('región')) {
      fallbackResponse = "Cada región tiene características diferentes: Costa (clima árido), Sierra (clima frío), Selva (clima tropical). ¿Sobre cuál necesitas información?";
    } else {
      fallbackResponse = "Disculpa, estoy experimentando dificultades técnicas. Por favor, intenta nuevamente o reformula tu pregunta.";
    }

    return c.json({ 
      message: fallbackResponse,
      suggestedQuestions: fallbackQuestions,
      timestamp: new Date().toISOString()
    });
  }
});

export default app;
