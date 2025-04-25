require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Users, Invoices, Bookings } = require("../../models/init-models.js");
const { Sequelize, Op } = require("sequelize");

/************************************************* Create connect account *************************************************/
const checkAccountExist = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    // check if user already has an account
    const user = await Users.findOne({
      where: {
        user_id: userId,
        user_role: "partner",
      },
    });

    if (user && user.connect_account_id) {
      return res.status(200).json({
        exist: true,
        connectedAccountId: user.connect_account_id,
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
    await Users.update(
      {
        connect_account_id: account.id,
      },
      {
        where: {
          user_id: userId,
          user_role: "partner",
        },
      }
    );

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
    // Cập nhật trạng thái hóa đơn
    try {
      await Invoices.update(
        {
          status: Sequelize.literal(`CASE 
      WHEN b.check_in_date <= CURRENT_DATE() AND invoices.status NOT IN ('available', 'done') 
      THEN 'available' 
      ELSE invoices.status 
    END`),
          updated_at: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        {
          include: [
            {
              model: Bookings,
              as: "booking",
              required: true,
              attributes: [],
            },
          ],
          where: {
            hotel_id: hotelId,
          },
        }
      );
    } catch (error) {
      console.error("Error updating invoices:", error);
      res.status(500).send({ error: "Failed to update invoices." });
      return;
    }

    // Truy vấn danh sách hóa đơn
    try {
      // Bỏ destructuring, sử dụng trực tiếp kết quả
      const invoices = await Invoices.findAll({
        where: {
          hotel_id: hotelId,
        },
      });

      res.status(200).send({
        message: "Invoices retrieved successfully.",
        invoices: invoices,
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
    const { amount, transactionId, hotelId } = req.body;
    const userId = req.session.user.user_id;
    // chuyen sang sgd amount
    const exchangeRate = 18000; // 1 SGD = 18000 VND (tỷ giá giả định)
    const convertedAmount = Math.round(amount / exchangeRate); // Chuyển sang SGD

    if (convertedAmount < 1) {
      return res
        .status(400)
        .json({ error: "Minimum amount must be at least 1 SGD." });
    }
    const user = await Users.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!user && !user.connect_account_id) {
      return res.status(400).json({ error: "No Stripe account linked." });
    }

    await stripe.payouts.create({
      amount: convertedAmount * 100, // Convert to cents
      currency: "sgd", // TODO: change to user currency
      destination: user.connect_account_id,
      metadata: { transaction_id: transactionId, hotel_id: hotelId },
    });
    res.json({ success: true, message: "Withdraw money successfully" });
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
