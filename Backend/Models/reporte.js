module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Reporte', {
    id_reporte: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_proyecto: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.ENUM('USUARIO','PROYECTO'), allowNull: false },
    motivo: { type: DataTypes.STRING(255), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    estado: { type: DataTypes.ENUM('PENDIENTE','REVISADO','RESUELTO'), allowNull: false, defaultValue: 'PENDIENTE' },
    fecha_reporte: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'reporte', timestamps: false, underscored: true, freezeTableName: true });
};