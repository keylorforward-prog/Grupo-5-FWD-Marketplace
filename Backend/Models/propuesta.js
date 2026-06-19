module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Propuesta', {
    id_propuesta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_perfil_empresario: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    tecnologias_requeridas: { type: DataTypes.TEXT, allowNull: true },
    usar_ia: { type: DataTypes.ENUM('SI','NO'), allowNull: false, defaultValue: 'NO' },
    plazo_dias: { type: DataTypes.INTEGER, allowNull: false, validate: { isIn: [[5, 15, 30]] } },
    tipo_plazo: {
      type: DataTypes.VIRTUAL,
      get() {
        const dias = this.getDataValue('plazo_dias');
        if (dias === 5) return 'CORTO PLAZO';
        if (dias === 15) return 'MEDIANO PLAZO';
        if (dias === 30) return 'LARGO PLAZO';
        return null;
      }
    },
    presupuesto_min: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    presupuesto_max: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    modalidad: { type: DataTypes.ENUM('remoto','hibrido','presencial'), allowNull: false, defaultValue: 'remoto' },
    estado: { type: DataTypes.ENUM('ACTIVA','PAUSADA','CERRADA','CANCELADA'), allowNull: false, defaultValue: 'ACTIVA' },
    fecha_publicacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_limite: { type: DataTypes.DATE, allowNull: true },
    id_conversacion_ia: { type: DataTypes.INTEGER, allowNull: true },
    documento_adjunto: { type: DataTypes.STRING(255), allowNull: true },
    github_url: { type: DataTypes.STRING(500), allowNull: true }
  }, { tableName: 'propuesta', timestamps: false, underscored: true, freezeTableName: true });
};