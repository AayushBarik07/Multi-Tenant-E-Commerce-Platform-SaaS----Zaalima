const fs = require('fs');
let c = fs.readFileSync('server/controllers/payoutController.js', 'utf8');

c = c.replace(
  "console.error('Error fetching payouts:', error);",
  "console.error('Error fetching payouts:', error);\n    require('fs').appendFileSync('payout_error.log', new Date().toISOString() + ' ' + error.stack + '\\n');"
);

fs.writeFileSync('server/controllers/payoutController.js', c);
console.log('Added error logging to getPayouts');
