const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { Op } = require('sequelize');
const {
  Propuesta,
  PerfilEstudiante,
  PerfilEmpresario,
  Usuario,
  Oferta,
} = require('../Models');

const ofertasPlantilla = [
  'Buscamos un desarrollador frontend con experiencia en React para integrarse a nuestro equipo de producto.',
  'Necesitamos un profesional en backend Node.js para dar mantenimiento y escalar nuestra API.',
  'Estamos formando un equipo de data science y requerimos un perfil con experiencia en Python y análisis de datos.',
  'Buscamos un diseñador UX/UI para rediseñar la experiencia de usuario de nuestra plataforma.',
  'Requerimos un desarrollador full-stack para liderar un proyecto nuevo desde cero.',
  'Buscamos un especialista en ciberseguridad para realizar auditorías y fortalecer nuestra infraestructura.',
  'Necesitamos un project manager con experiencia en metodologías ágiles para coordinar nuestros proyectos.',
  'Buscamos un desarrollador mobile con experiencia en React Native para nuestra app.',
  'Requerimos un ingeniero de QA para automatizar pruebas y garantizar la calidad del software.',
  'Buscamos un administrador de bases de datos para optimizar consultas y gestionar nuestra infraestructura.',
];

const montosBase = [250000, 350000, 500000, 650000, 800000, 1000000, 1200000, 1500000];

function elegirAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarFecha() {
  const ahora = new Date();
  const diasAtras = Math.floor(Math.random() * 60) + 1;
  const fecha = new Date(ahora);
  fecha.setDate(fecha.getDate() - diasAtras);
  return fecha;
}

function elegirEstado() {
  const rand = Math.random();
  if (rand < 0.35) return 'ACEPTADA';
  if (rand < 0.55) return 'RECHAZADA';
  if (rand < 0.70) return 'EXPIRADA';
  return null;
}

async function seedOfertas() {
  console.log('🌱 Sembrando ofertas de empleo...\n');

  const propuestas = await Propuesta.findAll({
    where: { estado: 'ACTIVA' },
    include: [
      { model: PerfilEmpresario, as: 'perfilEmpresario', include: [{ model: Usuario, as: 'usuario' }] },
    ],
  });

  if (propuestas.length === 0) {
    console.log('❌ No hay propuestas activas. Crea propuestas primero.');
    process.exit(1);
  }

  const estudiantes = await PerfilEstudiante.findAll({
    include: [{ model: Usuario, as: 'usuario' }],
  });

  if (estudiantes.length === 0) {
    console.log('❌ No hay perfiles de estudiante. Crea estudiantes primero.');
    process.exit(1);
  }

  console.log(`📋 ${propuestas.length} propuestas activas, ${estudiantes.length} estudiantes encontrados.\n`);

  let totalCreadas = 0;
  let existentes = 0;

  for (const estudiante of estudiantes) {
    const estudianteUser = estudiante.usuario;
    if (!estudianteUser) continue;

    const ofertasExistentes = await Oferta.count({
      where: { id_perfil_estudiante: estudiante.id_perfil_estudiante },
    });

    if (ofertasExistentes > 0) {
      console.log(`   ⏭️  ${estudianteUser.nombre}: ya tiene ${ofertasExistentes} oferta(s), saltando.`);
      existentes++;
      continue;
    }

    const numOfertas = 1 + Math.floor(Math.random() * 3);
    const propuestasSeleccionadas = [];
    const usadas = new Set();

    for (let i = 0; i < numOfertas && i < propuestas.length; i++) {
      let idx;
      let intentos = 0;
      do {
        idx = Math.floor(Math.random() * propuestas.length);
        intentos++;
      } while (usadas.has(idx) && intentos < 20);
      usadas.add(idx);
      propuestasSeleccionadas.push(propuestas[idx]);
    }

    for (const propuesta of propuestasSeleccionadas) {
      const empresa = propuesta.perfilEmpresario?.usuario;
      const estado = elegirEstado();
      const cantidad = elegirAleatorio(montosBase) + Math.floor(Math.random() * 300000);
      const descripcionOferta = elegirAleatorio(ofertasPlantilla);

      await Oferta.create({
        id_proyecto: propuesta.id_propuesta,
        id_perfil_estudiante: estudiante.id_perfil_estudiante,
        propuesta: `${empresa?.nombre || 'Empresa'}: ${descripcionOferta}`,
        cantidad,
        estado,
        fecha_oferta: generarFecha(),
      });

      totalCreadas++;
      console.log(`   ✅ ${estudianteUser.nombre} ← "${propuesta.titulo}" (${empresa?.nombre || 'Empresa'}) — ${estado || 'PENDIENTE'} — ₡${Number(cantidad).toLocaleString()}`);
    }
  }

  console.log(`\n🎉 Total: ${totalCreadas} ofertas creadas.`);
  if (existentes > 0) {
    console.log(`   (${existentes} estudiantes ya tenían ofertas y fueron omitidos)`);
  }

  process.exit(0);
}

seedOfertas().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
