module.exports = (sequelize, DataTypes) => {
  return sequelize.define('OfertaEmpleo', {
    id_oferta_empleo:       { type: DataTypes.INTEGER,      primaryKey: true, autoIncrement: true },
    id_perfil_empresario:   { type: DataTypes.INTEGER,      allowNull: false },
    titulo:                 { type: DataTypes.STRING(200),  allowNull: false },
    descripcion:            { type: DataTypes.TEXT,         allowNull: false },
    requisitos:             { type: DataTypes.TEXT,         allowNull: true },
    tecnologias_requeridas: { type: DataTypes.TEXT,         allowNull: true },
    tipo_jornada: { type: DataTypes.ENUM('tiempo_completo', 'medio_tiempo', 'por_horas', 'practica'), allowNull: false, defaultValue: 'tiempo_completo' },
    modalidad:    { type: DataTypes.ENUM('remoto', 'hibrido', 'presencial'),                          allowNull: false, defaultValue: 'remoto' },
    salario_min:  { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    salario_max:  { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    ubicacion:    { type: DataTypes.STRING(200),    allowNull: true },
    estado:       { type: DataTypes.ENUM('ACTIVA', 'PAUSADA', 'CERRADA', 'CANCELADA'), allowNull: false, defaultValue: 'ACTIVA' },
    fecha_publicacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'oferta_empleo', timestamps: false, underscored: true, freezeTableName: true });
};
