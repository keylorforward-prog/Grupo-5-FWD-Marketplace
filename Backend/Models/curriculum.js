module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Curriculum', {
    id_curriculum: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_perfil_estudiante: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    resumen_profesional: { type: DataTypes.TEXT, allowNull: true },
    experiencia_laboral: { type: DataTypes.TEXT, allowNull: true },
    educacion: { type: DataTypes.TEXT, allowNull: true },
    habilidades: { type: DataTypes.TEXT, allowNull: true },
    certificaciones: { type: DataTypes.TEXT, allowNull: true },
    enlaces: { type: DataTypes.STRING(500), allowNull: true },
    fecha_actualizacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'curriculum', timestamps: false, underscored: true, freezeTableName: true });
};