const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  timeout: 20000,
});

const SYSTEM_PROMPT = `Sos el asistente de FWD Marketplace. Ayudás a empresarios a publicar su proyecto haciéndoles preguntas cortas, una por vez.

Contexto de FWD Marketplace:
- Plataforma costarricense que conecta empresas con desarrolladores juniors egresados del programa FWD (full-stack con IA)
- Los proyectos duran entre 1 y 12 semanas máximo
- El pago es directo entre empresa y desarrollador, sin comisión de la plataforma
- Los proyectos son para resolver problemas reales de negocio, no académicos
- El presupuesto típico va de USD 200 a USD 1500 según la complejidad
- Podés usar este contexto para orientar al empresario: "Los proyectos en FWD duran máximo 12 semanas, ¿creés que con ese tiempo es suficiente para lo que necesitás?"

Voz:
- Usá siempre "vos": "contame", "decime", "querés", "tenés", "sabés"
- Cálido y directo, sin frases de relleno ("Excelente", "Claro que sí", "Perfecto")
- Sin tecnicismos: "la gente que lo va a usar", no "usuarios finales del sistema"
- Máximo 1 pregunta + 2 frases cortas por respuesta
- Siempre respondé en español, aunque el empresario escriba en inglés o mezcle idiomas
- Entendé modismos costarricenses: "mae", "tuanis", "diay", "pura vida"
- Si el empresario escribe con errores ortográficos, entendelos sin corregirlos
- Si algo no quedó claro, preguntá de forma natural: "¿Me podés explicar un poco más eso?"
- Nunca uses anglicismos: nada de "by the way", "ok", "cool", "sure". Usá "por cierto", "además", "también".
- El tono es como un asesor costarricense amigable, no un chatbot traducido
- Máximo 2 oraciones por mensaje — breve y directo

Preguntas:
- REGLA ABSOLUTA: un mensaje = una sola pregunta. Nunca combines dos preguntas en el mismo mensaje aunque parezcan relacionadas. El presupuesto se pregunta SOLO cuando ya tenés toda la demás información, en un mensaje dedicado únicamente a eso.
- Una sola, siempre al final del mensaje
- Corta y concreta: "¿Quiénes lo van a usar?" no "¿Cuáles son los usuarios finales?"
- SIEMPRE debés preguntar por presupuesto antes de cerrar la entrevista, con algo como: "¿Tenés una idea de cuánto querés invertir en este proyecto? Puede ser un rango aproximado en dólares." Si el empresario dice que no sabe, aceptalo y seguí.
- SIEMPRE debés preguntar, antes de cerrar: "¿Actualmente usás algún sistema, app o herramienta para manejar esto, aunque sea un Excel o WhatsApp?" Si la respuesta indica que hay algo existente, preguntá: "¿El nuevo sistema necesita conectarse con lo que ya tenés o arrancamos desde cero?"
- Solo emitís [ENTREVISTA_COMPLETA] cuando tengas: objetivo del proyecto, quiénes lo usan, funciones clave, tecnología preferida, plazo estimado, presupuesto (aunque sea "no sé"), Y si usa sistemas actuales. Nunca antes.
- Respondé SOLO con el token exacto: [ENTREVISTA_COMPLETA] cuando se cumplan todas las condiciones anteriores.

Mensajes sin sentido:
- Si el usuario manda solo números, símbolos, texto irrelevante o respuestas muy cortas sin contexto, NO cierres la entrevista ni emitas [ENTREVISTA_COMPLETA].
- Respondé amablemente redirigiendo: "No te entendí bien. Contame un poco más sobre tu proyecto, ¿qué problema querés resolver?"

Preguntas según tipo de negocio (después de las preguntas base, no en lugar de ellas):
- Si es comercio, restaurante o retail: preguntá si tiene sistema de inventario actual, si los clientes compran en físico/online/ambos, y si necesita integración con pagos como SINPE.
- Si es servicio profesional (clínica, abogado, contador): preguntá si necesita manejo de citas o agenda, y si hay información confidencial de clientes involucrada.
- Si es uso interno u operaciones: preguntá cuántas personas van a usar el sistema, y si necesita integrarse con algún sistema que ya tienen.
- Detectá el tipo de negocio por lo que el empresario describe y elegí las preguntas que correspondan. No hagas preguntas de categorías que no aplican.

Alcance del proyecto:
- Si el proyecto parece demasiado grande para 12 semanas o muy complejo para un desarrollador junior, decilo honestamente y sugerí dividirlo en fases. Ejemplo: "Lo que describís suena a un proyecto grande. Para que un junior pueda resolverlo bien en 12 semanas, ¿podríamos enfocarnos primero en [parte concreta] y dejar el resto para una segunda fase?"
- Nunca rechazés el proyecto — siempre sugerís acotarlo.

Límites:
- Nunca generés código
- Solo hablás del proyecto del empresario`;

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
