module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Mensaje', {
    id_mensaje: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_conversacion: { type: DataTypes.INTEGER, allowNull: false },
    id_usuario_emisor: { type: DataTypes.INTEGER, allowNull: false },
    contenido: { type: DataTypes.TEXT, allowNull: false },
    archivo_url: { type: DataTypes.STRING(500), allowNull: true },
    fecha_envio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_edicion: { type: DataTypes.DATE, allowNull: true },
    fecha_eliminacion: { type: DataTypes.DATE, allowNull: true },
    editado_por: { type: DataTypes.INTEGER, allowNull: true },
    eliminado_por: { type: DataTypes.INTEGER, allowNull: true },
    motivo_eliminacion: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'mensaje', timestamps: false, underscored: true, freezeTableName: true });
};
