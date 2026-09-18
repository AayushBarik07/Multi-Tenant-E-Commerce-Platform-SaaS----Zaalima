const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../utils/db');

const { sendOrderConfirmationEmail } = require('../utils/email');

// @desc    Handle Stripe Webhooks for payment success/failure
// @route   POST /api/webhooks/stripe
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      
      // Update Order Status in Database
      try {
        await db.query(
          "UPDATE orders SET payment_status = 'SUCCESS', order_status = 'CONFIRMED' WHERE payment_reference = $1",
          [paymentIntent.id]
        );
        console.log(`Order for payment ${paymentIntent.id} confirmed in DB.`);
      } catch (dbErr) {
        console.error('Error updating order status:', dbErr);
      }
      
      const clerkUserId = paymentIntent.metadata.clerk_user_id;
      
      try {
        // Fetch user's email from the database
        const userResult = await db.query('SELECT email FROM users WHERE clerk_user_id = $1', [clerkUserId]);
        if (userResult.rows.length > 0) {
          const userEmail = userResult.rows[0].email;
          // Send the confirmation email!
          await sendOrderConfirmationEmail(userEmail, paymentIntent.amount);
        }
      } catch (dbErr) {
        console.error('Error fetching user email for receipt:', dbErr);
      }
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.last_payment_error?.message);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

module.exports = {
  stripeWebhook
};
