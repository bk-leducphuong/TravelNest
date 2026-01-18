const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const RoomInventory = sequelize.define(
    'room_inventory',
    {
      room_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      total_inventory: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_reserved: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('close', 'open'),
        allowNull: true,
      },
      price_per_night: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'room_inventory',
      timestamps: false,
      indexes: [
        {
          name: 'room_id',
          using: 'BTREE',
          fields: [{ name: 'room_id' }],
        },
      ],
    }
  );

  RoomInventory.associate = function (models) {
    RoomInventory.belongsTo(models.rooms, {
      foreignKey: 'room_id',
    });
  };

  return RoomInventory;
};
