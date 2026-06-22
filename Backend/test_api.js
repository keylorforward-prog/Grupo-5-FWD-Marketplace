require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Usuario } = require('./Models');

async function test() {
  try {
    const admin = await Usuario.findOne({ where: { rol: 'ADMIN' } });
    if (!admin) {
      console.log('No admin found');
      process.exit(1);
    }

    const token = jwt.sign(
      { id: admin.id_usuario, rol: admin.rol },
      process.env.JWT_SECRET || 'fwd_marketplace_super_secret_jwt_2024',
      { expiresIn: '1h' }
    );

    const response = await fetch('http://localhost:3000/api/admin/proyectos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
      console.log("SUCCESS!", data.success, data.data.length);
    } else {
      console.error("FAILED HTTP ERROR", response.status, data);
    }
  } catch (error) {
    console.error("FAILED ERROR", error.message);
  }
  process.exit(0);
}

test();
