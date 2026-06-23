module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Usuario', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    cedula: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    correo: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    contrasena_hash: { type: DataTypes.STRING(255), allowNull: false },
    rol: { type: DataTypes.ENUM('ADMIN','ESTUDIANTE','EMPRESARIO'), allowNull: false },
    foto_perfil: { type: DataTypes.STRING(500), allowNull: true },
    estado_cuenta: { type: DataTypes.ENUM('ACTIVA','PENDIENTE','SUSPENDIDA'), allowNull: false, defaultValue: 'PENDIENTE' },
    fecha_registro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    ultimo_acceso: { type: DataTypes.DATE, allowNull: true },
    telefono_whatsapp: { type: DataTypes.STRING(30), allowNull: true },
    cargo: { type: DataTypes.STRING(100), allowNull: true },
    fecha_asignacion: { type: DataTypes.DATE, allowNull: true },
    estado_admin: { type: DataTypes.ENUM('ACTIVO','INACTIVO'), allowNull: true },
    tipo_empresa: { type: DataTypes.STRING(100),allowNull: true},
    google_id: {type: DataTypes.STRING(255), allowNull: true, unique: true},
github_id: {type: DataTypes.STRING(255), allowNull: true, unique: true},
provider: {type: DataTypes.ENUM('LOCAL', 'GOOGLE', 'GITHUB'), allowNull: false, defaultValue: 'LOCAL'},
    avatar_url: {type: DataTypes.STRING(500), allowNull: true},
    perfil_completo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, { tableName: 'usuario', timestamps: false, underscored: true, freezeTableName: true });
};