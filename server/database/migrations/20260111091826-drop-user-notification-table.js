'use strict';

module.exports = {
  async up(queryInterface) {
    // IMPORTANT: drop table explicitly
    await queryInterface.dropTable('user_notifications');
  },

  async down(queryInterface, Sequelize) {
    // Recreate table for rollback safety
    await queryInterface.createTable('user_notifications', {
      notification_id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notification_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      reciever_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    // Recreate indexes
    await queryInterface.addIndex('user_notifications', ['reciever_id'], {
      name: 'reciever_id',
    });
  },
};
