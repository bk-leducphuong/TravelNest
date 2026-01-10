const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
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
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'hotels',
          key: 'hotel_id',
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
};
