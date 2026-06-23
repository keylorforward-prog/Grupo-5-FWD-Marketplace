const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

// Importar Modelos
const Usuario = require('./usuario')(sequelize, DataTypes);
const PerfilEstudiante = require('./perfilEstudiante')(sequelize, DataTypes);
const Curriculum = require('./curriculum')(sequelize, DataTypes);
const HistorialProyectoEstudiante = require('./historialProyectoEstudiante')(sequelize, DataTypes);
const PerfilEmpresario = require('./perfilEmpresario')(sequelize, DataTypes);
const HistorialProyectoEmpresa = require('./historialProyectoEmpresa')(sequelize, DataTypes);
const Propuesta = require('./propuesta')(sequelize, DataTypes);
const OfertaEmpleo = require('./ofertaEmpleo')(sequelize, DataTypes);
const PostulacionEmpleo = require('./postulacionEmpleo')(sequelize, DataTypes);
const CatalogoTecnologia = require('./catalogoTecnologia')(sequelize, DataTypes);
const TecnologiaPropuesta = require('./tecnologiaPropuesta')(sequelize, DataTypes);
const Postulacion = require('./postulacion')(sequelize, DataTypes);
const Conversacion = require('./conversacion')(sequelize, DataTypes);
const Mensaje = require('./mensaje')(sequelize, DataTypes);
const MensajeHistorial = require('./mensajeHistorial')(sequelize, DataTypes);
const ProyectoPlataforma = require('./proyectoPlataforma')(sequelize, DataTypes);
const Entregable = require('./entregable')(sequelize, DataTypes);
const Evaluacion = require('./evaluacion')(sequelize, DataTypes);
const Pago = require('./pago')(sequelize, DataTypes);
const Reporte = require('./reporte')(sequelize, DataTypes);
const Notificacion = require('./notificacion')(sequelize, DataTypes);
const Oferta = require('./oferta')(sequelize, DataTypes);
const CatalogoSector = require('./catalogoSector')(sequelize, DataTypes);
const ConversacionIA = require('./conversacionIA')(sequelize, DataTypes);
const Auditoria = require('./auditoria')(sequelize, DataTypes);
const Configuracion = require('./configuracion')(sequelize, DataTypes);
const CodigoRecuperacion = require('./codigoRecuperacion')(sequelize, DataTypes);
// ========================
// RELACIONES
// ========================

Usuario.hasOne(PerfilEstudiante, { foreignKey: 'id_usuario', as: 'perfilEstudiante' });
PerfilEstudiante.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasMany(Auditoria, { foreignKey: 'actor_id', as: 'auditorias_realizadas' });

Auditoria.belongsTo(Usuario, { foreignKey: 'actor_id', as: 'actor' });

Usuario.hasMany(Configuracion, { foreignKey: 'modificado_por', as: 'configuraciones_modificadas' });
Configuracion.belongsTo(Usuario, { foreignKey: 'modificado_por', as: 'modificador' });

Usuario.hasOne(PerfilEmpresario, { foreignKey: 'id_usuario', as: 'perfilEmpresario' });
PerfilEmpresario.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

PerfilEstudiante.hasOne(Curriculum, { foreignKey: 'id_perfil_estudiante', as: 'curriculum' });
Curriculum.belongsTo(PerfilEstudiante, { foreignKey: 'id_perfil_estudiante', as: 'perfilEstudiante' });

PerfilEstudiante.hasMany(HistorialProyectoEstudiante, { foreignKey: 'id_perfil_estudiante', as: 'historialProyectos' });
HistorialProyectoEstudiante.belongsTo(PerfilEstudiante, { foreignKey: 'id_perfil_estudiante', as: 'perfilEstudiante' });

PerfilEmpresario.hasMany(Propuesta, { foreignKey: 'id_perfil_empresario', as: 'propuestas' });
Propuesta.belongsTo(PerfilEmpresario, { foreignKey: 'id_perfil_empresario', as: 'perfilEmpresario' });

PerfilEmpresario.hasMany(OfertaEmpleo, { foreignKey: 'id_perfil_empresario', as: 'ofertasEmpleo' });
OfertaEmpleo.belongsTo(PerfilEmpresario, { foreignKey: 'id_perfil_empresario', as: 'perfilEmpresario' });

OfertaEmpleo.hasMany(PostulacionEmpleo, { foreignKey: 'id_oferta_empleo', as: 'postulaciones' });
PostulacionEmpleo.belongsTo(OfertaEmpleo, { foreignKey: 'id_oferta_empleo', as: 'oferta' });
PostulacionEmpleo.belongsTo(PerfilEstudiante, { foreignKey: 'id_perfil_estudiante', as: 'estudiante' });
PerfilEstudiante.hasMany(PostulacionEmpleo, { foreignKey: 'id_perfil_estudiante', as: 'postulacionesEmpleo' });

PerfilEmpresario.hasMany(HistorialProyectoEmpresa, { foreignKey: 'id_perfil_empresario', as: 'historialProyectos' });
HistorialProyectoEmpresa.belongsTo(PerfilEmpresario, { foreignKey: 'id_perfil_empresario', as: 'perfilEmpresario' });

Propuesta.belongsToMany(CatalogoTecnologia, {
  through: TecnologiaPropuesta,
  foreignKey: 'id_propuesta',
  otherKey: 'id_tecnologia',
  as: 'tecnologias'
});
CatalogoTecnologia.belongsToMany(Propuesta, {
  through: TecnologiaPropuesta,
  foreignKey: 'id_tecnologia',
  otherKey: 'id_propuesta',
  as: 'propuestas'
});

Propuesta.hasMany(Postulacion, { foreignKey: 'id_propuesta', as: 'postulaciones' });
Postulacion.belongsTo(Propuesta, { foreignKey: 'id_propuesta', as: 'propuesta' });

PerfilEstudiante.hasMany(Postulacion, { foreignKey: 'id_perfil_estudiante', as: 'postulaciones' });
Postulacion.belongsTo(PerfilEstudiante, { foreignKey: 'id_perfil_estudiante', as: 'perfilEstudiante' });

Propuesta.hasOne(ProyectoPlataforma, { foreignKey: 'id_propuesta', as: 'proyecto' });
ProyectoPlataforma.belongsTo(Propuesta, { foreignKey: 'id_propuesta', as: 'propuesta' });

Postulacion.hasMany(Conversacion, { foreignKey: 'id_postulacion', as: 'conversaciones' });
Conversacion.belongsTo(Postulacion, { foreignKey: 'id_postulacion', as: 'postulacion' });

Usuario.hasMany(Conversacion, { foreignKey: 'id_usuario_emisor', as: 'conversaciones_iniciadas' });
Conversacion.belongsTo(Usuario, { foreignKey: 'id_usuario_emisor', as: 'emisor' });

Conversacion.hasMany(Mensaje, { foreignKey: 'id_conversacion', as: 'mensajes' });
Mensaje.belongsTo(Conversacion, { foreignKey: 'id_conversacion', as: 'conversacion' });

Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario_emisor', as: 'mensajes_enviados' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario_emisor', as: 'emisor' });
Mensaje.hasMany(MensajeHistorial, { foreignKey: 'id_mensaje', as: 'historial' });
MensajeHistorial.belongsTo(Mensaje, { foreignKey: 'id_mensaje', as: 'mensaje' });
MensajeHistorial.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'responsable' });

// Auditoría transversal para las entidades operativas más sensibles.
const { getAuditContext } = require('../Services/auditContext');
const { publishAdminActivity } = require('../Services/adminActivityService');
const CAMPOS_SENSIBLES = new Set(['contrasena_hash', 'accessToken', 'refreshToken']);
const limpiarValores = (valores = {}) => Object.fromEntries(
  Object.entries(valores).filter(([campo]) => !CAMPOS_SENSIBLES.has(campo))
);

const instalarAuditoria = (model, entidad) => {
  const registrar = async (accion, instance, options, anterior, nuevo) => {
    if (options?.skipAudit) return;
    const context = getAuditContext();
    const primaryKey = model.primaryKeyAttribute;
    try {
      const evento = await Auditoria.create({
        ...context,
        accion,
        entidad,
        entidad_id: String(instance.get(primaryKey) ?? ''),
        valor_anterior: anterior ? limpiarValores(anterior) : null,
        valor_nuevo: nuevo ? limpiarValores(nuevo) : null,
        metadata: { ruta: context.actor_id ? 'SOLICITUD_AUTENTICADA' : 'PROCESO_SISTEMA' },
        severidad: accion.includes('ELIMIN') ? 'ALTA' : 'INFO',
        resultado: 'EXITOSO',
      }, { transaction: options?.transaction, skipAudit: true });
      publishAdminActivity({ id_auditoria: evento.id_auditoria, accion, entidad, fecha: evento.fecha });
    } catch (error) {
      console.error(`No se pudo registrar auditoría de ${entidad}:`, error.message);
    }
  };

  model.addHook('afterCreate', (instance, options) => registrar(`${entidad.toUpperCase()}_CREADO`, instance, options, null, instance.get({ plain: true })));
  model.addHook('afterUpdate', (instance, options) => {
    const campos = instance.changed() || [];
    const anterior = Object.fromEntries(campos.map((campo) => [campo, instance.previous(campo)]));
    const nuevo = Object.fromEntries(campos.map((campo) => [campo, instance.get(campo)]));
    return registrar(`${entidad.toUpperCase()}_ACTUALIZADO`, instance, options, anterior, nuevo);
  });
  model.addHook('afterDestroy', (instance, options) => registrar(`${entidad.toUpperCase()}_ELIMINADO`, instance, options, instance.get({ plain: true }), null));
};

[
  [Propuesta, 'Propuesta'],
  [ProyectoPlataforma, 'Proyecto'],
  [Conversacion, 'Conversacion'],
  [Mensaje, 'Mensaje'],
  [Postulacion, 'Postulacion'],
  [Oferta, 'Oferta'],
  [Entregable, 'Entregable'],
  [Evaluacion, 'Evaluacion'],
].forEach(([model, entidad]) => instalarAuditoria(model, entidad));

ProyectoPlataforma.hasMany(Entregable, { foreignKey: 'id_proyecto', as: 'entregables' });
Entregable.belongsTo(ProyectoPlataforma, { foreignKey: 'id_proyecto', as: 'proyecto' });

Entregable.hasMany(Evaluacion, { foreignKey: 'id_entregable', as: 'evaluaciones' });
Evaluacion.belongsTo(Entregable, { foreignKey: 'id_entregable', as: 'entregable' });

PerfilEmpresario.hasMany(Evaluacion, { foreignKey: 'id_perfil_empresario', as: 'evaluaciones_hechas' });
Evaluacion.belongsTo(PerfilEmpresario, { foreignKey: 'id_perfil_empresario', as: 'perfilEmpresario' });

ProyectoPlataforma.hasMany(Pago, { foreignKey: 'id_proyecto', as: 'pagos' });
Pago.belongsTo(ProyectoPlataforma, { foreignKey: 'id_proyecto', as: 'proyecto' });

ProyectoPlataforma.hasMany(Reporte, { foreignKey: 'id_proyecto', as: 'reportes' });
Reporte.belongsTo(ProyectoPlataforma, { foreignKey: 'id_proyecto', as: 'proyecto' });

Usuario.hasMany(Reporte, { foreignKey: 'id_usuario', as: 'reportes_hechos' });
Reporte.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasMany(Notificacion, { foreignKey: 'id_usuario', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasMany(CodigoRecuperacion, {foreignKey: 'id_usuario',as: 'codigosRecuperacion'});

CodigoRecuperacion.belongsTo(Usuario, {foreignKey: 'id_usuario',as: 'usuario'});

PerfilEstudiante.hasMany(Oferta, { foreignKey: 'id_perfil_estudiante', as: 'ofertas' });
Oferta.belongsTo(PerfilEstudiante, { foreignKey: 'id_perfil_estudiante', as: 'perfilEstudiante' });

Propuesta.hasMany(Oferta, { foreignKey: 'id_proyecto', as: 'ofertas' });
Oferta.belongsTo(Propuesta, { foreignKey: 'id_proyecto', as: 'propuestaRef' });

module.exports = {
  sequelize,
  Usuario,
  CodigoRecuperacion,
  PerfilEstudiante,
  Curriculum,
  HistorialProyectoEstudiante,
  PerfilEmpresario,
  HistorialProyectoEmpresa,
  Propuesta,
  OfertaEmpleo,
  PostulacionEmpleo,
  CatalogoTecnologia,
  TecnologiaPropuesta,
  Postulacion,
  Conversacion,
  Mensaje,
  MensajeHistorial,
  ProyectoPlataforma,
  Entregable,
  Evaluacion,
  Pago,
  Reporte,
  Notificacion,
  Oferta,
  CatalogoSector,
  ConversacionIA,
  Auditoria,
  Configuracion
};
