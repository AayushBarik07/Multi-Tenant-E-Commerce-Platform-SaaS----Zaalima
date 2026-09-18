require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { clerkMiddleware, requireAuth } = require('@clerk/express');

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
  res.json({ status: 'OK', message: 'Zaalima API is running' });
});

// Protected Route Example
app.get('/api/protected', requireAuth(), (req, res) => {
  // Access the user ID from the Clerk auth object
  const { getAuth } = require('@clerk/express');
  const { userId } = getAuth(req);
  res.json({ 
    message: 'This is a protected route',
    userId 
  });
});

// Setup basic routes mapping (to be expanded)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/products', require('./routes/products'));
app.use('/api/payments', require('./routes/payments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
