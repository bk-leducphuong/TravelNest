const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Transaction = sequelize.define(
    'transactions',
    {
      transaction_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
      },
      transaction_type: {
        type: DataTypes.ENUM('booking_payment', 'refund'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      payment_intent_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      hotel_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'hotels',
          key: 'id',
        },
      },
      charge_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      booking_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'transactions',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'transaction_id' }],
        },
        {
          name: 'buyer_id',
          using: 'BTREE',
          fields: [{ name: 'buyer_id' }],
        },
        {
          name: 'fk_transactions_hotel_id',
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
      ],
    }
  );

  Transaction.associate = function (models) {
    Transaction.belongsTo(models.hotels, {
      foreignKey: 'hotel_id',
    });
    Transaction.belongsTo(models.users, {
      foreignKey: 'buyer_id',
    });
    Transaction.hasMany(models.fees, {
      foreignKey: 'transaction_id',
    });
    Transaction.hasMany(models.invoices, {
      foreignKey: 'transaction_id',
    });
    Transaction.hasMany(models.payments, {
      foreignKey: 'transaction_id',
    });
    Transaction.hasMany(models.refunds, {
      foreignKey: 'transaction_id',
    });
  };

  return Transaction;
};
