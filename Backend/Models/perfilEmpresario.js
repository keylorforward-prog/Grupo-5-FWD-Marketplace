module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PerfilEmpresario', {
    id_perfil_empresario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    nombre_empresa: { type: DataTypes.STRING(150), allowNull: true },
    sector: { type: DataTypes.STRING(100), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    logo: { type: DataTypes.STRING(500), allowNull: true },
    sitio_web: { type: DataTypes.STRING(255), allowNull: true },
    fecha_registro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    telefono_whatsapp: { type: DataTypes.STRING(30), allowNull: true },
    cedula_juridica_archivo: { type: DataTypes.STRING(500), allowNull: true },
    notif_postulaciones: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    notif_resumen_semanal: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    notif_mensajes_directos: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, { tableName: 'perfil_empresario', timestamps: false, underscored: true, freezeTableName: true });
};