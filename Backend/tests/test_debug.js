const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: "postgres", dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } });

async function test() {
  try {
    // Check table columns
    const [cols] = await sequelize.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'postulacion_empleo'
      ORDER BY ordinal_position
    `);
    console.log("postulacion_empleo columns:");
    cols.forEach(c => console.log(`  ${c.column_name} (${c.data_type})`));
    
    // Check estado values
    const [states] = await sequelize.query(`
      SELECT DISTINCT estado FROM postulacion_empleo LIMIT 10
    `);
    console.log("\npostulacion_empleo estado values:", states.map(s => s.estado));

    const [cols2] = await sequelize.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'postulacion'
      ORDER BY ordinal_position
    `);
    console.log("\npostulacion columns:");
    cols2.forEach(c => console.log(`  ${c.column_name} (${c.data_type})`));
    
    const [states2] = await sequelize.query(`
      SELECT DISTINCT estado FROM postulacion LIMIT 10
    `);
    console.log("\npostulacion estado values:", states2.map(s => s.estado));

    const [cols3] = await sequelize.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'conversacion'
      ORDER BY ordinal_position
    `);
    console.log("\nconversacion columns:");
    cols3.forEach(c => console.log(`  ${c.column_name} (${c.data_type})`));

    await sequelize.close();
  } catch(e) {
    console.error("ERROR:", e.message);
    console.error(e.stack);
  }
}
test();
