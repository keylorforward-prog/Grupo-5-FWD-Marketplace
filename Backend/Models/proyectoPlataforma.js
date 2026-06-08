module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ProyectoPlataforma', {
    id_proyecto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_propuesta: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    estado: { type: DataTypes.ENUM('ABIERTO','EN_PROGRESO','EN_REVISION','COMPLETADO','CANCELADO'), allowNull: false, defaultValue: 'ABIERTO' },
    fecha_inicio: { type: DataTypes.DATE, allowNull: true },
    fecha_fin_estimada: { type: DataTypes.DATE, allowNull: true },
    fecha_creacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'proyecto_plataforma', timestamps: false, underscored: true, freezeTableName: true });
};