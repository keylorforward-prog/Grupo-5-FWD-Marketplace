const {
  PerfilEstudiante,
  PerfilEmpresario,
  Postulacion,
  Propuesta,
  ProyectoPlataforma,
  Resena,
} = require('../Models');

const responderError = (res, error, mensaje) => {
  console.error(mensaje, error);
  res.status(500).json({ success: false, message: mensaje });
};

const resolverPerfilEstudiante = async (req, res) => {
  const perfil = await PerfilEstudiante.findOne({ where: { id_usuario: req.user.id_usuario } });
  if (!perfil) {
    res.status(404).json({ success: false, message: 'No existe un PerfilEstudiante para el usuario autenticado.' });
    return null;
  }
  return perfil;
};

const resolverPerfilEmpresario = async (req, res) => {
  const perfil = await PerfilEmpresario.findOne({ where: { id_usuario: req.user.id_usuario } });
  if (!perfil) {
    res.status(404).json({ success: false, message: 'No existe un PerfilEmpresario para el usuario autenticado.' });
    return null;
  }
  return perfil;
};

const crearResena = async (req, res) => {
  try {
    const {
      id_proyecto,
      estrellas_calidad,
      estrellas_comunicacion,
      estrellas_puntualidad,
      comentario,
      rol_autor,
    } = req.body;

    let id_autor_perfil;
    if (rol_autor === 'EMPRESARIO') {
      const perfil = await resolverPerfilEmpresario(req, res);
      if (!perfil) return;
      id_autor_perfil = perfil.id_perfil_empresario;
    } else {
      const perfil = await resolverPerfilEstudiante(req, res);
      if (!perfil) return;
      id_autor_perfil = perfil.id_perfil_estudiante;
    }

    const yaExiste = await Resena.findOne({ where: { id_proyecto, rol_autor } });
    if (yaExiste) {
      return res.status(409).json({ success: false, message: 'Ya existe una reseña de este rol para el proyecto.' });
    }

    const resena = await Resena.create({
      id_proyecto,
      id_autor_perfil,
      rol_autor,
      estrellas_calidad,
      estrellas_comunicacion,
      estrellas_puntualidad,
      comentario: comentario || null,
      visible: false,
    });

    const rolOpuesto = rol_autor === 'EMPRESARIO' ? 'EGRESADO' : 'EMPRESARIO';
    const resenaOtro = await Resena.findOne({ where: { id_proyecto, rol_autor: rolOpuesto } });

    if (resenaOtro) {
      await Resena.update({ visible: true }, { where: { id_proyecto } });
    }

    res.status(201).json({ success: true, data: resena });
  } catch (error) {
    responderError(res, error, 'Error al crear la reseña.');
  }
};

const listarResenasVisibles = async (req, res) => {
  try {
    const { id_perfil, rol } = req.params;
    const rolOpuesto = rol === 'EMPRESARIO' ? 'EGRESADO' : 'EMPRESARIO';

    let proyectosIds;

    if (rol === 'EMPRESARIO') {
      const proyectos = await ProyectoPlataforma.findAll({
        include: [{
          model: Propuesta,
          as: 'propuesta',
          where: { id_perfil_empresario: id_perfil },
          attributes: [],
        }],
        attributes: ['id_proyecto'],
      });
      proyectosIds = proyectos.map((p) => p.id_proyecto);
    } else {
      const postulaciones = await Postulacion.findAll({
        where: { id_perfil_estudiante: id_perfil, estado: 'CONTRATADO' },
        attributes: ['id_propuesta'],
      });
      const propuestaIds = postulaciones.map((p) => p.id_propuesta);
      const proyectos = await ProyectoPlataforma.findAll({
        where: { id_propuesta: propuestaIds },
        attributes: ['id_proyecto'],
      });
      proyectosIds = proyectos.map((p) => p.id_proyecto);
    }

    if (!proyectosIds.length) {
      return res.json({ success: true, data: [] });
    }

    const resenas = await Resena.findAll({
      where: { id_proyecto: proyectosIds, rol_autor: rolOpuesto, visible: true },
      order: [['fecha_resena', 'DESC']],
    });

    res.json({ success: true, data: resenas });
  } catch (error) {
    responderError(res, error, 'Error al listar las reseñas.');
  }
};

const obtenerResenaPropia = async (req, res) => {
  try {
    const { id_proyecto, rol } = req.params;
    const resena = await Resena.findOne({ where: { id_proyecto, rol_autor: rol } });
    res.json({ success: true, data: resena || null });
  } catch (error) {
    responderError(res, error, 'Error al obtener la reseña propia.');
  }
};

module.exports = { crearResena, listarResenasVisibles, obtenerResenaPropia };
