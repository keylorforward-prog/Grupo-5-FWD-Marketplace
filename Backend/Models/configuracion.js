module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Configuracion', {
    id_configuracion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clave: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    valor: { type: DataTypes.TEXT, allowNull: false }, // Could be stringified JSON
    descripcion: { type: DataTypes.STRING(255), allowNull: true },
    modificado_por: { type: DataTypes.INTEGER, allowNull: true },
    fecha_modificacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { 
    tableName: 'configuracion', 
    timestamps: false, 
    underscored: true, 
    freezeTableName: true 
  });
};
