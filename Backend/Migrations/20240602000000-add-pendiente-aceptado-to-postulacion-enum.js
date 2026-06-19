'use strict';

module.exports = {
  async up(queryInterface) {
    const enumTypeName = 'enum_postulacion_estado';
    const query = `
      DO $$ BEGIN
        ALTER TYPE "${enumTypeName}" ADD VALUE IF NOT EXISTS 'PENDIENTE';
        ALTER TYPE "${enumTypeName}" ADD VALUE IF NOT EXISTS 'PRESELECCIONADA';
        ALTER TYPE "${enumTypeName}" ADD VALUE IF NOT EXISTS 'ACEPTADO';
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    await queryInterface.sequelize.query(query);
  },

  async down(queryInterface) {
    // PostgreSQL does not support removing values from an enum.
    // Down migration is not possible without recreating the type.
  }
};
