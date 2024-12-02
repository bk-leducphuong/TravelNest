const connection = require("../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const getUserInformation = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const userQuery = `SELECT user_id, user_role, username, email, full_name, phone_number, address, country, profile_picture_url FROM users WHERE user_id = ?`;
        const user = await queryAsync(userQuery, [userId]);
        res.status(200).json({ success: true, user: user[0] });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getBookingInformation = async (req, res) => {
    try {
        const {bookingCode} = req.body;
        const bookingInformation = await queryAsync('SELECT * FROM bookings WHERE booking_code = ?', [bookingCode]);
        res.status(200).json({ success: true, bookingInformation: bookingInformation[0] });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// edit user information controllers
const editName = async (req, res) => {
    try {
        const {name} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET full_name = ? WHERE user_id = ?`;
        await queryAsync(query, [name, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editDisplayName = async (req, res) => {
    try {
        const {displayName} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET username = ? WHERE user_id = ?`;
        await queryAsync(query, [displayName, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editEmail = async (req, res) => {
    try {
        const {email} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET email = ? WHERE user_id = ?`;
        await queryAsync(query, [email, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editPhoneNumber = async (req, res) => {
    try {
        const {phoneNumber} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET phone_number = ? WHERE user_id = ?`;
        await queryAsync(query, [phoneNumber, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editDateOfBirth = async (req, res) => {
    try {
        const {dateOfBirth} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET date_of_birth = ? WHERE user_id = ?`;
        await queryAsync(query, [dateOfBirth, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editAddress = async (req, res) => {
    try {
        const {address} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET address = ? WHERE user_id = ?`;
        await queryAsync(query, [address, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editNationality = async (req, res) => {
    try {
        const {nationality} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET country = ? WHERE user_id = ?`;
        await queryAsync(query, [nationality, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editGender = async (req, res) => {
    try {
        const {gender} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET gender = ? WHERE user_id = ?`;
        await queryAsync(query, [gender, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editAvatar = async (req, res) => {
    try {
        const {avatar} = req.body;
        const userId = req.session.user.user_id;
        const query = `UPDATE users SET profile_picture_url = ? WHERE user_id = ?`;
        await queryAsync(query, [avatar, userId]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    getUserInformation,
    getBookingInformation,
    editName,
    editDisplayName,
    editEmail,
    editPhoneNumber,
    editDateOfBirth,
    editAddress,
    editNationality,
    editGender,
    editAvatar
}