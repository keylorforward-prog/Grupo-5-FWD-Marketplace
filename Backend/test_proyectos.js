require('dotenv').config();
const { Propuesta, PerfilEmpresario, Usuario, Oferta } = require('./Models');
const { Op } = require('sequelize');

async function test() {
  try {
    const limit = 25;
    const offset = 0;
    const where = {};
    const proyectos = await Propuesta.findAndCountAll({
      where,
      include: [
        {
          model: PerfilEmpresario,
          as: 'perfilEmpresario',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'correo']
          }]
        },
        {
          model: Oferta,
          as: 'ofertas',
          attributes: ['id_oferta']
        }
      ],
      order: [['fecha_publicacion', 'DESC']],
      limit,
      offset,
      distinct: true
    });
    console.log("SUCCESS!", proyectos.count);
  } catch (err) {
    console.error("FAILED!", err);
  }
  process.exit();
}

test();
