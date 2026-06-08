module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Evaluacion', {
    id_evaluacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_entregable: { type: DataTypes.INTEGER, allowNull: false },
    id_perfil_empresario: { type: DataTypes.INTEGER, allowNull: false },
    puntuacion: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comentario: { type: DataTypes.TEXT, allowNull: true },
    fecha_evaluacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'evaluacion', timestamps: false, underscored: true, freezeTableName: true });
};