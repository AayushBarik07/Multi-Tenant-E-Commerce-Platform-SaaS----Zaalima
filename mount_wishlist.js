const fs = require('fs');
let c = fs.readFileSync('server/index.js', 'utf8');

if (!c.includes('/api/wishlist')) {
  c = c.replace(
    "app.use('/api/orders', require('./routes/orders'));",
    "app.use('/api/orders', require('./routes/orders'));\napp.use('/api/wishlist', require('./routes/wishlist'));"
  );
  fs.writeFileSync('server/index.js', c);
}
console.log('Wishlist route added to index.js');
