module.exports = (sequelize, DataTypes) => {
  return sequelize.define('HistorialProyectoEmpresa', {
    id_historial_empresa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_perfil_empresario: { type: DataTypes.INTEGER, allowNull: false },
    titulo_proyecto: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    tecnologias_usadas: { type: DataTypes.TEXT, allowNull: true },
    enlace: { type: DataTypes.STRING(500), allowNull: true },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
    fecha_registro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'historial_proyecto_empresa', timestamps: false, underscored: true, freezeTableName: true });
};