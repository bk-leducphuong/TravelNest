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
            AND ri.status = 'open'
            GROUP BY 
                h.hotel_id, h.name, h.address, h.city, h.overall_rating, h.hotel_class, h.image_urls, 
                h.latitude, h.longitude, r.room_id, ri.price_per_night, r.max_guests, r.room_name
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

        // get lowest price for each hotel
        const lowestPriceQuery = `
            SELECT hotel_id, MIN(ri.price_per_night) AS lowest_price
            FROM rooms
            JOIN room_inventory ri ON rooms.room_id = ri.room_id
            WHERE hotel_id = ?
            GROUP BY hotel_id;
        `
        for (const hotel of hotels) {
            const lowestPrice = await queryAsync(lowestPriceQuery, [hotel.hotel_id]);
            hotel.lowestPrice = lowestPrice[0].lowest_price
        }

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

const saveSearchInformation = async (req, res) => {
  try {
    const user_id = req.session ? req.session.user.user_id : null;
    
    const { location, checkInDate, checkOutDate, adults, children, rooms } = req.body;
    if (!location || !checkInDate || !checkOutDate || !adults || !children || !rooms) {
      return res
        .status(400)
        .json({ success: false, message: "Missing search details" });
    }
    // xóa nếu trùng
    const deleteQuery = `
        DELETE FROM search_logs
        WHERE user_id = ? AND location = ? AND checkInDate =? AND checkOutDate =?;
    `;
    await queryAsync(deleteQuery, [user_id, location, checkInDate, checkOutDate]);
    
    const query = `
        INSERT INTO search_logs (location, user_id, search_time, children, adults,rooms, checkInDate, checkOutDate)
            VALUES (?, ?, NOW(), ?, ?,?,?,?);`;

    // Thực hiện truy vấn
    await queryAsync(query, [
      location,
      user_id,
      children,
      adults,
      rooms,
      checkInDate,
      checkOutDate
    ]);

    // Trả về phản hồi thành công
    res
      .status(201)
      .json({ success: true, message: "Search log recorded successfully" });
  } catch (error) {
    // Xử lý lỗi
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getSearchResults, saveSearchInformation };
