/**
 * User Seed File
 *
 * Generates fake user data using Faker.js and seeds the database.
 *
 * Usage:
 *   - Run directly: node seed/user.seed.js
 *   - Import and use: const { seedUsers } = require('./seed/user.seed');
 *
 * Options:
 *   - customerCount: Number of customers to generate (default: 50)
 *   - partnerCount: Number of partners to generate (default: 10)
 *   - adminCount: Number of admins to generate (default: 3)
 *   - clearExisting: Whether to clear existing users before seeding (default: false)
 *
 * Note: Duplicate emails (same email + role combination) will be skipped automatically.
 */

require('dotenv').config({
  path:
    process.env.NODE_ENV === 'development'
      ? '.env.development'
      : '.env.production',
});
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const db = require('../models');
const sequelize = require('../config/database.config');
const { users } = db;

/**
 * Generate fake user data
 * @param {Object} options - Options for generating user data
 * @param {string} options.userRole - User role: 'customer', 'partner', or 'admin'
 * @param {number} options.count - Number of users to generate
 * @returns {Promise<Array>} Array of user data objects
 */
async function generateUsers(options = {}) {
  const { userRole = 'customer', count = 10 } = options;
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({
      firstName,
      lastName,
      provider: faker.internet.domainName(),
    });

    // Generate a random password and hash it
    const password = faker.internet.password({ length: 12 });
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique connect_account_id for partners
    const connectAccountId =
      userRole === 'partner' ? `acct_${faker.string.alphanumeric(16)}` : null;

    const user = {
      username: faker.internet.username({ firstName, lastName }),
      email: email.toLowerCase(),
      password_hash: passwordHash,
      full_name: fullName,
      phone_number: `+${faker.string.numeric(10, { allowLeadingZeros: false })}`, // Format: +1234567890 (max 15 chars)
      user_role: userRole,
      address: faker.location.streetAddress({ useFullAddress: true }),
      country: faker.location.country(),
      date_of_birth: faker.date
        .birthdate({ min: 18, max: 80, mode: 'age' })
        .toISOString()
        .split('T')[0], // Format: YYYY-MM-DD
      gender: faker.helpers.arrayElement(['male', 'female']),
      nationality: faker.location.country(),
      profile_picture_url: faker.image.avatar(),
      connect_account_id: connectAccountId,
      created_at: faker.date.past({ years: 2 }),
      updated_at: faker.date.recent({ days: 30 }),
    };

    users.push(user);
  }

  return users;
}

/**
 * Seed users into the database
 * @param {Object} options - Seeding options
 * @param {number} options.customerCount - Number of customers to seed (default: 50)
 * @param {number} options.partnerCount - Number of partners to seed (default: 10)
 * @param {number} options.adminCount - Number of admins to seed (default: 3)
 * @param {boolean} options.clearExisting - Whether to clear existing users (default: false)
 */
async function seedUsers(options = {}) {
  const {
    customerCount = 50,
    partnerCount = 10,
    adminCount = 3,
    clearExisting = false,
  } = options;

  try {
    console.log('🌱 Starting user seeding...');

    // Clear existing users if requested
    if (clearExisting) {
      console.log('🗑️  Clearing existing users...');
      await users.destroy({ where: {}, truncate: true });
      console.log('✅ Existing users cleared');
    }

    // Generate and seed customers
    console.log(`👥 Generating ${customerCount} customers...`);
    const customers = await generateUsers({
      userRole: 'customer',
      count: customerCount,
    });
    await users.bulkCreate(customers, {
      ignoreDuplicates: true,
      validate: true,
    });
    console.log(`✅ ${customers.length} customers seeded`);

    // Generate and seed partners
    console.log(`🏢 Generating ${partnerCount} partners...`);
    const partners = await generateUsers({
      userRole: 'partner',
      count: partnerCount,
    });
    await users.bulkCreate(partners, {
      ignoreDuplicates: true,
      validate: true,
    });
    console.log(`✅ ${partners.length} partners seeded`);

    // Generate and seed admins
    console.log(`👔 Generating ${adminCount} admins...`);
    const admins = await generateUsers({
      userRole: 'admin',
      count: adminCount,
    });
    await users.bulkCreate(admins, {
      ignoreDuplicates: true,
      validate: true,
    });
    console.log(`✅ ${admins.length} admins seeded`);

    const totalSeeded = customers.length + partners.length + admins.length;
    console.log(`🎉 Successfully seeded ${totalSeeded} users!`);

    // Display summary
    const totalUsers = await users.count();
    const customerCount_db = await users.count({
      where: { user_role: 'customer' },
    });
    const partnerCount_db = await users.count({
      where: { user_role: 'partner' },
    });
    const adminCount_db = await users.count({ where: { user_role: 'admin' } });

    console.log('\n📊 User Summary:');
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Customers: ${customerCount_db}`);
    console.log(`   Partners: ${partnerCount_db}`);
    console.log(`   Admins: ${adminCount_db}`);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

/**
 * Seed a single user (useful for testing)
 * @param {Object} userData - User data to seed
 * @returns {Promise<Object>} Created user
 */
async function seedSingleUser(userData = {}) {
  const defaultUser = {
    email: faker.internet.email(),
    password_hash: await bcrypt.hash('password123', 10),
    user_role: 'customer',
    full_name: faker.person.fullName(),
    phone_number: faker.phone.number('+1##########'),
  };

  const user = { ...defaultUser, ...userData };

  try {
    const createdUser = await users.create(user);
    console.log(`✅ User created: ${createdUser.email}`);
    return createdUser;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

// If running directly
if (require.main === module) {
  (async () => {
    try {
      // Test database connection
      await sequelize.authenticate();
      console.log('✅ Database connection established');

      // Seed users
      await seedUsers({
        customerCount: 50,
        partnerCount: 10,
        adminCount: 3,
        clearExisting: false, // Set to true to clear existing users
      });

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
  seedSingleUser,
  generateUsers,
};
