const fs = require('fs');
let c = fs.readFileSync('server/index.js', 'utf8');

if (!c.includes('/api/payouts')) {
  c = c.replace(
    "app.use('/api/wishlist', require('./routes/wishlist'));",
    "app.use('/api/wishlist', require('./routes/wishlist'));\napp.use('/api/payouts', require('./routes/payouts'));"
  );
  fs.writeFileSync('server/index.js', c);
  console.log('Mounted /api/payouts');
}
