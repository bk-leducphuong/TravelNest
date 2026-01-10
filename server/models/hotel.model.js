const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Hotel = sequelize.define(
    'hotels',
    {
      hotel_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      overall_rating: {
        type: DataTypes.DECIMAL(2, 1),
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
      latitude: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      image_urls: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hotel_class: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hotel_amenities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      check_in_time: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      check_out_time: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'hotels',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
        {
          name: 'coordinates',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'latitude' }, { name: 'longitude' }],
        },
        {
          name: 'owner_id',
          using: 'BTREE',
          fields: [{ name: 'owner_id' }],
        },
      ],
    }
  );

  Hotel.associate = function (models) {
    Hotel.belongsTo(models.users, {
      foreignKey: 'owner_id',
    });
    Hotel.hasMany(models.bookings, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.invoices, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.nearby_places, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.notifications, {
      foreignKey: 'reciever_id',
    });
    Hotel.hasMany(models.refunds, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.reviews, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.rooms, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.saved_hotels, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.transactions, {
      foreignKey: 'hotel_id',
    });
    Hotel.hasMany(models.viewed_hotels, {
      foreignKey: 'hotel_id',
    });
  };

  return Hotel;
};
