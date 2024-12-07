const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/************************** Connection to database  *********************************/

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD, // replace by your database password
  database: "booking_hotel",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

/************************** Insert database methods ******************************/

// Wrapper to use Promises with MySQL queries
const queryPromise = (sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Hàm chèn thông tin khách sạn vào MySQL
const insertHotel = async (hotel) => {
  const sql = `INSERT INTO hotels (name, description, address, city, phone_number, overall_rating, latitude, longitude, image_urls, hotel_class, hotel_amenities, check_in_time, check_out_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    hotel.name,
    hotel.description,
    hotel.address,
    process.env.LOCATION,
    hotel.phone,
    hotel.overall_rating,
    hotel.gps_coordinates.latitude,
    hotel.gps_coordinates.longitude,
    JSON.stringify(hotel.image_urls),
    hotel.extracted_hotel_class,
    JSON.stringify(hotel.amenities),
    hotel.check_in_time,
    hotel.check_out_time,
  ];

  const result = await queryPromise(sql, values);
  return result.insertId;
};

// Hàm chèn thông tin nearby_places vào MySQL
const insertNearbyPlaces = async (nearby_places) => {
  const sql = `INSERT INTO nearby_places (hotel_id, place_name, latitude, longitude) VALUES (?, ?, ?, ?)`;
  const values = [
    nearby_places.hotel_id,
    nearby_places.place_name,
    nearby_places.latitude,
    nearby_places.longitude,
  ];

  await queryPromise(sql, values);
};

// Hàm chèn thông tin reviews_breakdown vào MySQL
const insertReviewsBreakdown = async (review_breakdown) => {
  const sql = `INSERT INTO reviews_breakdown (hotel_id, category_name, total_mentioned, positive, negative, neutral) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    review_breakdown.hotel_id,
    review_breakdown.name,
    review_breakdown.total_mentioned,
    review_breakdown.positive,
    review_breakdown.negative,
    review_breakdown.neutral,
  ];

  await queryPromise(sql, values);
};

// Hàm chèn thông tin rooms vào database
const insertRooms = async (room) => {
  const sql = `INSERT INTO rooms (hotel_id, price_per_night, max_guests, total_rooms, booked_rooms, room_name, image_urls, room_amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    room.hotel_id,
    room.price_per_night,
    room.max_guests,
    room.total_rooms,
    room.booked_rooms,
    room.name,
    JSON.stringify(room.image_urls),
    JSON.stringify(room.room_amenities),
  ];

  await queryPromise(sql, values);
};

// Hàm chèn reviews vào database
const insertReviews = async (review) => {
  const sql = `INSERT INTO reviews (user_id, hotel_id, rating, comment) VALUES (?, ?, ?, ?)`;
  const values = [
    review.user_id,
    review.hotel_id,
    review.rating,
    review.comment,
  ];

  await queryPromise(sql, values);
};

const checkHotelExist = (latitude, longitude, callback) => {
  const sql = `SELECT hotel_id FROM hotels WHERE latitude = ? AND longitude = ? LIMIT 1`;

  connection.query(sql, [latitude, longitude], (err, results) => {
    if (err) {
      console.error("Error checking hotel existence:", err);
      callback(err, null);
      return;
    }

    // Nếu tìm thấy ít nhất một hàng, trả về hotel_id, ngược lại trả về null
    if (results.length > 0) {
      callback(null, results[0].hotel_id); // Trả về hotel_id nếu tồn tại
    } else {
      callback(null, null); // Không tồn tại
    }
  });
};

// Hàm chèn dữ liệu room_availability vào database
const insertRoomAvailability = async () => {
  const NUMBER_OF_DAYS = 60; // 2 months
  const query = "SELECT room_id, price_per_night FROM rooms ORDER BY room_id ASC";
  const results = await queryPromise(query);

  // for (room of results) {
  //   for (let i = 0; i < NUMBER_OF_DAYS; i++) {
  //     const d = new Date();
  //     d.setDate(d.getDate() + i);

  //     const query = `INSERT INTO room_inventory (room_id, date, total_inventory, total_reserved) VALUES (?, ?, ?, ?)`;
  //     await queryPromise(query, [room.room_id, d, 10, 0]);
  //     ``;
  //   }
  // }

  for (room of results) {
    const query = `UPDATE room_inventory SET status = 'open', price_per_night = ? WHERE room_id = ?`;
    await queryPromise(query, [room.price_per_night, room.room_id]);
  }
};

/*************************** Data processing ***************************/

// const processHotelData = async () => {
//   const folderPath = path.join(
//     __dirname,
//     `data/hotels/${process.env.LOCATION}`
//   ); // path to hotels folder

//   fs.readdir(folderPath, (err, files) => {
//     if (err) {
//       return console.error("Unable to scan folder:", err);
//     }

//     files.forEach((file) => {
//       const filePath = path.join(folderPath, file);

//       // Kiểm tra xem đây có phải là file không
//       fs.stat(filePath, (err, stats) => {
//         if (err) {
//           console.error(`Unable to get stats of file ${file}:`, err);
//           return;
//         }

//         if (stats.isFile()) {
//           // Đọc nội dung của file
//           fs.readFile(filePath, "utf-8", async (err, data) => {
//             if (err) {
//               console.error(`Unable to read file ${file}:`, err);
//             } else {
//               try {
//                 const hotel = JSON.parse(data);

//                 /************************* hotels ***************************/

//                 // Convert `checkHotelExist` to return a Promise
//                 const checkHotelExistPromise = (latitude, longitude) =>
//                   new Promise((resolve, reject) => {
//                     checkHotelExist(latitude, longitude, (err, ex_hotel_id) => {
//                       if (err) {
//                         reject(err);
//                       } else {
//                         resolve(ex_hotel_id);
//                       }
//                     });
//                   });

//                 // Check if hotel exists by coordinates
//                 let hotel_id = await checkHotelExistPromise(
//                   hotel.gps_coordinates.latitude,
//                   hotel.gps_coordinates.longitude
//                 );

//                 // If hotel does not exist, insert a new hotel
//                 if (!hotel_id) {
//                   hotel.image_urls = hotel.images.map(
//                     (obj) => obj.original_image
//                   );

//                   hotel.amenities = hotel.amenities || [
//                     "Lễ tân 24/7",
//                     "Wi-Fi miễn phí",
//                     "Bãi đỗ xe",
//                     "Dịch vụ phòng",
//                     "Phòng tập thể dục",
//                     "Hồ bơi",
//                     "Nhà hàng",
//                     "Dịch vụ giặt là",
//                     "Dịch vụ đưa đón sân bay",
//                   ];

//                   hotel.description =
//                     hotel.description ||
//                     `Tọa lạc gần địa danh nổi bật, ${hotel.name} mang đến sự tiện nghi với phòng ốc hiện đại, Wi-Fi tốc độ cao, và các tiện ích khác như hồ bơi, spa,.... Thưởng thức các đặc sản ngay trong khách sạn và khám phá vẻ đẹp của các địa danh nổi tiếng chỉ với vài bước chân.`;

//                   hotel_id = await insertHotel(hotel); // Insert the new hotel and get its ID
//                 } else {
//                   console.log("Hotel exists with ID:", hotel_id);
//                 }

//                 /************************* nearby_places ***************************/
//                 // Insert each nearby place associated with the hotel
//                 for (const place of hotel.nearby_places) {
//                   const nearby_place_data = {
//                     place_name: place.name,
//                     hotel_id: hotel_id,
//                     latitude: place.gps_coordinates.latitude,
//                     longitude: place.gps_coordinates.longitude,
//                   };

//                   await insertNearbyPlaces(nearby_place_data);
//                 }

//                 /*********************** reviews breakdown **************************/
//                 for (const review_breakdown of hotel.reviews_breakdown) {
//                   review_breakdown.hotel_id = hotel_id;
//                   await insertReviewsBreakdown(review_breakdown);
//                 }

//                 /************************* rooms *****************************/
//                 let isRoomInserted = false;

//                 for (const item of hotel.featured_prices) {
//                   if (item.rooms && !isRoomInserted) {
//                     for (const room of item.rooms) {
//                       // extract and create room data
//                       let roomData = {
//                         hotel_id,
//                         price_per_night: room.rate_per_night.extracted_lowest,
//                         max_guests: room.num_guests,
//                         total_rooms: 10,
//                         booked_rooms: 0,
//                         name: room.name,
//                         image_urls: room.images,
//                         room_amenities: [
//                           "Giường ngủ thoải mái",
//                           "Bàn làm việc và ghế",
//                           "Internet Wi-Fi miễn phí",
//                           "Điều hòa không khí",
//                           "TV màn hình phẳng",
//                           "Két sắt an toàn",
//                           "Tủ lạnh nhỏ và minibar",
//                           "Ấm đun nước và cà phê, trà miễn phí",
//                           "Phòng tắm riêng với vòi hoa sen hoặc bồn tắm",
//                           "Khăn tắm và đồ dùng vệ sinh cá nhân",
//                           "Tủ quần áo và móc treo đồ",
//                           "Điện thoại nội bộ",
//                           "Đèn ngủ và đèn đọc sách",
//                           "Gương soi toàn thân",
//                           "Bàn ủi và bàn để ủi",
//                           "Ổ cắm điện đa năng",
//                         ],
//                       };

//                       await insertRooms(roomData);
//                     }

//                     isRoomInserted = true;
//                   }
//                 }

//                 if (!isRoomInserted) {
//                   const rooms = [
//                     {
//                       hotel_id: hotel_id,
//                       name: "Phòng Tiêu Chuẩn",
//                       price_per_night: 800000,
//                       max_guests: 2,
//                       total_rooms: 10,
//                       booked_rooms: 3,
//                       image_urls: [
//                         "https://example.com/images/phong_tieu_chuan_1.jpg",
//                         "https://example.com/images/phong_tieu_chuan_2.jpg",
//                       ],
//                       room_amenities: [
//                         "Wi-Fi miễn phí",
//                         "Tivi màn hình phẳng",
//                         "Điều hòa nhiệt độ",
//                         "Tủ lạnh mini",
//                         "Dịch vụ dọn phòng hàng ngày",
//                       ],
//                     },
//                     {
//                       hotel_id: hotel_id,
//                       name: "Phòng Gia Đình",
//                       price_per_night: 1500000,
//                       max_guests: 4,
//                       total_rooms: 5,
//                       booked_rooms: 1,
//                       image_urls: [
//                         "https://example.com/images/phong_gia_dinh_1.jpg",
//                         "https://example.com/images/phong_gia_dinh_2.jpg",
//                       ],
//                       room_amenities: [
//                         "Wi-Fi miễn phí",
//                         "Tivi màn hình phẳng",
//                         "Điều hòa nhiệt độ",
//                         "Tủ lạnh mini",
//                         "Bếp nhỏ",
//                         "Khu vực tiếp khách",
//                         "Ban công",
//                       ],
//                     },
//                   ];

//                   for (const room of rooms) {
//                     await insertRooms(room);
//                   }
//                 }

//                 /*********************** reviews ******************/
//                 const reviews = [
//                   {
//                     user_id: 7,
//                     hotel_id: hotel_id,
//                     rating: 4,
//                     comment:
//                       "Phòng ốc rộng rãi, sạch sẽ. Nhân viên rất thân thiện và hỗ trợ nhiệt tình. Tuy nhiên, bữa sáng chưa đa dạng lắm.",
//                   },
//                   {
//                     user_id: 10,
//                     hotel_id: hotel_id,
//                     rating: 5,
//                     comment:
//                       "Khách sạn tuyệt vời! Dịch vụ chuyên nghiệp, mọi thứ đều hoàn hảo. Vị trí thuận tiện, gần trung tâm và các điểm tham quan nổi tiếng.",
//                   },
//                   {
//                     user_id: 4,
//                     hotel_id: hotel_id,
//                     rating: 3,
//                     comment:
//                       "Khách sạn ổn cho một kỳ nghỉ ngắn ngày, nhưng một số tiện nghi như wifi và tủ lạnh cần cải thiện. Giá cả hợp lý.",
//                   },
//                   {
//                     user_id: 11,
//                     hotel_id: hotel_id,
//                     rating: 2,
//                     comment:
//                       "Không hài lòng lắm. Phòng khá nhỏ và hơi ồn do gần đường. Thái độ nhân viên chưa thân thiện.",
//                   },
//                   {
//                     user_id: 5,
//                     hotel_id: hotel_id,
//                     rating: 4,
//                     comment:
//                       "Kỳ nghỉ dễ chịu, phòng tắm sạch sẽ, view đẹp. Sẽ quay lại lần sau nếu có dịp.",
//                   },
//                 ];

//                 for (const review of reviews) {
//                   await insertReviews(review);
//                 }
//               } catch (error) {
//                 console.error("Error:", error);
//               }
//             }
//           });
//         }
//       });
//     });
//   });
// };

// run
async function main() {
  // await processHotelData();
  await insertRoomAvailability();
  console.log("Data inserted successfully");
}

main();
