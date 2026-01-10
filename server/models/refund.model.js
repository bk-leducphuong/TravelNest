const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Refund = sequelize.define(
    'refunds',
    {
      refund_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'transaction_id',
        },
      },
      buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      hotel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'hotel_id',
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'rejected'),
        allowNull: false,
      },
      requested_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'refunds',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'refund_id' }],
        },
        {
          name: 'transaction_id',
          using: 'BTREE',
          fields: [{ name: 'transaction_id' }],
        },
        {
          name: 'buyer_id',
          using: 'BTREE',
          fields: [{ name: 'buyer_id' }],
        },
        {
          name: 'refunds_ibfk_3_idx',
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
      ],
    }
  );

  Refund.associate = function (models) {
    Refund.belongsTo(models.transactions, {
      foreignKey: 'transaction_id',
    });
    Refund.belongsTo(models.users, {
      foreignKey: 'buyer_id',
    });
    Refund.belongsTo(models.hotels, {
      foreignKey: 'hotel_id',
    });
  };

  return Refund;
};
