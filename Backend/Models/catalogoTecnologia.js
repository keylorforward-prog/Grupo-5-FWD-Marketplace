module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CatalogoTecnologia', {
    id_tecnologia: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    categoria: { type: DataTypes.STRING(100), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'catalogo_tecnologia', timestamps: false, underscored: true, freezeTableName: true });
};