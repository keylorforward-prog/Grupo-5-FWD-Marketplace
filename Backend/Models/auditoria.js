module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Auditoria', {
    id_auditoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actor_id: { type: DataTypes.INTEGER, allowNull: true },
    actor_tipo: { type: DataTypes.STRING(30), allowNull: true },
    accion: { type: DataTypes.STRING(255), allowNull: false },
    entidad: { type: DataTypes.STRING(100), allowNull: false },
    entidad_id: { type: DataTypes.STRING(100), allowNull: true },
    valor_anterior: { type: DataTypes.JSON, allowNull: true },
    valor_nuevo: { type: DataTypes.JSON, allowNull: true },
    severidad: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'INFO' },
    resultado: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'EXITOSO' },
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
