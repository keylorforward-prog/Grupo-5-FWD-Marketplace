module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PerfilEstudiante', {
    id_perfil_estudiante: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    titulo_fwd: { type: DataTypes.STRING(150), allowNull: false },
    sede_graduacion: { type: DataTypes.STRING(200), allowNull: true },
    estado_verificacion: { type: DataTypes.ENUM('PENDIENTE','VERIFICADO','RECHAZADO'), allowNull: false, defaultValue: 'PENDIENTE' },
    reputacion_total: { type: DataTypes.DECIMAL(4,2), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    fecha_verificacion: { type: DataTypes.DATE, allowNull: true },
    telefono_whatsapp: { type: DataTypes.STRING(30), allowNull: true },
    verificado_por: { type: DataTypes.INTEGER, allowNull: true },
    motivo_rechazo: { type: DataTypes.STRING(500), allowNull: true },
    metodo_verificacion: { type: DataTypes.ENUM('API', 'MANUAL', 'DOCUMENTO'), allowNull: true },
    match_automatico: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false }
  }, { tableName: 'perfil_estudiante', timestamps: false, underscored: true, freezeTableName: true });
};