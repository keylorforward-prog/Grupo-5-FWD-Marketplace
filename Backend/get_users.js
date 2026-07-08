const db = require('./Config/db.js');
const { QueryTypes } = require('sequelize');

async function getUsers() {
  try {
    const users = await db.query('SELECT email, rol FROM "Usuarios" LIMIT 5', { type: QueryTypes.SELECT });
    console.log(users);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}
getUsers();
