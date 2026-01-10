const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Room = sequelize.define(
    'rooms',
    {
      room_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      hotel_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'hotels',
          key: 'hotel_id',
        },
      },
      max_guests: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      room_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      image_urls: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      room_amenities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      room_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      room_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'rooms',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'room_id' }],
        },
        {
          name: 'hotel_id',
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
      ],
    }
  );

  Room.associate = function (models) {
    Room.belongsTo(models.hotels, {
      foreignKey: 'hotel_id',
    });
    Room.hasMany(models.bookings, {
      foreignKey: 'room_id',
    });
    Room.hasMany(models.room_inventory, {
      foreignKey: 'room_id',
    });
  };

  return Room;
};
