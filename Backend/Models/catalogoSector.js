module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CatalogoSector', {
    id_sector: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true }
  }, { tableName: 'catalogo_sector', timestamps: false, underscored: true, freezeTableName: true });
};