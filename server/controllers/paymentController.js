const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getAuth } = require('@clerk/express');
const db = require('../utils/db');

// @desc    Create a Stripe Payment Intent for checkout
// @route   POST /api/payments/create-intent
const createPaymentIntent = async (req, res) => {
  const { items } = req.body;
  const { userId } = getAuth(req); // Usually require auth for checkout

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  try {
    let totalAmount = 0;
    
    // In a real production app, ALWAYS verify prices against the database 
    // to prevent malicious frontend price tampering!
    for (const item of items) {
      const { product, variant, quantity } = item;
      
      const price = parseFloat(product.price) + (variant ? parseFloat(variant.price_adjustment) : 0);
      totalAmount += price * quantity;
    }

    // Stripe expects amount in cents
    const amountInCents = Math.round(totalAmount * 100);

    // Get DB user id
    const userResult = await db.query('SELECT id FROM users WHERE clerk_user_id = $1', [userId]);
    const dbUserId = userResult.rows[0].id;
    
    // We assume all items in cart belong to one store for MVP.
    const storeId = items[0].product.store_id;

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clerk_user_id: userId
      }
    });

    // Create PENDING order
    const orderResult = await db.query(
      'INSERT INTO orders (customer_user_id, store_id, total_amount, payment_status, order_status, payment_provider, payment_reference) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [dbUserId, storeId, totalAmount, 'PENDING', 'PENDING', 'STRIPE', paymentIntent.id]
    );
    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of items) {
      const { product, variant, quantity } = item;
      const price = parseFloat(product.price) + (variant ? parseFloat(variant.price_adjustment) : 0);
      const subtotal = price * quantity;
      
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [orderId, product.id, quantity, price, subtotal]
      );
    }

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Server error processing payment' });
  }
};

module.exports = {
  createPaymentIntent
};
