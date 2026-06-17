module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Auditoria', {
    id_auditoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actor_id: { type: DataTypes.INTEGER, allowNull: true },
    accion: { type: DataTypes.STRING(255), allowNull: false },
    entidad: { type: DataTypes.STRING(100), allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true },
    ip: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, { 
    tableName: 'auditoria', 
    timestamps: false, 
    underscored: true, 
    freezeTableName: true 
  });
};
