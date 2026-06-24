const { sequelize } = require('../Models');

async function fix() {
  try {
    const [results] = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'postulacion' AND column_name = 'estado'"
    );
    if (results.length === 0) {
      console.log('Column estado does not exist. Adding it...');
      await sequelize.query("ALTER TABLE postulacion ADD COLUMN estado VARCHAR(20) DEFAULT 'ENVIADA' NOT NULL");
      console.log('Column estado added successfully!');
    } else {
      console.log('Column estado already exists');
    }
  } catch(e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

fix();
