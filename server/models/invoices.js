const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'invoices',
    {
      invoice_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'transactions',
          key: 'transaction_id',
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('available', 'unavailable', 'done'),
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
      booking_code: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      hotel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'hotel_id',
        },
      },
    },
    {
      sequelize,
      tableName: 'invoices',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'invoice_id' }],
        },
        {
          name: 'transaction_id',
          using: 'BTREE',
          fields: [{ name: 'transaction_id' }],
        },
        {
          name: 'booking_id',
          using: 'BTREE',
          fields: [{ name: 'booking_code' }],
        },
        {
          name: 'hotel_id',
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
      ],
    }
  );
};
