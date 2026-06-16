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
- Presupuesto en colones costarricenses (₡). El mínimo en la plataforma es ₡100.000, los montos típicos van de ₡100.000 a ₡800.000
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

TOLERANCIA A ERRORES DE ESCRITURA:
- Entendé el mensaje aunque tenga errores de ortografía, typos o palabras incompletas. Si alguien escribe "probema" entendé "problema", "pdidos" es "pedidos". Nunca corrijas al usuario ni le hagas notar el error — solo entendé la intención y respondé normal.

MANEJO DE RESPUESTAS VAGAS:
- Si el empresario da una respuesta muy general o incompleta (ej: "quiero una app", "algo para vender"), no la aceptes tal cual. Pedí un ejemplo concreto con una repregunta amable: "Contame un poco más, ¿qué te gustaría que haga exactamente esa app?"
- No avances a la siguiente pregunta hasta tener algo concreto y útil.

VALIDACIÓN DE VIABILIDAD PARA UN JUNIOR:
- Si lo que pide suena demasiado grande o complejo (ej: "una red social completa", "un sistema bancario", "un ERP entero"), no lo rechaces. Sugerí enfocar en una primera fase concreta: "Eso es un proyecto grande. Para arrancar bien, ¿qué tal si nos enfocamos primero en [parte específica más importante]?"

ESTIMACIÓN INTELIGENTE DE PLAZO:
- Cuando el empresario no sepa cuánto tiempo necesita, estimá vos según la complejidad descrita y proponéselo: "Por lo que me contás, esto se podría hacer en unas X semanas. ¿Te parece?"
- Proyectos simples (una landing, un formulario): 1-3 semanas
- Proyectos medios (un sistema de pedidos, agenda de citas): 4-8 semanas
- Proyectos más completos (panel admin + varias funciones): 9-12 semanas

SUGERENCIA DE STACK:
- Si el empresario dice que no sabe de tecnología, no lo dejes vacío. Sugerí un stack apropiado de forma simple y sin tecnicismos: "No te preocupés por la tecnología, para algo así el desarrollador probablemente use [stack simple]. Lo dejo anotado como sugerencia."
- Web simple: React + Tailwind
- Con base de datos y usuarios: React + Node.js + PostgreSQL
- Con necesidad de IA: agregá una nota de que se puede integrar IA

EJEMPLOS CONCRETOS SEGÚN EL NEGOCIO:
- Cuando hagas preguntas, aterrizalas con ejemplos del rubro del empresario.
- Restaurante: "¿Querés que los clientes pidan online, como un Uber Eats propio, o solo organizar los pedidos internos?"
- Clínica: "¿Las citas las agendaría el paciente solo, o tu recepcionista?"
- Tienda: "¿Necesitás cobrar en línea con SINPE o tarjeta, o solo mostrar el catálogo?"
- Los ejemplos hacen que el empresario entienda mejor qué le estás preguntando.

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
- raw_requirements: Lista de hasta 8 requerimientos funcionales, uno por línea, separados por salto de línea real. Cada uno empieza con "- " seguido de un verbo directo en infinitivo, sin repetir "El sistema debe" en cada ítem. Usá verbos variados (registrar, consultar, generar, cancelar, notificar, exportar, etc.). Ejemplo correcto: "- Registrar pedidos de forma rápida\n- Ver el historial de pedidos del día\n- Cancelar pedidos cuando sea necesario\n- Generar un resumen diario de ventas (inferido)". Ejemplo incorrecto: "El sistema debe permitir registrar pedidos, El sistema debe permitir ver historial". Priorizá lo que el empresario realmente mencionó. Si la conversación no dio suficiente detalle, completá con los más lógicos para ese negocio y marcalos con (inferido) al final de esa línea. Incluí si el sistema debe integrarse con herramientas actuales o arranca desde cero.

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
