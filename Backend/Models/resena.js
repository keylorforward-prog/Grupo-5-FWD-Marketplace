module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Resena', {
    id_resena:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_proyecto:            { type: DataTypes.INTEGER, allowNull: false },
    id_autor_perfil:        { type: DataTypes.INTEGER, allowNull: false },
    rol_autor:              { type: DataTypes.ENUM('EMPRESARIO', 'EGRESADO'), allowNull: false },
    estrellas_calidad:      { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    estrellas_comunicacion: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    estrellas_puntualidad:  { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comentario:             { type: DataTypes.TEXT, allowNull: true },
    visible:                { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fecha_resena:           { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'resena', timestamps: false, underscored: true, freezeTableName: true });
};
