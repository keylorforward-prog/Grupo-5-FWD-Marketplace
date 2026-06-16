const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  timeout: 20000,
});

const SYSTEM_PROMPT = `Sos el asistente de FWD Marketplace, Costa Rica. Ayudás a empresarios sin conocimientos técnicos a convertir su problema de negocio en un proyecto concreto que un desarrollador junior egresado de FWD pueda resolver.

CONTEXTO QUE CONOCÉS:
- Los desarrolladores son juniors full-stack con IA, egresados de FWD
- Los proyectos duran entre 1 y 12 semanas máximo
- El pago es directo entre empresa y desarrollador
- Presupuesto típico: USD 200 a USD 1500
- Entendés modismos costarricenses (mae, diay, despiche, tuanis)

CÓMO TRABAJÁS:
- Una sola pregunta por mensaje, máximo 2 oraciones
- Antes de preguntar, revisá TODO lo que el usuario ya dijo. Nunca repitas algo que ya mencionó, ni preguntes por datos que ya diste por conocidos
- Sé analítico: si el usuario menciona un negocio, deducí qué necesita realmente y hacé preguntas específicas para ESE caso, no genéricas
- Si el proyecto suena muy grande para 12 semanas, sugerí acotarlo a una primera fase concreta. Nunca lo rechaces
- Nunca uses anglicismos (nada de "by the way", "ok", "cool")
- Sin emojis

ORDEN DE LA ENTREVISTA (adaptá según el negocio, no preguntes lo ya respondido):
1. El problema a resolver
2. Quiénes usarán la solución
3. Funciones clave que necesita
4. Qué sistema/herramienta usa hoy (si ya lo mencionó, confirmalo y avanzá)
5. Si necesita integrarse con algo existente o arranca de cero
6. Preferencia de tecnología (aceptá "no sé")
7. Plazo estimado (recordá el máximo de 12 semanas)
8. Presupuesto aproximado (SIEMPRE al final, en su propio mensaje, aceptá "no sé")

PREGUNTAS ADAPTADAS SEGÚN EL NEGOCIO:
- Comercio/restaurante: inventario, pagos (SINPE), pedidos online vs físico
- Servicio profesional (clínica, abogado): citas, agenda, datos confidenciales
- Interno/operaciones: cuántos usuarios, integración con sistemas actuales

CIERRE:
Cuando tengas información REAL y completa de los 8 puntos, respondé SOLO con el token exacto: [ENTREVISTA_COMPLETA]
Si el usuario manda texto sin sentido, números sueltos o respuestas vacías, NO cierres. Redirigí amablemente pidiendo que cuente más sobre su proyecto.`;

const EXTRACTION_PROMPT = `Analizá el siguiente historial de conversación y extraé la información del proyecto tecnológico mencionado. Respondé SOLO con un JSON válido, sin texto adicional ni bloques de código markdown.

El JSON debe tener exactamente estos campos:
- title: nombre corto del proyecto
- description: descripción clara del objetivo principal
- area_negocio: sector o industria del proyecto
- stack: array de tecnologías mencionadas o preferidas (puede ser vacío)
- duration_weeks: duración estimada en semanas, número entero entre 1 y 12
- work_mode: modalidad de trabajo, debe ser exactamente "remote", "hybrid" u "onsite"
- budget_min: presupuesto mínimo estimado en USD (número, 0 si no se mencionó)
- budget_max: presupuesto máximo estimado en USD (número, 0 si no se mencionó)
- usa_ia: true siempre — porque este proyecto fue creado con asistencia de inteligencia artificial por el agente de FWD Marketplace
- raw_requirements: Lista de requerimientos funcionales específicos y verificables, en viñetas. Cada requerimiento debe describir QUÉ debe hacer el sistema, no cómo. Formato: "El sistema debe [verbo] [objeto] [condición]". Ejemplo correcto: "El sistema debe permitir al cliente ver el menú y agregar productos al carrito". Ejemplo incorrecto: "Menú online". Mínimo 5 requerimientos, máximo 10. Si la conversación no dio suficiente detalle para 5, inferí los más lógicos según el tipo de negocio y marcalos con (inferido). Incluí también si el empresario usa sistemas actuales y si el nuevo debe integrarse con ellos o arrancar desde cero.

Si un campo no fue mencionado: string vacío para textos, array vacío para stack, 0 para números.

Historial:`;

const CORRECTION_PROMPT = `Aplicá las correcciones indicadas al JSON del proyecto. Respondé SOLO con el JSON corregido, mismo formato exacto, sin texto adicional ni explicaciones.

Datos actuales:`;

function historyToPlainText(history) {
  return history
    .map((msg) => `${msg.role === 'user' ? 'Empresario' : 'Agente'}: ${msg.content}`)
    .join('\n');
}

function detectState(text) {
  return text.includes('[ENTREVISTA_COMPLETA]') ? 'confirming' : 'interviewing';
}

function cleanMessage(text) {
  return text.replace('[ENTREVISTA_COMPLETA]', '').trim();
}

function stripMarkdown(text) {
  return text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
}

exports.interview = async (req, res) => {
  try {
    const { history, userMessage } = req.body;
    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'userMessage requerido' });
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(history || []).map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
        { role: 'user', content: userMessage },
      ],
    });

    const text = response.choices[0].message.content ?? '';
    const state = detectState(text);

    res.json({ success: true, data: { message: cleanMessage(text), state } });
  } catch (error) {
    console.error('Agent interview error:', error.message);
    if (error.status === 429) {
      return res.status(429).json({ success: false, message: 'El agente está ocupado. Esperá unos segundos y volvé a intentarlo.' });
    }
    res.status(500).json({ success: false, message: 'Algo salió mal de nuestro lado. Intentá de nuevo.' });
  }
};

exports.extract = async (req, res) => {
  try {
    const { history } = req.body;
    const historialTexto = historyToPlainText(history || []);

    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 800,
      messages: [{ role: 'user', content: EXTRACTION_PROMPT + '\n' + historialTexto }],
    });

    const text = response.choices[0].message.content ?? '';
    const data = JSON.parse(stripMarkdown(text));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Agent extract error:', error.message);
    res.status(500).json({ success: false, message: 'No pudimos procesar tu proyecto. Intentá de nuevo.' });
  }
};

exports.correct = async (req, res) => {
  try {
    const { current, correction } = req.body;
    if (!current || !correction) {
      return res.status(400).json({ success: false, message: 'current y correction requeridos' });
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content:
            CORRECTION_PROMPT +
            '\n' +
            JSON.stringify(current, null, 2) +
            '\n\nCambios: ' +
            correction,
        },
      ],
    });

    const text = response.choices[0].message.content ?? '';
    const data = JSON.parse(stripMarkdown(text));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Agent correct error:', error.message);
    res.status(500).json({ success: false, message: 'No pudimos procesar tu proyecto. Intentá de nuevo.' });
  }
};
