const { Propuesta, Postulacion, PerfilEmpresario, PerfilEstudiante, Usuario, sequelize } = require('../Models');

async function check() {
  // Find David's empresario profile
  const david = await Usuario.findOne({ where: { nombre: 'David Montero Barrantes' } });
  console.log('David: id_usuario', david.id_usuario);
  
  const perfil = await PerfilEmpresario.findOne({ where: { id_usuario: david.id_usuario } });
  console.log('PerfilEmpresario id:', perfil.id_perfil_empresario);
  
  // Find David's propuestas
  const props = await Propuesta.findAll({ where: { id_perfil_empresario: perfil.id_perfil_empresario } });
  console.log("\nDavid's propuestas:");
  for (const p of props) {
    console.log('  id:', p.id_propuesta, 'titulo:', p.titulo);
    const posts = await Postulacion.findAll({ 
      where: { id_propuesta: p.id_propuesta },
      include: [{ model: PerfilEstudiante, as: 'perfilEstudiante', include: [{ model: Usuario, as: 'usuario' }] }]
    });
    for (const po of posts) {
      console.log('    -> Post id:', po.id_postulacion, 'estado:', po.estado, 'estudiante:', po.perfilEstudiante?.usuario?.nombre);
    }
  }
  process.exit(0);
}

check();
