require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

/************************************************* Create connect account *************************************************/
const checkAccountExist = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    // check if user already has an account
    const checkQuery = `SELECT * FROM users WHERE user_id = ? AND user_role = ?`;
    const user = await queryAsync(checkQuery, [userId, "partner"]);
    console.log("connect_account_id1:", user[0].connect_account_id);

    if (user.length > 0 && user[0].connect_account_id) {
      return res.status(200).json({
        exist: true,
        connectedAccountId: user[0].connect_account_id,
      });
    } else {
      return res.status(200).json({ exist: false });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createAccountLink = async (req, res) => {
  try {
    const { connectedAccountId } = req.body;

    if (!connectedAccountId) {
      return res
        .status(400)
        .json({ error: "Missing connectedAccountId in the request body." });
    }

    const accountLink = await stripe.accountLinks.create({
      account: connectedAccountId,
      return_url: `http://localhost:5173/return/${connectedAccountId}`,
      refresh_url: `http://localhost:5173/refresh/${connectedAccountId}`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
};

const createAccount = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.session.user.user_id;

    const account = await stripe.accounts.create({
      email,
      controller: {
        fees: {
          payer: "application",
        },
        losses: {
          payments: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    });

    // store account id into database
    const query = `UPDATE users SET connect_account_id = ? WHERE user_id = ? AND user_role = ?`;
    await queryAsync(query, [account.id, userId, "partner"]);
    console.log("account.id:", account.id);

    res.json({ connectedAccountId: account.id });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
};

/************************************************* payout *************************************************/
const getInvoices = async (req, res) => {
  try {
    const { hotelId } = req.body;
<<<<<<< HEAD
=======

>>>>>>> a7f734b10c153bc23c7f591ef43f9872eaaf9032
    // Cập nhật trạng thái hóa đơn
    try {
      const updateQuery = `
        UPDATE invoices i
  JOIN bookings b ON i.booking_code = b.booking_code
    SET 
   i.status = CASE
    WHEN b.check_in_date <= CURDATE() AND i.status != 'available' THEN 'available'
    ELSE i.status
    END,
  i.updated_at = NOW()
    WHERE 
  i.hotel_id = ?;`;

      await queryAsync(updateQuery, [hotelId]);
    } catch (error) {
      console.error("Error updating invoices:", error);
      res.status(500).send({ error: "Failed to update invoices." });
      return;
    }

    // Truy vấn danh sách hóa đơn
    try {
      const selectQuery = `
        SELECT *
        FROM invoices i
        WHERE i.hotel_id = ?;
      `;
      // Bỏ destructuring, sử dụng trực tiếp kết quả
      const invoices = await queryAsync(selectQuery, [hotelId]);

      res.status(200).send({
        message: "Invoices retrieved successfully.",
        invoices,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).send({ error: "Failed to fetch invoices." });
    }
  } catch (error) {
    console.error("An error occurred when processing the request:", error);
    res.status(500).send({ error: error.message });
  }
};
const createPayout = async (req, res) => {
  try {
    const { amount, transaction_id } = req.body;
   const userId = req.session.user.user_id;
    //const userId = 25;

    // get user
    const userQuery = `SELECT * FROM users WHERE user_id = ?`;
    const user = await queryAsync(userQuery, [userId]);

    if (!user[0]?.connect_account_id) {
      return res.status(400).json({ error: "No Stripe account linked." });
    }

    const payout = await stripe.payouts.create({
      amount: amount * 100, // Convert to cents
      currency: "SGD", // TODO: change to user currency
      destination: user.connect_account_id,
      metadata: { transaction_id: transaction_id },
    });
    res.json({ success: true, message: "Payout created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAccount,
  createPayout,
  createAccountLink,
  checkAccountExist,
  getInvoices,
};
