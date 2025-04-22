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

function initModels(sequelize) {
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

  bookings.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(bookings, { as: "bookings", foreignKey: "hotel_id"});
  invoices.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(invoices, { as: "invoices", foreignKey: "hotel_id"});
  nearby_places.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(nearby_places, { as: "nearby_places", foreignKey: "hotel_id"});
  notifications.belongsTo(hotels, { as: "reciever", foreignKey: "reciever_id"});
  hotels.hasMany(notifications, { as: "notifications", foreignKey: "reciever_id"});
  refunds.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(refunds, { as: "refunds", foreignKey: "hotel_id"});
  reviews.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(reviews, { as: "reviews", foreignKey: "hotel_id"});
  rooms.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(rooms, { as: "rooms", foreignKey: "hotel_id"});
  saved_hotels.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(saved_hotels, { as: "saved_hotels", foreignKey: "hotel_id"});
  transactions.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(transactions, { as: "transactions", foreignKey: "hotel_id"});
  viewed_hotels.belongsTo(hotels, { as: "hotel", foreignKey: "hotel_id"});
  hotels.hasMany(viewed_hotels, { as: "viewed_hotels", foreignKey: "hotel_id"});
  review_criterias.belongsTo(reviews, { as: "review", foreignKey: "review_id"});
  reviews.hasMany(review_criterias, { as: "review_criteria", foreignKey: "review_id"});
  bookings.belongsTo(rooms, { as: "room", foreignKey: "room_id"});
  rooms.hasMany(bookings, { as: "bookings", foreignKey: "room_id"});
  room_inventory.belongsTo(rooms, { as: "room", foreignKey: "room_id"});
  rooms.hasMany(room_inventory, { as: "room_inventories", foreignKey: "room_id"});
  fees.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(fees, { as: "fees", foreignKey: "transaction_id"});
  invoices.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(invoices, { as: "invoices", foreignKey: "transaction_id"});
  payments.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(payments, { as: "payments", foreignKey: "transaction_id"});
  refunds.belongsTo(transactions, { as: "transaction", foreignKey: "transaction_id"});
  transactions.hasMany(refunds, { as: "refunds", foreignKey: "transaction_id"});
  bookings.belongsTo(users, { as: "buyer", foreignKey: "buyer_id"});
  users.hasMany(bookings, { as: "bookings", foreignKey: "buyer_id"});
  hotels.belongsTo(users, { as: "owner", foreignKey: "owner_id"});
  users.hasMany(hotels, { as: "hotels", foreignKey: "owner_id"});
  notifications.belongsTo(users, { as: "sender", foreignKey: "sender_id"});
  users.hasMany(notifications, { as: "notifications", foreignKey: "sender_id"});
  refunds.belongsTo(users, { as: "buyer", foreignKey: "buyer_id"});
  users.hasMany(refunds, { as: "refunds", foreignKey: "buyer_id"});
  reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "user_id"});
  saved_hotels.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(saved_hotels, { as: "saved_hotels", foreignKey: "user_id"});
  user_notifications.belongsTo(users, { as: "reciever", foreignKey: "reciever_id"});
  users.hasMany(user_notifications, { as: "user_notifications", foreignKey: "reciever_id"});
  viewed_hotels.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(viewed_hotels, { as: "viewed_hotels", foreignKey: "user_id"});

  return {
    bookings,
    fees,
    hotels,
    invoices,
    nearby_places,
    notifications,
    payments,
    refunds,
    review_criterias,
    reviews,
    room_inventory,
    rooms,
    saved_hotels,
    search_logs,
    transactions,
    user_notifications,
    users,
    viewed_hotels,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
