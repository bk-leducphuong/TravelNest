const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const ViewedHotel = sequelize.define(
    'viewed_hotels',
    {
      view_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      hotel_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'hotels',
          key: 'hotel_id',
        },
      },
      viewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      tableName: 'viewed_hotels',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'view_id' }],
        },
        {
          name: 'user_id',
          using: 'BTREE',
          fields: [{ name: 'user_id' }],
        },
        {
          name: 'hotel_id',
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
      ],
    }
  );

  ViewedHotel.associate = function (models) {
    ViewedHotel.belongsTo(models.users, {
      foreignKey: 'user_id',
    });
    ViewedHotel.belongsTo(models.hotels, {
      foreignKey: 'hotel_id',
    });
  };

  return ViewedHotel;
};
