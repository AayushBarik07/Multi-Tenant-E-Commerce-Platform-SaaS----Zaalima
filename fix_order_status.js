const fs = require('fs');
let c = fs.readFileSync('server/controllers/reportController.js', 'utf8');

c = c.replace(/o\.order_order_status as "Shipping Status"/g, 'o.order_status as "Shipping Status"');

fs.writeFileSync('server/controllers/reportController.js', c);
console.log('Fixed o.order_order_status column reference');
