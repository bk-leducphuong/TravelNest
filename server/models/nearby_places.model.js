const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const NearbyPlace = sequelize.define(
    'nearby_places',
    {
      place_id: {
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
      place_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'nearby_places',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'place_id' }],
        },
        {
          name: 'hotel_id',
          using: 'BTREE',
          fields: [{ name: 'hotel_id' }],
        },
      ],
    }
  );

  NearbyPlace.associate = function (models) {
    NearbyPlace.belongsTo(models.hotels, {
      foreignKey: 'hotel_id',
    });
  };

  return NearbyPlace;
};
