require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);


const handleRefund = async (req, res) => {
    const { chargeId, amount } = req.body;

    if (!chargeId) {
        return res.status(400).json({ message: 'Charge ID is required' });
    }

    try {
        const refund = await stripe.refunds.create({
            charge: chargeId,
            amount: amount,
        });
        console.log('Refund successful:', refund);
        return res.status(200).json({
            message: 'Refund successful',
            refund,
        });
    } catch (error) {
        console.error('Refund failed:', error);
        return res.status(500).json({
            message: 'Refund failed',
            error: error.message,
        });
    }
};

module.exports = {
    handleRefund
};