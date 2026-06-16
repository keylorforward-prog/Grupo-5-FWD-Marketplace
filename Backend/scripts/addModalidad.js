const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_propuesta_modalidad') THEN
          CREATE TYPE enum_propuesta_modalidad AS ENUM ('remoto','hibrido','presencial');
        END IF;
      END
      $$;
    `);
    console.log('✅ Type enum_propuesta_modalidad created');

    await sequelize.query(`
      ALTER TABLE propuesta ADD COLUMN IF NOT EXISTS modalidad enum_propuesta_modalidad NOT NULL DEFAULT 'remoto';
    `);
    console.log('✅ Column modalidad added to propuesta');

    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
