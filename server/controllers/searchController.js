const connection = require("../config/db"); // Đường dẫn đến file kết nối DB
const { promisify } = require("util");
// Chức năng để thực hiện truy vấn với MySQL
const queryAsync = promisify(connection.query).bind(connection);

const getSearchResults = async (req, res) => {
    try {
        const { location, adults, children, checkInDate, checkOutDate, rooms, numberOfDays } = req.body.searchData;

        if (!location || !adults || !children || !checkInDate || !checkOutDate || !rooms) {
            return res
                .status(400)
                .json({ success: false, hotels: [], message: "Missing search criteria" });
        }

        // tổng số khách cần lưu trú
        const total_guests = parseInt(adults, 10) + parseInt(children, 10);
       
        const query = `
            select distinct 
                h.hotel_id, 
                h.name, 
                h.address, 
                h.city, 
                h.overall_rating, 
                h.hotel_class, 
                h.image_urls, 
                h.latitude, 
                h.longitude
            from hotels h
            join rooms r 
                on h.hotel_id = r.hotel_id
            join room_inventory ri 
                on r.room_id = ri.room_id
            where h.city = ?
            AND r.max_guests >= ?
            AND ri.date BETWEEN ? AND ?
            GROUP BY 
                h.hotel_id, h.name, h.address, h.city, h.overall_rating, h.hotel_class, h.image_urls, 
                h.latitude, h.longitude, r.room_id, r.price_per_night, r.max_guests, r.room_name
            HAVING COUNT(CASE WHEN ri.total_inventory - ri.total_reserved >= ? THEN 1 END) = ?;
        `

        // Thực hiện truy vấn
        const hotels = await queryAsync(query, [
            location,
            total_guests,
            checkInDate,
            checkOutDate,
            rooms,
            numberOfDays
        ]);

        if (hotels.length === 0) {
            return res
                .status(200)
                .json({
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

module.exports = { getSearchResults };
