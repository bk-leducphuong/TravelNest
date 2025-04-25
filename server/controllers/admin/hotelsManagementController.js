const {Hotels } = require('../../models/init-models.js');

const getAllManagingHotels = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const managingHotels = await Hotels.findAll({
            where: {
                owner_id: userId
            }
        })
        res.status(200).json({ managingHotels });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllManagingHotels,
}