module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Mensaje', {
    id_mensaje: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_conversacion: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario_emisor: { type: DataTypes.INTEGER, allowNull: false },
    contenido: { type: DataTypes.TEXT, allowNull: false },
    archivo_url: { type: DataTypes.STRING(500), allowNull: true },
    fecha_envio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'mensaje', timestamps: false, underscored: true, freezeTableName: true });
};