const { Op } = require('sequelize');
const sequelize = require('../config/db');
const { Sequelize, DataTypes } = require('sequelize');
const Hotels = require('../models/hotels')(sequelize, DataTypes);
const Rooms = require('../models/rooms')(sequelize, DataTypes);
const Reviews = require('../models/reviews')(sequelize, DataTypes);
const NearbyPlaces = require('../models/nearby_places')(sequelize, DataTypes);
const ReviewCriterias = require('../models/review_criterias')(sequelize, DataTypes);
const RoomInventory = require('../models/room_inventory')(sequelize, DataTypes);
const Users = require('../models/users')(sequelize, DataTypes);

const getHotelDetails = async (req, res) => {
  const { hotelId, checkInDate, checkOutDate, numberOfDays, numberOfRooms, numberOfGuests } = req.body;

  try {
    const [hotel, rooms, reviews, nearbyPlaces, reviewCriterias] = await Promise.all([
      // Hotel query
      Hotels.findOne({
        where: { hotel_id: hotelId },
        attributes: ['hotel_id', 'name', 'description', 'address', 'city', 'phone_number', 
                    'overall_rating', 'latitude', 'longitude', 'image_urls', 'hotel_class', 
                    'hotel_amenities', 'check_in_time', 'check_out_time']
      }),

      // Rooms query
      Rooms.findAll({
        attributes: ['room_id', 'room_name', 'max_guests', 'image_urls', 'room_amenities'],
        include: [{
          model: RoomInventory,
          attributes: [
            [sequelize.fn('SUM', sequelize.col('price_per_night')), 'price_per_night'],
            [sequelize.fn('MIN', sequelize.literal('total_inventory - total_reserved')), 'available_rooms']
          ],
          where: {
            date: { [Op.between]: [checkInDate, checkOutDate] },
            status: 'open'
          },
          having: sequelize.literal(`COUNT(CASE WHEN total_inventory - total_reserved >= ${numberOfRooms} THEN 1 END) = ${numberOfDays}`)
        }],
        where: {
          hotel_id: hotelId,
          max_guests: { [Op.gte]: numberOfGuests }
        }
      }),

      // Reviews query
      Reviews.findAll({
        include: [{
          model: Users,
          attributes: ['username', 'profile_picture_url', 'country']
        }],
        where: { hotel_id: hotelId }
      }),

      // Nearby places query
      NearbyPlaces.findAll({
        where: { hotel_id: hotelId },
        attributes: ['place_id', 'place_name', 
                    ['latitude', 'place_latitude'], 
                    ['longitude', 'place_longitude']]
      }),

      // Review criterias query
      ReviewCriterias.findAll({
        attributes: [
          'criteria_name',
          [sequelize.fn('AVG', sequelize.col('score')), 'average_score']
        ],
        include: [{
          model: Reviews,
          where: { hotel_id: hotelId },
          attributes: []
        }],
        group: ['criteria_name']
      })
    ]);

    res.json({
      hotel,
      rooms,
      reviews,
      nearbyPlaces,
      reviewCriterias
    });
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    res.status(500).json({ message: "System error, please try again later." });
  }
};

const searchRoom = async (req, res) => {
  try {
    const { hotel_id, checkInDate, checkOutDate, numberOfDays, adults, children, rooms } = req.body;
    const total_guests = parseInt(adults, 10) + parseInt(children, 10);

    const available_rooms = await Rooms.findAll({
      attributes: ['room_id', 'room_name', 'max_guests', 'image_urls', 'room_amenities'],
      include: [{
        model: RoomInventory,
        attributes: [
          [sequelize.fn('SUM', sequelize.col('price_per_night')), 'price_per_night'],
          [sequelize.fn('MIN', sequelize.literal('total_inventory - total_reserved')), 'available_rooms']
        ],
        where: {
          date: { [Op.between]: [checkInDate, checkOutDate] },
          status: 'open'
        },
        having: sequelize.literal(`COUNT(CASE WHEN total_inventory - total_reserved >= ${rooms} THEN 1 END) = ${numberOfDays}`)
      }],
      where: {
        hotel_id,
        max_guests: { [Op.gte]: total_guests }
      }
    });

    if (available_rooms.length === 0) {
      return res.status(200).json({
        success: false,
        available_rooms: [],
        message: "No hotels found matching the criteria"
      });
    }

    res.status(200).json({ success: true, available_rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      available_rooms: [],
      message: "Internal Server Error"
    });
  }
};

const checkRoomAvailability = async (req, res) => {
  try {
    const { bookingInfor } = req.body;

    const rooms = await Rooms.findAll({
      attributes: [
        'room_id',
        [sequelize.fn('MIN', sequelize.literal('RoomInventory.total_inventory - RoomInventory.total_reserved')), 'available_rooms']
      ],
      include: [{
        model: RoomInventory,
        where: {
          date: { [Op.between]: [bookingInfor.checkInDate, bookingInfor.checkOutDate] }
        },
        attributes: []
      }],
      where: {
        hotel_id: bookingInfor.hotel.hotel_id,
        max_guests: { [Op.gte]: bookingInfor.numberOfGuests }
      },
      group: ['room_id'],
      having: sequelize.literal(`COUNT(CASE WHEN RoomInventory.total_inventory - RoomInventory.total_reserved >= 0 THEN 1 END) = ${bookingInfor.numberOfDays}`)
    });

    for (const selectedRoom of bookingInfor.selectedRooms) {
      const room = rooms.find(room => room.room_id === selectedRoom.room_id);
      if (!room || room.available_rooms < selectedRoom.roomQuantity) {
        return res.status(200).json({ isAvailable: false });
      }
    }

    return res.status(200).json({ isAvailable: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getHotelDetails, searchRoom, checkRoomAvailability };
