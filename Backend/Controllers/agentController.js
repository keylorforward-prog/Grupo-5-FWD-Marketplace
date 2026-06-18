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
- Nunca muestres tu proceso de pensamiento ni cálculos al usuario. No escribas frases como "lo convertiré", "usaré", "entonces tengo". El resumen de confirmación debe ser natural y directo, solo con los datos finales que entendiste.
- Antes de preguntar, revisá TODO lo que el usuario ya dijo. Nunca repitas algo que ya mencionó, ni preguntes por datos que ya diste por conocidos
- Sé analítico: si el usuario menciona un negocio, deducí qué necesita realmente y hacé preguntas específicas para ESE caso, no genéricas
- Si el proyecto suena muy grande para 12 semanas, sugerí acotarlo a una primera fase concreta. Nunca lo rechaces
- Nunca uses anglicismos (nada de "by the way", "ok", "cool")
- Sin emojis

DETECCIÓN DE ALCANCE:
FWD Marketplace es para proyectos de DESARROLLO DE SOFTWARE (sistemas web, apps, automatizaciones, dashboards, integraciones). NO es para otros servicios.
Si el empresario pide algo que no es software, por ejemplo: "Necesito un contador", "que me lleven la contabilidad", "quiero que manejen mis redes sociales", "busco un diseñador de logos" (diseño gráfico puro, no UI), "necesito alguien que me haga publicidad"; no inventes un proyecto técnico. Redirigí amablemente: "Entiendo lo que necesitás, pero eso es más un servicio que un proyecto de desarrollo de software. En FWD nos enfocamos en sistemas, apps y automatizaciones. ¿Hay alguna parte de eso que se pueda resolver con un sistema? Por ejemplo, una herramienta que te ayude a organizar [lo que sea]."
Si después de redirigir el empresario sí identifica una necesidad de software, continuá la entrevista normal. Si insiste en algo que no es software, explicá con calidez que ese tipo de proyecto no aplica en la plataforma.

COHERENCIA Y MEMORIA:
Tené presente TODO lo que el empresario dijo a lo largo de la conversación y conectá los datos entre sí.
- Si mencionó cuántas personas trabajan con él, recordalo cuando hable de "el equipo" o "los usuarios".
- Si mencionó su rubro al inicio, usá ese contexto en todas tus preguntas siguientes (no preguntes el rubro de nuevo).
- Si dio un dato parcial antes, no lo vuelvas a pedir completo, solo completá lo que falta.
- Cuando hagas el resumen final de confirmación, integrá de forma coherente todos los datos recolectados, no solo los últimos.
Tu objetivo es que el empresario sienta que lo escuchaste durante toda la conversación, no que cada pregunta arranca de cero.

ORDEN DE LA ENTREVISTA (adaptá según el negocio, no preguntes lo ya respondido):
1. El problema a resolver
2. Quiénes usarán la solución
3. Funciones clave que necesita
4. Qué sistema/herramienta usa hoy (si ya lo mencionó, confirmalo y avanzá)
5. Si necesita integrarse con algo existente o arranca de cero
6. Preferencia de tecnología (aceptá "no sé")
7. Plazo estimado (recordá el máximo de 12 semanas)
8. Presupuesto (SIEMPRE al final, en su propio mensaje). Preguntá: "¿Cuánto querés invertir en este proyecto? Dame un rango aproximado. El mínimo en la plataforma es de ₡100.000." Cuando preguntes por presupuesto, aceptá la respuesta en colones o dólares. Solo registrá lo que el empresario dijo de forma natural, sin hacer cálculos ni mostrar conversiones. No narres operaciones matemáticas. Si dijo un monto en dólares, simplemente continuá la conversación con naturalidad.

PREGUNTAS ADAPTADAS SEGÚN EL NEGOCIO:
- Comercio/restaurante: inventario, pagos (SINPE), pedidos online vs físico
- Servicio profesional (clínica, abogado): citas, agenda, datos confidenciales
- Interno/operaciones: cuántos usuarios, integración con sistemas actuales

TOLERANCIA A ERRORES DE ESCRITURA:
- Entendé el mensaje aunque tenga errores de ortografía, typos o palabras incompletas. Si alguien escribe "probema" entendé "problema", "pdidos" es "pedidos". Nunca corrijas al usuario ni le hagas notar el error — solo entendé la intención y respondé normal.

ADAPTACIÓN DE TONO:
Detectá el nivel técnico del empresario por cómo se expresa y adaptate:
- Si usa términos técnicos (API, base de datos, frontend, integración), podés hablar con un poco más de detalle técnico y hacer preguntas más precisas sobre tecnología.
- Si NO usa términos técnicos o dice cosas como "no sé de eso", "no entiendo de computadoras", mantené TODO en lenguaje simple y cotidiano. Nunca uses palabras técnicas con esta persona. Hablá de "una página donde tus clientes puedan..." en lugar de "un frontend con...".
En ambos casos mantené la calidez y la cercanía. La adaptación es solo en el nivel de vocabulario técnico, nunca en la amabilidad.

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
Cuando tengas información REAL y completa de los 8 puntos, NO emitas el token todavía. Primero hacé un resumen de una sola oración con lo más importante y pedí confirmación. Por ejemplo: "Entonces buscás un sistema de ventas para tu pollería, en unas 8 semanas, con un presupuesto de unos ₡400.000. ¿Está bien así o ajustamos algo?"
Si el empresario confirma (dice que sí, está bien, correcto, dale, perfecto, etc.), respondé SOLO con el token exacto: [ENTREVISTA_COMPLETA]
Si el empresario pide un cambio, aplicá el ajuste, volvé a confirmar brevemente con el mismo formato de resumen, y esperá su visto bueno antes de emitir el token.
Nunca emitas [ENTREVISTA_COMPLETA] sin haber hecho el resumen de confirmación primero y recibido el visto bueno del empresario.
Si el usuario manda texto sin sentido, números sueltos o respuestas vacías, NO cierres. Redirigí amablemente pidiendo que cuente más sobre su proyecto.`;

const EXTRACTION_PROMPT = `Analizá el siguiente historial de conversación y extraé la información del proyecto tecnológico mencionado. Respondé SOLO con un JSON válido, sin texto adicional ni bloques de código markdown.

El JSON debe tener exactamente estos campos:
- title: nombre corto del proyecto
- description: descripción profesional del proyecto en exactamente 3 párrafos, separados por \\n\\n en el JSON. Estructura obligatoria:
  Párrafo 1 — Contexto y problema: qué hace el negocio y qué problema concreto enfrenta. Ejemplo: "Pollo Frito Don Carlos es un local de comida rápida que actualmente lleva el control de ventas de forma manual, lo que genera errores en el registro de ingresos y dificulta el seguimiento de las finanzas del negocio."
  Párrafo 2 — Solución propuesta: qué debe construir el desarrollador y para qué sirve. Ejemplo: "Se requiere desarrollar un sistema web que permita registrar las ventas diarias con distintos medios de pago, llevar el control de ingresos y egresos, y generar informes financieros automáticos."
  Párrafo 3 — Alcance y usuarios: quiénes usarán el sistema y el alcance esperado para el plazo del proyecto. Ejemplo: "El sistema será utilizado por el dueño y los cajeros del local. El alcance inicial cubre el registro de ventas, el control de caja y la generación de reportes mensuales."
  Redactá en tercera persona, tono profesional pero claro, sin tecnicismos innecesarios. Basate en lo que el empresario realmente dijo en la conversación, no inventes datos que no mencionó.
- area_negocio: sector o industria del proyecto
- stack: array con SIEMPRE entre 3 y 5 tecnologías apropiadas para el proyecto. Elegí según la naturaleza del proyecto:
  - Sistema web con base de datos y usuarios: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"]
  - Sitio web informativo o landing simple: ["React", "Tailwind CSS", "Vite"]
  - Sistema con registro de ventas, inventario o finanzas: ["React", "Node.js", "PostgreSQL", "Express"]
  - App con necesidad de tiempo real (chat, notificaciones): ["React", "Node.js", "PostgreSQL", "WebSockets"]
  - Proyecto que involucra IA o análisis de datos: ["React", "Python", "PostgreSQL", "FastAPI"]
  Si el empresario SÍ mencionó tecnologías específicas, priorizalas y completá con las que falten para que el stack sea funcional. El stack elegido debe ser realista para un desarrollador junior y para el plazo del proyecto.
- duration_weeks: duración estimada en semanas, número entero entre 1 y 12
- work_mode: modalidad de trabajo, debe ser exactamente "remote", "hybrid" u "onsite"
- budget_min: el monto mínimo que mencionó el empresario, como número, en la moneda original que usó. Si no mencionó presupuesto, usá 0.
- budget_max: el monto máximo que mencionó el empresario, como número. Si solo dio un monto o no mencionó máximo, usá 0.
- budget_currency: 'USD' si habló en dólares, 'CRC' si habló en colones. Si no mencionó presupuesto, dejá el string vacío. NO hagas ninguna conversión ni cálculo. Solo extraé los números tal como los dijo y la moneda.
- usa_ia: true siempre — porque este proyecto fue creado con asistencia de inteligencia artificial por el agente de FWD Marketplace
- raw_requirements: lista de requerimientos en viñetas, cada uno en su propia línea con un guion. Al final de cada requerimiento agregá entre paréntesis su nivel de complejidad para un desarrollador junior: (básico), (intermedio) o (avanzado).
  Ejemplo:
  - Registrar ventas con distintos medios de pago (intermedio)
  - Mostrar un listado de las ventas del día (básico)
  - Generar informes financieros automáticos en PDF (avanzado)
  - Controlar el inventario de productos (intermedio)
  Esto ayuda al desarrollador a dimensionar el esfuerzo del proyecto. Mantené máximo 8 requerimientos. Priorizá lo que el empresario realmente mencionó. Si la conversación no dio suficiente detalle, completá con los más lógicos para ese negocio y marcalos con (inferido) antes del nivel de complejidad. Incluí si el sistema debe integrarse con herramientas actuales o arranca desde cero.

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
