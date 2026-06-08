module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TecnologiaPropuesta', {
    id_tecnologia_propuesta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_propuesta: { type: DataTypes.INTEGER, allowNull: false },
    id_tecnologia: { type: DataTypes.INTEGER, allowNull: false }
  }, { 
    tableName: 'tecnologia_propuesta', 
    timestamps: false, 
    underscored: true, 
    freezeTableName: true,
    indexes: [{ unique: true, fields: ['id_propuesta', 'id_tecnologia'] }]
  });
};