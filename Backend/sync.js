const { sequelize } = require('./Models/index.js');
async function runSync() {
  try {
    await sequelize.sync({ force: false, alter: true });
    console.log("Database synchronized successfully!");
  } catch(e) {
    console.error("Error syncing DB:", e);
  } finally {
    process.exit(0);
  }
}
runSync();
