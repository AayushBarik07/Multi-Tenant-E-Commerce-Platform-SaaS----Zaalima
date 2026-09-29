const fs = require('fs');
let c = fs.readFileSync('server/controllers/reportController.js', 'utf8');

c = c.replace(/shipping_status as "Shipping Status"/g, 'status as "Shipping Status"');

fs.writeFileSync('server/controllers/reportController.js', c);
console.log('Fixed shipping_status again globally in file');
