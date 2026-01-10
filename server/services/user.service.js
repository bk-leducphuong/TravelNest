const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinaryConfig");
const userRepository = require("../repositories/user.repository");

/**
 * User Service - Contains main business logic
 */

class UserService {
  /**
   * Get user information
   */
  async getUserInformation(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  /**
   * Update user name
   */
  async updateName(userId, name) {
    await userRepository.updateById(userId, { full_name: name });
  }

  /**
   * Update user display name (username)
   */
  async updateDisplayName(userId, displayName) {
    await userRepository.updateById(userId, { username: displayName });
  }

  /**
   * Update user email
   */
  async updateEmail(userId, email) {
    await userRepository.updateById(userId, { email });
  }

  /**
   * Update user phone number
   */
  async updatePhoneNumber(userId, phoneNumber) {
    await userRepository.updateById(userId, { phone_number: phoneNumber });
  }

  /**
   * Update user date of birth
   */
  async updateDateOfBirth(userId, dateOfBirth) {
    await userRepository.updateById(userId, { date_of_birth: dateOfBirth });
  }

  /**
   * Update user address
   */
  async updateAddress(userId, address) {
    await userRepository.updateById(userId, { address });
  }

  /**
   * Update user nationality
   */
  async updateNationality(userId, nationality) {
    await userRepository.updateById(userId, { nationality });
  }

  /**
   * Update user country
   */
  async updateCountry(userId, country) {
    await userRepository.updateById(userId, { country });
  }

  /**
   * Update user gender
   */
  async updateGender(userId, gender) {
    await userRepository.updateById(userId, { gender });
  }

  /**
   * Update user avatar
   * @param {number} userId - User ID
   * @param {Buffer} fileBuffer - Image file buffer
   * @returns {Promise<string>} Profile picture URL
   */
  async updateAvatar(userId, fileBuffer) {
    // Compress image to AVIF using sharp
    const avifBuffer = await sharp(fileBuffer)
      .avif({ quality: 50 })
      .toBuffer();

    // Upload the AVIF image buffer to Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            public_id: `users/avatars/${userId}`,
          },
          async (error, result) => {
            if (error) {
              reject(new Error("Failed to upload image to Cloudinary"));
              return;
            }

            const profilePictureUrl = result.secure_url;
            await userRepository.updateById(userId, {
              profile_picture_url: profilePictureUrl,
            });

            resolve(profilePictureUrl);
          }
        )
        .end(avifBuffer);
    });
  }

  /**
   * Get favorite hotels with hotel information
   */
  async getFavoriteHotels(userId) {
    const favoriteHotels = await userRepository.findFavoriteHotelsByUserId(
      userId
    );

    const hotelsWithInfo = await Promise.all(
      favoriteHotels.map(async (hotel) => {
        const hotelInformation = await userRepository.findHotelById(
          hotel.hotel_id
        );
        return {
          ...hotel.toJSON(),
          hotelInformation,
        };
      })
    );

    return hotelsWithInfo;
  }

  /**
   * Add favorite hotel
   */
  async addFavoriteHotel(userId, hotelId) {
    // Check if hotel is already saved
    const hotelIsSaved = await userRepository.findSavedHotel(userId, hotelId);
    if (hotelIsSaved) {
      return; // Already saved, no need to add again
    }

    await userRepository.createSavedHotel(userId, hotelId);
  }

  /**
   * Remove favorite hotel
   */
  async removeFavoriteHotel(userId, hotelId) {
    await userRepository.deleteSavedHotel(userId, hotelId);
  }

  /**
   * Check if hotel is favorite
   */
  async checkFavoriteHotel(userId, hotelId) {
    const savedHotel = await userRepository.findSavedHotel(userId, hotelId);
    return !!savedHotel;
  }

  /**
   * Reset user password
   */
  async resetPassword(userId, oldPassword, newPassword) {
    // Get user with password hash
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await userRepository.updateById(userId, {
      password_hash: hashedPassword,
    });
  }
}

module.exports = new UserService();
