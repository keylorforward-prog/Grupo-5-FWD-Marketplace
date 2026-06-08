module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Oferta', {
    id_oferta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_proyecto: { type: DataTypes.INTEGER, allowNull: false },
    id_perfil_estudiante: { type: DataTypes.INTEGER, allowNull: false },
    propuesta: { type: DataTypes.TEXT, allowNull: false },
    cantidad: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    estado: { type: DataTypes.ENUM('ACEPTADA','RECHAZADA','EXPIRADA'), allowNull: true },
    fecha_oferta: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'oferta', timestamps: false, underscored: true, freezeTableName: true });
};