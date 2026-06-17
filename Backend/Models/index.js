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
const CatalogoTecnologia = require('./catalogoTecnologia')(sequelize, DataTypes);
const TecnologiaPropuesta = require('./tecnologiaPropuesta')(sequelize, DataTypes);
const Postulacion = require('./postulacion')(sequelize, DataTypes);
const Conversacion = require('./conversacion')(sequelize, DataTypes);
const Mensaje = require('./mensaje')(sequelize, DataTypes);
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

PerfilEstudiante.hasMany(Oferta, { foreignKey: 'id_perfil_estudiante', as: 'ofertas' });
Oferta.belongsTo(PerfilEstudiante, { foreignKey: 'id_perfil_estudiante', as: 'perfilEstudiante' });

Propuesta.hasMany(Oferta, { foreignKey: 'id_proyecto', as: 'ofertas' });
Oferta.belongsTo(Propuesta, { foreignKey: 'id_proyecto', as: 'propuestaRef' });

module.exports = {
  sequelize,
  Usuario,
  PerfilEstudiante,
  Curriculum,
  HistorialProyectoEstudiante,
  PerfilEmpresario,
  HistorialProyectoEmpresa,
  Propuesta,
  CatalogoTecnologia,
  TecnologiaPropuesta,
  Postulacion,
  Conversacion,
  Mensaje,
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
