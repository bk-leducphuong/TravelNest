const sequelize = require("../config/db");
var DataTypes = require("sequelize").DataTypes;

var _bookings = require("./bookings");
var _fees = require("./fees");
var _hotels = require("./hotels");
var _invoices = require("./invoices");
var _nearby_places = require("./nearby_places");
var _notifications = require("./notifications");
var _payments = require("./payments");
var _refunds = require("./refunds");
var _review_criterias = require("./review_criterias");
var _reviews = require("./reviews");
var _room_inventory = require("./room_inventory");
var _rooms = require("./rooms");
var _saved_hotels = require("./saved_hotels");
var _search_logs = require("./search_logs");
var _transactions = require("./transactions");
var _user_notifications = require("./user_notifications");
var _users = require("./users");
var _viewed_hotels = require("./viewed_hotels");

let models = null;

async function initModels(sequelize) {
  var bookings = _bookings(sequelize, DataTypes);
  var fees = _fees(sequelize, DataTypes);
  var hotels = _hotels(sequelize, DataTypes);
  var invoices = _invoices(sequelize, DataTypes);
  var nearby_places = _nearby_places(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var refunds = _refunds(sequelize, DataTypes);
  var review_criterias = _review_criterias(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var room_inventory = _room_inventory(sequelize, DataTypes);
  var rooms = _rooms(sequelize, DataTypes);
  var saved_hotels = _saved_hotels(sequelize, DataTypes);
  var search_logs = _search_logs(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var user_notifications = _user_notifications(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var viewed_hotels = _viewed_hotels(sequelize, DataTypes);

  bookings.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(bookings, { foreignKey: "hotel_id" });
  invoices.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(invoices, { foreignKey: "hotel_id" });
  nearby_places.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(nearby_places, { foreignKey: "hotel_id" });
  notifications.belongsTo(hotels, { foreignKey: "reciever_id" });
  hotels.hasMany(notifications, { foreignKey: "reciever_id" });
  refunds.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(refunds, { foreignKey: "hotel_id" });
  reviews.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(reviews, { foreignKey: "hotel_id" });
  rooms.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(rooms, { foreignKey: "hotel_id" });
  saved_hotels.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(saved_hotels, { foreignKey: "hotel_id" });
  transactions.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(transactions, { foreignKey: "hotel_id" });
  viewed_hotels.belongsTo(hotels, { foreignKey: "hotel_id" });
  hotels.hasMany(viewed_hotels, { foreignKey: "hotel_id" });
  review_criterias.belongsTo(reviews, { foreignKey: "review_id" });
  reviews.hasMany(review_criterias, { foreignKey: "review_id" });
  bookings.belongsTo(rooms, { foreignKey: "room_id" });
  rooms.hasMany(bookings, { foreignKey: "room_id" });
  room_inventory.belongsTo(rooms, { foreignKey: "room_id" });
  rooms.hasMany(room_inventory, { foreignKey: "room_id" });
  fees.belongsTo(transactions, { foreignKey: "transaction_id" });
  transactions.hasMany(fees, { foreignKey: "transaction_id" });
  invoices.belongsTo(transactions, { foreignKey: "transaction_id" });
  transactions.hasMany(invoices, { foreignKey: "transaction_id" });
  payments.belongsTo(transactions, { foreignKey: "transaction_id" });
  transactions.hasMany(payments, { foreignKey: "transaction_id" });
  refunds.belongsTo(transactions, { foreignKey: "transaction_id" });
  transactions.hasMany(refunds, { foreignKey: "transaction_id" });
  bookings.belongsTo(users, { foreignKey: "buyer_id" });
  users.hasMany(bookings, { foreignKey: "buyer_id" });
  hotels.belongsTo(users, { foreignKey: "owner_id" });
  users.hasMany(hotels, { foreignKey: "owner_id" });
  notifications.belongsTo(users, { foreignKey: "sender_id" });
  users.hasMany(notifications, { foreignKey: "sender_id" });
  refunds.belongsTo(users, { foreignKey: "buyer_id" });
  users.hasMany(refunds, { foreignKey: "buyer_id" });
  reviews.belongsTo(users, { foreignKey: "user_id" });
  users.hasMany(reviews, { foreignKey: "user_id" });
  saved_hotels.belongsTo(users, { foreignKey: "user_id" });
  users.hasMany(saved_hotels, { foreignKey: "user_id" });
  user_notifications.belongsTo(users, { foreignKey: "reciever_id" });
  users.hasMany(user_notifications, { foreignKey: "reciever_id" });
  viewed_hotels.belongsTo(users, { foreignKey: "user_id" });
  users.hasMany(viewed_hotels, { foreignKey: "user_id" });
  reviews.belongsTo(bookings, { foreignKey: "booking_id" });

  return {
    Bookings: bookings,
    Fees: fees,
    Hotels: hotels,
    Invoices: invoices,
    NearbyPlaces: nearby_places,
    Notifications: notifications,
    Payments: payments,
    Refunds: refunds,
    ReviewCriterias: review_criterias,
    Reviews: reviews,
    RoomInventories: room_inventory,
    Rooms: rooms,
    SavedHotels: saved_hotels,
    SearchLogs: search_logs,
    Transactions: transactions,
    UserNotifications: user_notifications,
    Users: users,
    ViewedHotels: viewed_hotels,
  };
}

module.exports = {
  initialize: async () => {
    if (!models) {
      models = await initModels(sequelize);
      await sequelize.sync({ force: false });
    }
    return models;
  },
  getModels: () => {
    // if (!models) {
    //   throw new Error(
    //     "Models have not been initialized. Call initialize() first."
    //   );
    // }
    return models;
  },
};
