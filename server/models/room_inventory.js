const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('room_inventory', {
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'room_id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    total_inventory: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_reserved: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('close','open'),
      allowNull: true
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'room_inventory',
    timestamps: false,
    indexes: [
      {
        name: "room_id",
        using: "BTREE",
        fields: [
          { name: "room_id" },
        ]
      },
    ]
  });
};
