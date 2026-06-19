module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'CodigoRecuperacion',
    {
      id_codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },

      estado: {
        type: DataTypes.ENUM(
          'ACTIVO',
          'USADO',
          'EXPIRADO'
        ),
        allowNull: false,
        defaultValue: 'ACTIVO',
      },

      fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      fecha_uso: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'codigo_recuperacion',
      timestamps: false,
      underscored: true,
      freezeTableName: true,
    }
  );
};