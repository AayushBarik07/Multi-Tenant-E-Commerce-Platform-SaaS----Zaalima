const fs = require('fs');
let c = fs.readFileSync('server/index.js', 'utf8');
if (!c.includes('/api/orders')) {
  c = c.replace(
    "app.use('/api/payments', require('./routes/payments'));",
    "app.use('/api/payments', require('./routes/payments'));\napp.use('/api/orders', require('./routes/orders'));"
  );
  fs.writeFileSync('server/index.js', c);
}
