const sequelize = require('../config/db');
const { DataTypes, Op, Sequelize } = require('sequelize');
const Hotels = require('../models/hotels')(sequelize, DataTypes);
const Rooms = require('../models/rooms')(sequelize, DataTypes);
const RoomInventory = require('../models/room_inventory')(sequelize, DataTypes);
const SearchLogs = require('../models/search_logs')(sequelize, DataTypes);

const getSearchResults = async (req, res) => {
  try {
    const {
      location,
      adults,
      children,
      checkInDate,
      checkOutDate,
      rooms,
      numberOfDays,
    } = req.body.searchData;

    if (!location || !adults || !children || !checkInDate || !checkOutDate || !rooms) {
      return res.status(400).json({
        success: false,
        hotels: [],
        message: "Missing search criteria",
      });
    }

    const total_guests = parseInt(adults, 10) + parseInt(children, 10);

    const hotels = await Hotels.findAll({
      distinct: true,
      attributes: [
        'hotel_id', 
        'name', 
        'address', 
        'city', 
        'overall_rating', 
        'hotel_class', 
        'image_urls', 
        'latitude', 
        'longitude'
      ],
      include: [{
        model: Rooms,
        required: true,
        where: {
          max_guests: {
            [Op.gte]: total_guests
          }
        },
        include: [{
          model: RoomInventory,
          required: true,
          where: {
            date: {
              [Op.between]: [checkInDate, checkOutDate]
            },
            status: 'open',
            [Op.and]: Sequelize.literal(`total_inventory - total_reserved >= ${rooms}`)
          }
        }]
      }],
      where: {
        city: location
      },
      group: ['Hotels.hotel_id'],
      having: Sequelize.literal(`COUNT(CASE WHEN RoomInventory.total_inventory - RoomInventory.total_reserved >= ${rooms} THEN 1 END) = ${numberOfDays}`)
    });

    // Get lowest price for each hotel
    for (const hotel of hotels) {
      const lowestPrice = await RoomInventory.findOne({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('price_per_night')), 'total_price']
        ],
        include: [{
          model: Rooms,
          required: true,
          where: {
            hotel_id: hotel.hotel_id
          }
        }],
        where: {
          date: {
            [Op.between]: [checkInDate, checkOutDate]
          },
          status: 'open'
        },
        group: ['room_id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('price_per_night')), 'ASC']],
        raw: true
      });
      
      hotel.lowestPrice = lowestPrice ? lowestPrice.total_price : null;
    }

    if (hotels.length === 0) {
      return res.status(200).json({
        success: false,
        hotels: [],
        message: "No hotels found matching the criteria",
      });
    }

    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, hotels: [], message: "Internal Server Error" });
  }
};

const saveSearchInformation = async (req, res) => {
  try {
    const user_id = req.session.user ? req.session.user.user_id : null;
    const { location, checkInDate, checkOutDate, adults, children, rooms, numberOfDays } = req.body.searchData;

    if (!location || !checkInDate || !checkOutDate || !adults || !children || !rooms || !numberOfDays) {
      return res.status(400).json({ success: false, message: "Missing search details" });
    }

    await SearchLogs.create({
      location,
      user_id,
      search_time: Sequelize.fn('NOW'),
      children,
      adults,
      rooms,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_days: numberOfDays
    });

    res.status(201).json({ success: true, message: "Search log recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getSearchResults, saveSearchInformation };
