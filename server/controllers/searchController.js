const { getModels } = require("../models/init-models.js");
const { Rooms, RoomInventories, SearchLogs } = getModels();
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../config/db"); // Adjust the path as necessary

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

    if (
      !location ||
      !adults ||
      !children ||
      !checkInDate ||
      !checkOutDate ||
      !rooms
    ) {
      return res.status(400).json({
        success: false,
        hotels: [],
        message: "Missing search criteria",
      });
    }

    const total_guests = parseInt(adults, 10) + parseInt(children, 10);

    const hotels = await sequelize.query(
      `
      SELECT DISTINCT 
        h.hotel_id, 
        h.name, 
        h.address, 
        h.city, 
        h.overall_rating, 
        h.hotel_class, 
        h.image_urls, 
        h.latitude, 
        h.longitude
      FROM hotels h
      JOIN rooms r ON h.hotel_id = r.hotel_id
      JOIN room_inventory ri ON r.room_id = ri.room_id
      WHERE h.city = ?
        AND r.max_guests >= ?
        AND ri.date BETWEEN ? AND ?
        AND ri.status = 'open'
      GROUP BY 
        h.hotel_id, h.name, h.address, h.city, h.overall_rating, h.hotel_class, h.image_urls, 
        h.latitude, h.longitude, r.room_id, ri.price_per_night, r.max_guests, r.room_name
      HAVING COUNT(CASE WHEN ri.total_inventory - ri.total_reserved >= ? THEN 1 END) = ?
  `,
      {
        replacements: [
          location,
          total_guests,
          checkInDate,
          checkOutDate,
          rooms,
          numberOfDays,
        ],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (hotels && hotels.length === 0) {
      return res.status(200).json({
        success: false,
        hotels: [],
        message: "No hotels found matching the criteria",
      });
    }

    // Get lowest price for each hotel
    for (const hotel of hotels) {
      const lowestPrice = await RoomInventories.findOne({
        attributes: [
          [
            Sequelize.fn("SUM", Sequelize.col("price_per_night")),
            "total_price",
          ],
        ],
        include: [
          {
            model: Rooms,
            required: true,
            where: {
              hotel_id: hotel.hotel_id,
            },
          },
        ],
        where: {
          date: {
            [Op.between]: [checkInDate, checkOutDate],
          },
          status: "open",
        },
        group: ["room_id"],
        order: [[Sequelize.fn("SUM", Sequelize.col("price_per_night")), "ASC"]],
        raw: true,
      });

      hotel.lowestPrice = lowestPrice ? lowestPrice.total_price : null;
    }

    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, hotels: [], message: "Internal Server Error" });
  }
};

const saveSearchInformation = async (req, res) => {
  try {
    const user_id = req.session.user ? req.session.user.user_id : null;
    const {
      location,
      checkInDate,
      checkOutDate,
      adults,
      children,
      rooms,
      numberOfDays,
    } = req.body.searchData;

    if (
      !location ||
      !checkInDate ||
      !checkOutDate ||
      !adults ||
      !children ||
      !rooms ||
      !numberOfDays
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing search details" });
    }

    await SearchLogs.create({
      location,
      user_id,
      search_time: Sequelize.fn("NOW"),
      children,
      adults,
      rooms,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_days: numberOfDays,
    });

    res
      .status(201)
      .json({ success: true, message: "Search log recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getSearchResults, saveSearchInformation };
