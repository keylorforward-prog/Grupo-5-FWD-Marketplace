module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PostulacionEmpleo', {
    id_postulacion_empleo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_oferta_empleo:      { type: DataTypes.INTEGER, allowNull: false },
    id_perfil_estudiante:  { type: DataTypes.INTEGER, allowNull: false },
    carta_presentacion:    { type: DataTypes.TEXT, allowNull: true },
    cv_url:                { type: DataTypes.TEXT, allowNull: true },
    pretension_salarial:   { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: null },
    estado: { type: DataTypes.ENUM('enviada', 'vista', 'aceptada', 'rechazada'), allowNull: false, defaultValue: 'enviada' },
    fecha_postulacion:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'postulacion_empleo', timestamps: false, underscored: true, freezeTableName: true });
};
