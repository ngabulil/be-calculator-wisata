'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: { model: 'admins', key: 'id' },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
      },

      action: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },

      path: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      status_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      ip: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      body: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('audit_logs', ['createdAt'], {
      name: 'audit_logs_createdAt_idx',
    });

    await queryInterface.addIndex('audit_logs', ['admin_id'], {
      name: 'audit_logs_admin_id_idx',
    });

    await queryInterface.addIndex('audit_logs', ['action'], {
      name: 'audit_logs_action_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('audit_logs');
  },
};
