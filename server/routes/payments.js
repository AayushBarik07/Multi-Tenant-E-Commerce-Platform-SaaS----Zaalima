const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment } = require('../controllers/paymentController');
const { getAuth } = require('@clerk/express');

// Middleware to verify user is authenticated for checkout
const requireAuth = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'You must be logged in to checkout' });
  }
  next();
};

router.post('/create-intent', requireAuth, createPaymentIntent);
router.post('/confirm', requireAuth, confirmPayment);

module.exports = router;
