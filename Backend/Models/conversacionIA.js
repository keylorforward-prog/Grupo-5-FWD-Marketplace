module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ConversacionIA', {
    id_conversacion_ia: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_perfil_empresario: { type: DataTypes.INTEGER, allowNull: false },
    historial: { type: DataTypes.TEXT, allowNull: false },
    estado: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'en_progreso' },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_actualizacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'conversacion_ia', timestamps: false, underscored: true, freezeTableName: true });
};
