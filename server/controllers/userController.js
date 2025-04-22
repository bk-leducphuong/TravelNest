const getUserInformation = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const user = await Users.findOne({
      where: { user_id: userId },
      attributes: ['user_id', 'user_role', 'username', 'email', 'full_name', 'phone_number', 
                  'address', 'nationality', 'country', 'profile_picture_url', 'date_of_birth', 'gender']
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Example of edit functions converted
const editName = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.session.user.user_id;
    await Users.update(
      { full_name: name },
      { where: { user_id: userId } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFavoriteHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const favorites = await SavedHotels.findAll({
      where: { user_id: userId },
      include: [{
        model: Hotels,
        attributes: ['name', 'overall_rating', 'address', 'hotel_class', 'image_urls']
      }]
    });
    res.status(200).json({ hotels: favorites });
  } catch (error) {
    console.log("Error getting favorite hotels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const setFavoriteHotels = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const hotelId = req.body.hotelId;
    
    const [favorite, created] = await SavedHotels.findOrCreate({
      where: { hotel_id: hotelId, user_id: userId }
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error setting favorite hotels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
