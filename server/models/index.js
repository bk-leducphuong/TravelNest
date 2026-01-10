const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.model.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    // Use model name (table name) as key, but also create PascalCase alias for compatibility
    const tableName = model.name;
    db[tableName] = model;
    
    // Create PascalCase alias for compatibility with old code
    // Convert 'viewed_hotels' -> 'ViewedHotels', 'saved_hotels' -> 'SavedHotels', etc.
    const pascalCaseName = tableName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    db[pascalCaseName] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
