module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Conversacion', {
    id_conversacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_postulacion: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario_emisor: { type: DataTypes.INTEGER, allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    leido: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fecha_envio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'conversacion', timestamps: false, underscored: true, freezeTableName: true });
};