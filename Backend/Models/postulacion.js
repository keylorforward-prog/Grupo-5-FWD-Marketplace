module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Postulacion', {
    id_postulacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_propuesta: { type: DataTypes.INTEGER, allowNull: false },
    id_perfil_estudiante: { type: DataTypes.INTEGER, allowNull: false },
    cv_url: { type: DataTypes.STRING(500), allowNull: true },
    mensaje_presentacion: { type: DataTypes.TEXT, allowNull: true },
    presupuesto_max: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    estado: { type: DataTypes.ENUM('ENVIADA','EN_REVISION','PRESSELECCIONADA','RECHAZADA','CONTRATADO'), allowNull: false, defaultValue: 'ENVIADA' },
    fecha_postulacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { 
    tableName: 'postulacion', 
    timestamps: false, 
    underscored: true, 
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['id_propuesta', 'id_perfil_estudiante'] }]
  });
};