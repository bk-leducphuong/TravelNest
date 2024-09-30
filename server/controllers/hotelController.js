// Sample function for fetching all hotels
const getAllHotels = (req, res) => {
  // For now, just return a static response
  res.status(200).json({
    message: 'List of hotels',
    hotels: [
      { id: 1, name: 'Hotel A', location: 'City A' },
      { id: 2, name: 'Hotel B', location: 'City B' },
    ],
  });
};

module.exports = { getAllHotels };
