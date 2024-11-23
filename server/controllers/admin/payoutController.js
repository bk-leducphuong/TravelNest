require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connection = require("../../config/db");
const { promisify } = require("util");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

const checkAccountExist = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    // check if user already has an account
    const checkQuery = `SELECT * FROM users WHERE user_id = ? AND user_role = ?`;
    const user = await queryAsync(checkQuery, [userId, 'partner']);
    console.log("connect_account_id1:", user[0].connect_account_id );

    if (user.length > 0 && user[0].connect_account_id) {
      return res.status(200).json({ 
        exist: true, 
        connectedAccountId: user[0].connect_account_id 
      });
    
    }else {
      return res.status(200).json({ exist: false });
      
    } 
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const createAccountLink = async (req, res) => {
  try {
    const { connectedAccountId } = req.body;
    //console.log("connectedAccountId2:", connectedAccountId);
    //const connectedAccountId = "acct_1QNm10BUqmWWAR32";

    if (!connectedAccountId) {
      return res.status(400).json({ error: "Missing connectedAccountId in the request body." });
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
    await queryAsync(query, [account.id, userId, 'partner']);
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

const createPayout = async (req, res) => {
  try {
    const { amount } = req.body;
   // const userId = req.session.user.user_id;
    const userId = 25;

    // get user
    const userQuery = `SELECT * FROM users WHERE user_id = ?`;
    const user = await queryAsync(userQuery, [userId]);
    //console.log("user_connet: ",user[0]?.connect_account_id);
    
    if (!user[0]?.connect_account_id) {
      return res.status(400).json({ error: "No Stripe account linked." });
    }

    const payout = await stripe.payouts.create({
      amount: amount * 100, // Convert to cents
      currency: "SGD", // TODO: change to user currency
      destination: user.connect_account_id,
    });

    const cashoutQuery = `
      INSERT INTO cashouts (user_id, amount, currency, status, requested_at, payout_id)
      VALUES (?, ?, ?, ?, NOW(), ?)
    `;
    await queryAsync(cashoutQuery, [
      userId,
      payout.amount / 100, // Convert back to original amount
      payout.currency.toUpperCase(),
      'pending', // Initial status is 'pending'
      payout.id,
    ]);
    const transactionQuery = `
    INSERT INTO transactions ( seller_id, amount, currency, status, transaction_type, payment_intent_id, created_at)
    VALUES ( ?, ?, ?, ?, ?, ?, NOW())
  `;
  await queryAsync(transactionQuery, [
   // Assuming the payout is made to the user, so they are both buyer and seller
   userId, // người bán là người rút tiền của hệ thống
    payout.amount / 100, // Convert back to original amount
    payout.currency.toUpperCase(),
    'pending', // Set the status of the transaction
    'payout', // If it's a payout refund, for example
    payout.id, // Use the payout balance transaction ID
  ]);

    res.json({ success: true, message: 'Payout created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAccount,
  createPayout,
  createAccountLink,
  checkAccountExist
};
