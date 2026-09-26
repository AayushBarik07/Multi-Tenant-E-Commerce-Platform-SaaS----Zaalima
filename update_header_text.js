const fs = require('fs');
let c = fs.readFileSync('client/src/components/Header.jsx', 'utf8');

c = c.replace(
  "{dbUser?.role === 'SUPER_ADMIN' ? 'Admin' : dbUser?.role === 'VENDOR' ? 'Vendor' : 'Account'}",
  "'Dashboard'"
);

fs.writeFileSync('client/src/components/Header.jsx', c);
console.log('Header text updated to Dashboard');
