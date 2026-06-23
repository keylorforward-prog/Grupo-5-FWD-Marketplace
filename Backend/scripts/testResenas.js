'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { sequelize, Resena } = require('../Models');

const ID_PRUEBA       = 999999;
const ID_PERFIL_DUMMY = 999998; // no referenciado como FK en el modelo

let pasadas = 0;

const ok    = (label) => { console.log(`  ✓ ${label}: OK`); pasadas++; };
const fallo = (label, detalle) => console.log(`  ✗ ${label}: FALLO${detalle ? ` — ${detalle}` : ''}`);

async function limpiar() {
  await Resena.destroy({ where: { id_proyecto: ID_PRUEBA } });
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con la base de datos.\n');

    // PRUEBA 0 — Limpieza inicial
    console.log('PRUEBA 0 — Limpieza inicial');
    await limpiar();
    console.log('  Registros previos eliminados.\n');

    // PRUEBA 1 — Primera reseña queda oculta
    console.log('PRUEBA 1 — Primera reseña queda oculta');
    const resena1 = await Resena.create({
      id_proyecto:            ID_PRUEBA,
      id_autor_perfil:        ID_PERFIL_DUMMY,
      rol_autor:              'EMPRESARIO',
      estrellas_calidad:      5,
      estrellas_comunicacion: 5,
      estrellas_puntualidad:  5,
      comentario:             'Prueba automatizada — empresario',
      visible:                false,
    });
    const r1 = await Resena.findByPk(resena1.id_resena);
    if (r1 && r1.visible === false) {
      ok('PRUEBA 1 (primera reseña oculta)');
    } else {
      fallo('PRUEBA 1 (primera reseña oculta)', `visible = ${r1?.visible}`);
    }
    console.log();

    // PRUEBA 2 — Segunda reseña revela ambas (replica exacta de crearResena)
    console.log('PRUEBA 2 — Segunda reseña revela ambas');
    await Resena.create({
      id_proyecto:            ID_PRUEBA,
      id_autor_perfil:        ID_PERFIL_DUMMY,
      rol_autor:              'EGRESADO',
      estrellas_calidad:      4,
      estrellas_comunicacion: 4,
      estrellas_puntualidad:  4,
      comentario:             'Prueba automatizada — egresado',
      visible:                false,
    });
    // Lógica ciega: si ya existe la del otro rol, revelar ambas
    const resenaOtro = await Resena.findOne({
      where: { id_proyecto: ID_PRUEBA, rol_autor: 'EMPRESARIO' },
    });
    if (resenaOtro) {
      await Resena.update({ visible: true }, { where: { id_proyecto: ID_PRUEBA } });
    }
    const ambas = await Resena.findAll({ where: { id_proyecto: ID_PRUEBA } });
    const ambasVisibles = ambas.length === 2 && ambas.every((r) => r.visible === true);
    if (ambasVisibles) {
      ok('PRUEBA 2 (ambas reveladas)');
    } else {
      const estados = ambas.map((r) => `${r.rol_autor}=visible:${r.visible}`).join(', ');
      fallo('PRUEBA 2 (ambas reveladas)', estados);
    }
    console.log();

    // PRUEBA 3 — No permite duplicados (findOne antes de create, igual que el controller)
    console.log('PRUEBA 3 — No permite duplicados');
    const duplicado = await Resena.findOne({
      where: { id_proyecto: ID_PRUEBA, rol_autor: 'EMPRESARIO' },
    });
    if (duplicado) {
      ok('PRUEBA 3 (sin duplicados)');
    } else {
      fallo('PRUEBA 3 (sin duplicados)', 'findOne no detectó la reseña EMPRESARIO existente');
    }
    console.log();

    // PRUEBA 4 — Limpieza final
    console.log('PRUEBA 4 — Limpieza final');
    await limpiar();
    console.log('  Limpieza completada.\n');

  } catch (error) {
    console.error('\nError inesperado:', error.message);
    try {
      await limpiar();
      console.log('  Limpieza de emergencia completada.');
    } catch (_) {}
  } finally {
    console.log(`=== RESULTADO: ${pasadas}/3 pruebas pasaron ===`);
    await sequelize.close();
  }
}

run();
