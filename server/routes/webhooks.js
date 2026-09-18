const express = require('express');
const router = express.Router();
const { stripeWebhook } = require('../controllers/webhookController');

// Stripe requires the raw body to construct the event
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
