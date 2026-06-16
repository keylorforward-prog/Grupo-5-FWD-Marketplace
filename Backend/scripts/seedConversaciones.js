const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { Op } = require('sequelize');
const {
  Usuario,
  Postulacion,
  Propuesta,
  PerfilEstudiante,
  PerfilEmpresario,
  Conversacion,
} = require('../Models');

const mensajesPlantilla = [
  'Hola, me interesa tu proyecto. ¿Podemos coordinar una reunión?',
  '¡Hola! Gracias por tu interés. Claro, podemos agendar una videollamada para esta semana.',
  'Perfecto, ¿qué tal el jueves a las 10 am?',
  'Me parece bien. Te comparto los detalles del proyecto para que los revises.',
  'Genial, ya revisé la información. Me gusta mucho el enfoque del proyecto.',
  'Excelente. ¿Tienes experiencia con las tecnologías que mencionamos?',
  'Sí, he trabajado con React y Node.js en proyectos anteriores. Tengo 3 años de experiencia.',
  'Qué bien. Creo que encajas perfectamente con lo que estamos buscando.',
  'Muchas gracias. Estoy muy motivado con esta oportunidad.',
  'Te comento que ya revisamos tu perfil y nos parece muy interesante.',
  'Gracias por la oportunidad. ¿Cuándo podríamos tener una respuesta?',
  'Estaremos evaluando las postulaciones esta semana y te daremos respuesta pronto.',
  'Perfecto, quedo atento. Saludos.',
  'Saludos, quedo pendiente de cualquier novedad.',
  'Hola, ¿cómo estás? Quería saber si tienes disponibilidad para iniciar el proyecto la próxima semana.',
  '¡Hola! Sí, tengo disponibilidad. Podemos iniciar sin problema.',
  'Excelente. Te estaré enviando los detalles para arrancar.',
  'Recibido. Gracias por la confianza.',
];

function elegirMensajes() {
  const count = 3 + Math.floor(Math.random() * 6);
  const seleccionados = [];
  const usados = new Set();
  for (let i = 0; i < count; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * mensajesPlantilla.length);
    } while (usados.has(idx));
    usados.add(idx);
    seleccionados.push(mensajesPlantilla[idx]);
  }
  return seleccionados;
}

function sumarMinutos(fecha, minutos) {
  const d = new Date(fecha);
  d.setMinutes(d.getMinutes() + minutos);
  return d;
}

async function seedConversaciones() {
  console.log('🌱 Sembrando conversaciones...\n');

  const postulaciones = await Postulacion.findAll({
    include: [
      { model: PerfilEstudiante, as: 'perfilEstudiante', include: [{ model: Usuario, as: 'usuario' }] },
      { model: Propuesta, as: 'propuesta', include: [{ model: PerfilEmpresario, as: 'perfilEmpresario', include: [{ model: Usuario, as: 'usuario' }] }] },
    ],
  });

  if (postulaciones.length === 0) {
    console.log('❌ No hay postulaciones en la base de datos. Crea postulaciones primero.');
    process.exit(1);
  }

  console.log(`📋 Encontradas ${postulaciones.length} postulaciones.`);

  let totalCreadas = 0;
  let existentes = 0;

  for (const postulacion of postulaciones) {
    const estudianteUser = postulacion.perfilEstudiante?.usuario;
    const empresarioUser = postulacion.propuesta?.perfilEmpresario?.usuario;

    if (!estudianteUser || !empresarioUser) {
      console.log(`   ⏭️  Postulación #${postulacion.id_postulacion}: sin usuario relacionado, saltando.`);
      continue;
    }

    const yaTieneMensajes = await Conversacion.findOne({
      where: { id_postulacion: postulacion.id_postulacion },
    });

    if (yaTieneMensajes) {
      console.log(`   ⏭️  Postulación #${postulacion.id_postulacion}: ya tiene mensajes, saltando.`);
      existentes++;
      continue;
    }

    const mensajes = elegirMensajes();
    let ultimaFecha = postulacion.fecha_postulacion || new Date();

    for (let i = 0; i < mensajes.length; i++) {
      const esEstudiante = i % 2 === 0;
      const emisorId = esEstudiante ? estudianteUser.id_usuario : empresarioUser.id_usuario;
      ultimaFecha = sumarMinutos(ultimaFecha, 30 + Math.floor(Math.random() * 120));

      await Conversacion.create({
        id_postulacion: postulacion.id_postulacion,
        id_usuario_emisor: emisorId,
        mensaje: mensajes[i],
        leido: i < mensajes.length - 1,
        fecha_envio: ultimaFecha,
      });

      totalCreadas++;
    }

    const nombreProyecto = postulacion.propuesta?.titulo || 'Sin título';
    console.log(`   ✅ Postulación #${postulacion.id_postulacion} — "${nombreProyecto}" → ${mensajes.length} mensajes (${estudianteUser.nombre} ↔ ${empresarioUser.nombre})`);
  }

  console.log(`\n🎉 Total: ${totalCreadas} mensajes creados en ${postulaciones.length - existentes} conversaciones.`);
  if (existentes > 0) console.log(`   (${existentes} conversaciones ya existían y fueron omitidas)`);

  process.exit(0);
}

seedConversaciones().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
