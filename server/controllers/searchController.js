const connection = require('../config/db'); // Đường dẫn đến file kết nối DB
const { promisify } = require('util');
// Chức năng để thực hiện truy vấn với MySQL
const queryAsync = promisify(connection.query).bind(connection);

const getSearchResults = async (req, res) => {
    try {
        const { location, adults, children, dateRange, rooms } = req.body;

        if (!location || !adults || !children || !dateRange || !rooms) {
            return res.status(400).json({ success: false, message: "Missing search criteria" });
        }

        // Tổng số khách cần lưu trú
        const total_guests = parseInt(adults, 10) + parseInt(children, 10);;

        // Tách chuỗi dateRange
        const datePattern = /Từ (\d{2}\/\d{2}\/\d{4}) đến (\d{2}\/\d{2}\/\d{4})/;
        const match = dateRange.match(datePattern);
        // console.log("****");
        // console.log( match);
        // console.log("****");

        if (!match) {
            console.log("match is null or undefined");
            return res.status(400).json({ success: false, message: "Invalid date range format" });
        }
        const check_in_parts = match[1].split('/');
        const check_out_parts = match[2].split('/');
        
        const check_in = new Date(check_in_parts[2], check_in_parts[1] - 1, check_in_parts[0]); // YYYY, MM, DD
        const check_out = new Date(check_out_parts[2], check_out_parts[1] - 1, check_out_parts[0]); // YYYY, MM, DD
        console.log(location, total_guests, rooms, check_in, check_out);
        // Truy vấn tìm khách sạn và phòng trống dựa trên khoảng thời gian
        const query = `
            SELECT h.hotel_id, h.name, h.city, h.country, h.overall_rating, h.hotel_class, h.hotel_amenities, h.image_urls, 
                   r.room_id, r.description AS room_description, r.price_per_night, r.max_guests, r.total_rooms, r.booked_rooms
            FROM hotels h
            JOIN rooms r ON h.hotel_id = r.hotel_id
            JOIN room_availability ra ON r.room_id = ra.room_id
            WHERE h.city = ?
            AND r.max_guests >= ?
            AND (r.total_rooms - r.booked_rooms) >= ?
            AND ra.available_from <= ?
            AND ra.available_to >= ?;
        `;

        // Thực hiện truy vấn
        const hotels = await queryAsync(query, [location, total_guests, rooms, check_in, check_out]);
       // console.log(hotels);
        if (hotels.length === 0) {
            return res.status(404).json({ success: false, message: "No hotels found matching the criteria" });
        }

        res.status(200).json({ success: true, hotels });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {getSearchResults}