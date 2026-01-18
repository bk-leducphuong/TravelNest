const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Booking = sequelize.define(
    'bookings',
    {
      booking_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      buyer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      check_in_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'cancelled',
          'confirmed',
          'completed',
          'checked in',
          'no show'
        ),
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
      number_of_guests: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hotel_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'hotels',
          key: 'id',
        },
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'room_id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      booking_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'bookings',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'booking_id' }],
        },
        {
          name: 'user_id',
          using: 'BTREE',
          fields: [{ name: 'buyer_id' }],
        },
        {
          name: 'hotel_id',
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
        {
          name: 'room_id',
          using: 'BTREE',
          fields: [{ name: 'room_id' }],
        },
      ],
    }
  );

  Booking.associate = function (models) {
    Booking.belongsTo(models.users, {
      foreignKey: 'buyer_id',
    });
    Booking.belongsTo(models.hotels, {
      foreignKey: 'hotel_id',
    });
    Booking.belongsTo(models.rooms, {
      foreignKey: 'room_id',
    });
    Booking.hasMany(models.reviews, {
      foreignKey: 'booking_id',
    });
  };

  return Booking;
};
