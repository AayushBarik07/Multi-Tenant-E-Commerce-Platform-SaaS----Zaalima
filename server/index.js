require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Webhook routes MUST be mounted before express.json() so they can parse raw bodies
app.use('/api/webhooks', require('./routes/webhooks'));

app.use(express.json());

// Clerk Authentication Middleware
// This will add the `auth` object to the request if the user is signed in.
app.use(clerkMiddleware());

// Public Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EComVerse API is running' });
});

const { errorHandler, notFound } = require('./middleware/errorHandler');

// Setup basic routes mapping (to be expanded)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/products', require('./routes/products'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payouts', require('./routes/payouts'));

// Fallback for 404 Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
