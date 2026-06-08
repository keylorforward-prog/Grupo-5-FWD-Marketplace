module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Pago', {
    id_pago: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_proyecto: { type: DataTypes.INTEGER, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    estado: { type: DataTypes.ENUM('PENDIENTE','PAGADO','RETENIDO'), allowNull: false, defaultValue: 'PENDIENTE' },
    metodo_pago: { type: DataTypes.STRING(100), allowNull: true },
    fecha_pago: { type: DataTypes.DATE, allowNull: true }
  }, { tableName: 'pago', timestamps: false, underscored: true, freezeTableName: true });
};