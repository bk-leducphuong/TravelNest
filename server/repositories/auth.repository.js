const { Users } = require('../models/index.js');

/**
 * Auth Repository - Contains all database operations for authentication
 * Only repositories may import Sequelize models
 */

class AuthRepository {
  /**
   * Find user by email and role
   */
  async findByEmailAndRole(email, userRole) {
    return await Users.findOne({
      where: {
        email: email,
        user_role: userRole,
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await Users.findOne({
      where: { email },
    });
  }

  /**
   * Find user by email or phone number and role
   */
  async findByEmailOrPhoneAndRole(email, phoneNumber, userRole) {
    const { Op } = require('sequelize');
    return await Users.findOne({
      where: {
        [Op.or]: [{ email: email }, { phone_number: phoneNumber }],
        user_role: userRole,
      },
    });
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    return await Users.create(userData);
  }

  /**
   * Update user password by email and role
   */
  async updatePasswordByEmailAndRole(email, userRole, passwordHash) {
    const [updatedRows] = await Users.update(
      { password_hash: passwordHash },
      {
        where: {
          email: email,
          user_role: userRole,
        },
      }
    );
    return updatedRows;
  }

  /**
   * Find user by email and role with password hash
   */
  async findByEmailAndRoleWithPassword(email, userRole) {
    return await Users.findOne({
      where: {
        email: email,
        user_role: userRole,
      },
      attributes: ['user_id', 'email', 'password_hash', 'user_role'],
    });
  }
}

module.exports = new AuthRepository();
