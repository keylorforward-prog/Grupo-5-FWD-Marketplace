module.exports = (sequelize, DataTypes) => sequelize.define('MensajeHistorial', {
  id_historial: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_mensaje: { type: DataTypes.INTEGER, allowNull: false },
  id_usuario: { type: DataTypes.INTEGER, allowNull: true },
  accion: { type: DataTypes.STRING(20), allowNull: false },
  contenido_anterior: { type: DataTypes.TEXT, allowNull: true },
  contenido_nuevo: { type: DataTypes.TEXT, allowNull: true },
  motivo: { type: DataTypes.TEXT, allowNull: true },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: 'mensaje_historial', timestamps: false, underscored: true, freezeTableName: true });
