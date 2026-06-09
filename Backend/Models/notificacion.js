module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Notificacion', {
    id_notificacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.STRING(100), allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    leido: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'notificacion', timestamps: false, underscored: true, freezeTableName: true });
};