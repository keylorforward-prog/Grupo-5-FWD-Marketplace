const { sequelize } = require('./Models');

async function alterTable() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    
    await queryInterface.addColumn('perfil_empresario', 'notif_postulaciones', {
      type: sequelize.Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    
    await queryInterface.addColumn('perfil_empresario', 'notif_resumen_semanal', {
      type: sequelize.Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn('perfil_empresario', 'notif_mensajes_directos', {
      type: sequelize.Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    console.log("Columnas agregadas con éxito.");
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('Duplicate column name')) {
      console.log("Las columnas ya existen.");
    } else {
      console.error("Error alterando tabla:", error);
    }
  } finally {
    process.exit();
  }
}

alterTable();
