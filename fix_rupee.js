const fs = require('fs');
let c = fs.readFileSync('client/src/pages/admin/AdminPayouts.jsx', 'utf8');

c = c.replace(/₹/g, '₹');
c = c.replace(/,1/g, '₹');

fs.writeFileSync('client/src/pages/admin/AdminPayouts.jsx', c);
console.log('Fixed rupee symbol encoding in AdminPayouts');
