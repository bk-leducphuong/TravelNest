const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'users',
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      user_role: {
        type: DataTypes.ENUM('customer', 'partner', 'admin'),
        allowNull: true,
        defaultValue: 'customer',
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
      connect_account_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: 'connect_account_id_UNIQUE',
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      profile_picture_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'user_id' }],
        },
        {
          name: 'unique_email_role',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'email' }, { name: 'user_role' }],
        },
        {
          name: 'connect_account_id_UNIQUE',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'connect_account_id' }],
        },
      ],
    }
  );

  User.associate = function (models) {
    User.hasMany(models.bookings, {
      foreignKey: 'buyer_id',
    });
    User.hasMany(models.hotels, {
      foreignKey: 'owner_id',
    });
    User.hasMany(models.notifications, {
      foreignKey: 'sender_id',
    });
    User.hasMany(models.refunds, {
      foreignKey: 'buyer_id',
    });
    User.hasMany(models.reviews, {
      foreignKey: 'user_id',
    });
    User.hasMany(models.saved_hotels, {
      foreignKey: 'user_id',
    });
    User.hasMany(models.user_notifications, {
      foreignKey: 'reciever_id',
    });
    User.hasMany(models.viewed_hotels, {
      foreignKey: 'user_id',
    });
  };

  return User;
};
