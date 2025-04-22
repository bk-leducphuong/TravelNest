const sequelize = require("../config/db");
const { Op, Sequelize, DataTypes } = require("sequelize");
const Hotels = require("../models/hotels")(sequelize, DataTypes);
const Bookings = require("../models/bookings")(sequelize, DataTypes);
const Reviews = require("../models/reviews")(sequelize, DataTypes);
const ViewedHotels = require("../models/viewed_hotels")(sequelize, DataTypes);
const SavedHotels = require("../models/saved_hotels")(sequelize, DataTypes);
const SearchLogs = require("../models/search_logs")(sequelize, DataTypes);
const redisClient = require("../config/redis");

const postRecentViewedHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const { hotelId } = req.body;

    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing hotel_id" });
    }

    // Delete existing view if exists
    await ViewedHotels.destroy({
      where: {
        user_id: userId,
        hotel_id: hotelId
      }
    });

    // Count existing views
    const count = await ViewedHotels.count({
      where: {
        user_id: userId
      }
    });

    // If count >= 10, delete oldest view
    if (count >= 10) {
      await ViewedHotels.destroy({
        where: { user_id: userId },
        order: [['viewed_at', 'ASC']],
        limit: 1
      });
    }

    // Create new view
    await ViewedHotels.create({
      user_id: userId,
      hotel_id: hotelId,
      viewed_at: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    res.status(201).json({ 
      success: true, 
      message: "Hotel view recorded successfully" 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getRecentViewedHotelInformation = async (hotelIdArray) => {
  const hotels = await Hotels.findAll({
    where: {
      hotel_id: {
        [Op.in]: hotelIdArray
      }
    },
    attributes: ['hotel_id', 'name', 'overall_rating', 'address', 'image_urls', 'city']
  });
  return hotels;
};

// get recent viewed hotels
const getRecentViewedHotels = async (req, res) => {
  try {
    let hotels = [];
    if (req.session.user) {
      const userId = req.session.user.user_id;

      const results = await ViewedHotels.findAll({
        where: { user_id: userId },
        attributes: ['hotel_id'],
        limit: 10
      });

      if (results.length === 0) {
        return res
          .status(200)
          .json({ success: false, message: "No recent viewed hotels" });
      }

      const hotelIdArray = results.map(result => result.hotel_id);
      hotels = await getRecentViewedHotelInformation(hotelIdArray);
    } else {
      const { hotelIdArray } = req.body;
      hotels = await getRecentViewedHotelInformation(hotelIdArray);
    }

    res.status(200).json({ success: true, hotels: hotels });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getRecentSearchs = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    const searches = await SearchLogs.findAll({
      where: { user_id: userId },
      attributes: [
        'search_id', 'location', 'check_in_date', 'check_out_date',
        'adults', 'children', 'rooms', 'search_time', 'number_of_days'
      ],
      order: [['search_time', 'DESC']],
      limit: 10
    });

    if (searches.length < 0) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json(searches);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeRecentSearch = async (req, res) => {
  try {
    const { search_id } = req.body;

    if (!search_id) {
      return res.status(400).json({ success: false, message: "Missing search_id" });
    }

    await SearchLogs.destroy({
      where: { search_id }
    });

    res.status(200).json({ success: true, message: "Search removed successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get top 10 most searched places
const getPopularPlaces = async (req, res) => {
  try {
    // Check Redis cache for popular places
    const cachedPopularPlaces = await redisClient.get("popular_places");

    if (cachedPopularPlaces) {
      return res.json({ popular_places: JSON.parse(cachedPopularPlaces) });
    }

    // If cache miss, query the database using Sequelize
    const results = await SearchLogs.findAll({
      attributes: [
        'location',
        [Sequelize.fn('COUNT', '*'), 'search_count']
      ],
      group: ['location'],
      order: [[Sequelize.fn('COUNT', '*'), 'DESC']],
      limit: 5
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        popular_places: [],
        message: "No popular places found",
      });
    }

    // Store results in Redis with TTL (1 day)
    await redisClient.set("popular_places", JSON.stringify(results), {
      EX: 60 * 60 * 24,
    });

    res.json({ popular_places: results });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get nearby hotels based on location (latitude, longitude)
const getNearByHotels = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude are required.",
      });
    }
    
    const { latitude, longitude } = location;
    const searchRadius = 6; // 6km radius

    // Using Sequelize literal for Haversine formula
    const distanceFormula = Sequelize.literal(`
      (6371 * acos(
        cos(radians(${latitude})) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${longitude})) + 
        sin(radians(${latitude})) * sin(radians(latitude))
      ))
    `);

    const results = await Hotels.findAll({
      attributes: {
        include: [[distanceFormula, 'distance']]
      },
      having: Sequelize.literal(`distance < ${searchRadius}`),
      order: [[Sequelize.literal('distance'), 'ASC']]
    });

    if (results.length === 0) {
      return res.status(200).json({
        success: false,
        hotels: [],
        message: "No nearby hotels found.",
      });
    }

    res.json({ success: true, hotels: results });
  } catch (error) {
    console.error("Error fetching nearby hotels:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getTopRatedHotels = async (req, res) => {
  try {
    const topHotels = await Hotels.findAll({
      attributes: [
        'hotel_id',
        'name',
        'address',
        'city',
        'overall_rating',
        'image_urls',
        'hotel_class',
        [Sequelize.fn('COUNT', Sequelize.col('reviews.review_id')), 'review_count']
      ],
      include: [{
        model: Reviews,
        attributes: [],
        required: false
      }],
      where: {
        overall_rating: {
          [Op.gte]: 4
        }
      },
      group: [
        'hotel_id',
        'name',
        'address',
        'city',
        'overall_rating',
        'image_urls',
        'hotel_class'
      ],
      having: Sequelize.literal('COUNT(reviews.review_id) >= 5'),
      order: [
        ['overall_rating', 'DESC'],
        [Sequelize.literal('review_count'), 'DESC']
      ],
      limit: 10
    });

    res.json(topHotels);
  } catch (error) {
    console.error('Error getting top rated hotels:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRecentlyViewedHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    const recentlyViewed = await ViewedHotels.findAll({
      include: [{
        model: Hotels,
        attributes: [
          'hotel_id',
          'name',
          'address',
          'city',
          'overall_rating',
          'image_urls',
          'hotel_class'
        ]
      }],
      where: { user_id: userId },
      order: [['viewed_at', 'DESC']],
      limit: 10
    });

    res.json(recentlyViewed.map(view => view.Hotel));
  } catch (error) {
    console.error('Error getting recently viewed hotels:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSavedHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    const savedHotels = await SavedHotels.findAll({
      include: [{
        model: Hotels,
        attributes: [
          'hotel_id',
          'name',
          'address',
          'city',
          'overall_rating',
          'image_urls',
          'hotel_class'
        ]
      }],
      where: { user_id: userId },
      order: [['saved_at', 'DESC']]
    });

    res.json(savedHotels.map(saved => saved.Hotel));
  } catch (error) {
    console.error('Error getting saved hotels:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPopularDestinations = async (req, res) => {
  try {
    const popularDestinations = await Hotels.findAll({
      attributes: [
        'city',
        [Sequelize.fn('COUNT', Sequelize.col('hotel_id')), 'hotel_count'],
        [Sequelize.fn('AVG', Sequelize.col('overall_rating')), 'avg_rating']
      ],
      group: ['city'],
      having: Sequelize.literal('COUNT(hotel_id) >= 5'),
      order: [
        [Sequelize.literal('hotel_count'), 'DESC'],
        [Sequelize.literal('avg_rating'), 'DESC']
      ],
      limit: 10
    });

    res.json(popularDestinations);
  } catch (error) {
    console.error('Error getting popular destinations:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTrendingHotels = async (req, res) => {
  try {
    // Get trending hotels based on views and bookings in the last 30 days
    const trendingHotels = await Hotels.findAll({
      attributes: [
        'hotel_id',
        'name',
        'address',
        'city',
        'overall_rating',
        'image_urls',
        'hotel_class',
        [Sequelize.fn('COUNT', Sequelize.col('viewed_hotels.view_id')), 'view_count'],
        [Sequelize.fn('COUNT', Sequelize.col('bookings.booking_id')), 'booking_count']
      ],
      include: [{
        model: ViewedHotels,
        attributes: [],
        required: false,
        where: {
          viewed_at: {
            [Op.gte]: Sequelize.literal('NOW() - INTERVAL \'30 days\'')
          }
        }
      }, {
        model: Bookings,
        attributes: [],
        required: false,
        where: {
          booking_date: {
            [Op.gte]: Sequelize.literal('NOW() - INTERVAL \'30 days\'')
          }
        }
      }],
      group: [
        'hotel_id',
        'name',
        'address',
        'city',
        'overall_rating',
        'image_urls',
        'hotel_class'
      ],
      order: [
        [Sequelize.literal('(view_count + booking_count * 2)'), 'DESC']
      ],
      limit: 10
    });

    res.json(trendingHotels);
  } catch (error) {
    console.error('Error getting trending hotels:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRecentViewedHotels,
  getRecentSearchs,
  removeRecentSearch,
  getPopularPlaces,
  getNearByHotels,
  postRecentViewedHotels,
  getTopRatedHotels,
  getRecentlyViewedHotels,
  getSavedHotels,
  getPopularDestinations,
  getTrendingHotels
};
