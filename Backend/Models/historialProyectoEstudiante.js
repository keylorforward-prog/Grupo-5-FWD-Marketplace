module.exports = (sequelize, DataTypes) => {
  return sequelize.define('HistorialProyectoEstudiante', {
    id_historial_estudiante: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_perfil_estudiante: { type: DataTypes.INTEGER, allowNull: false },
    titulo_proyecto: { type: DataTypes.STRING(200), allowNull: false },
    tipo: { type: DataTypes.ENUM('GITHUB','PLATAFORMA'), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    enlace: { type: DataTypes.STRING(500), allowNull: true },
    tecnologias: { type: DataTypes.TEXT, allowNull: true },
    rol_desempenado: { type: DataTypes.STRING(150), allowNull: true },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
    fecha_registro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'historial_proyecto_estudiante', timestamps: false, underscored: true, freezeTableName: true });
};