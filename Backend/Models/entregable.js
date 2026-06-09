module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Entregable', {
    id_entregable: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_proyecto: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    tipo: { type: DataTypes.ENUM('PARCIAL','FINAL'), allowNull: false },
    estado: { type: DataTypes.ENUM('ENVIADO','APROBADO','CON_CAMBIOS'), allowNull: false, defaultValue: 'ENVIADO' },
    archivo_url: { type: DataTypes.STRING(500), allowNull: true },
    fecha_creacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { tableName: 'entregable', timestamps: false, underscored: true, freezeTableName: true });
};