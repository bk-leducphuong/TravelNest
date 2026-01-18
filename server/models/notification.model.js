const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Notification = sequelize.define(
    'notifications',
    {
      notification_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      notification_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      reciever_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'notifications',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'notification_id' }],
        },
        {
          name: 'notifications_ibfk_1_idx',
          using: 'BTREE',
          fields: [{ name: 'reciever_id' }],
        },
        {
          name: 'sender_id_idx',
          using: 'BTREE',
          fields: [{ name: 'sender_id' }],
        },
      ],
    }
  );

  Notification.associate = function (models) {
    Notification.belongsTo(models.users, {
      foreignKey: 'sender_id',
    });
    Notification.belongsTo(models.hotels, {
      foreignKey: 'reciever_id',
    });
  };

  return Notification;
};
