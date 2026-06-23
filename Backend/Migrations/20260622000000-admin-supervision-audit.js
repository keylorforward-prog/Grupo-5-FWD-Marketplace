'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('auditoria', 'actor_tipo', { type: Sequelize.STRING(30), allowNull: true });
    await queryInterface.addColumn('auditoria', 'entidad_id', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn('auditoria', 'valor_anterior', { type: Sequelize.JSON, allowNull: true });
    await queryInterface.addColumn('auditoria', 'valor_nuevo', { type: Sequelize.JSON, allowNull: true });
    await queryInterface.addColumn('auditoria', 'severidad', { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'INFO' });
    await queryInterface.addColumn('auditoria', 'resultado', { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'EXITOSO' });

    await queryInterface.addColumn('mensaje', 'fecha_edicion', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('mensaje', 'fecha_eliminacion', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('mensaje', 'editado_por', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('mensaje', 'eliminado_por', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('mensaje', 'motivo_eliminacion', { type: Sequelize.TEXT, allowNull: true });

    await queryInterface.createTable('mensaje_historial', {
      id_historial: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_mensaje: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'mensaje', key: 'id_mensaje' }, onDelete: 'CASCADE' },
      id_usuario: { type: Sequelize.INTEGER, allowNull: true },
      accion: { type: Sequelize.STRING(20), allowNull: false },
      contenido_anterior: { type: Sequelize.TEXT, allowNull: true },
      contenido_nuevo: { type: Sequelize.TEXT, allowNull: true },
      motivo: { type: Sequelize.TEXT, allowNull: true },
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await Promise.all([
      queryInterface.addIndex('mensaje', ['id_conversacion'], { name: 'idx_mensaje_conversacion' }),
      queryInterface.addIndex('mensaje', ['fecha_envio'], { name: 'idx_mensaje_fecha_envio' }),
      queryInterface.addIndex('postulacion', ['id_propuesta'], { name: 'idx_postulacion_propuesta' }),
      queryInterface.addIndex('oferta', ['id_proyecto'], { name: 'idx_oferta_proyecto' }),
      queryInterface.addIndex('auditoria', ['fecha'], { name: 'idx_auditoria_fecha' }),
      queryInterface.addIndex('auditoria', ['entidad'], { name: 'idx_auditoria_entidad' }),
      queryInterface.addIndex('auditoria', ['actor_id', 'fecha'], { name: 'idx_auditoria_actor_fecha' }),
      queryInterface.addIndex('mensaje_historial', ['id_mensaje', 'fecha'], { name: 'idx_mensaje_historial_mensaje_fecha' }),
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mensaje_historial');
    for (const column of ['fecha_edicion', 'fecha_eliminacion', 'editado_por', 'eliminado_por', 'motivo_eliminacion']) {
      await queryInterface.removeColumn('mensaje', column);
    }
    for (const column of ['actor_tipo', 'entidad_id', 'valor_anterior', 'valor_nuevo', 'severidad', 'resultado']) {
      await queryInterface.removeColumn('auditoria', column);
    }
  },
};
