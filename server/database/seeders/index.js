const { seedUsers } = require('./user.seed');
const { seedReviews } = require('./review.seed');
const { seedRooms } = require('./room.seed');
const { seedBookings } = require('./booking.seed');

if (require.main === module) {
  (async () => {
    try {
      // Test database connection
      await db.sequelize.authenticate();
      console.log('✅ Database connection established');

      // Close database connection
      await db.sequelize.close();
      console.log('✅ Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = {
  seedUsers,
  seedReviews,
  seedRooms,
  seedBookings,
};
