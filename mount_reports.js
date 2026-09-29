const fs = require('fs');
let c = fs.readFileSync('server/index.js', 'utf8');

if (!c.includes('/api/reports')) {
  c = c.replace(
    "app.use('/api/payouts', require('./routes/payouts'));",
    "app.use('/api/payouts', require('./routes/payouts'));\napp.use('/api/reports', require('./routes/reports'));"
  );
  fs.writeFileSync('server/index.js', c);
  console.log('Mounted /api/reports');
}
