'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('propuesta');
    if (!tableInfo.github_url) {
      await queryInterface.addColumn('propuesta', 'github_url', {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('propuesta', 'github_url');
  }
};
