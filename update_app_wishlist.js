const fs = require('fs');
let c = fs.readFileSync('client/src/App.jsx', 'utf8');

if (!c.includes('import Wishlist')) {
  c = c.replace(
    "import CustomerOrders from './pages/customer/CustomerOrders';",
    "import CustomerOrders from './pages/customer/CustomerOrders';\nimport Wishlist from './pages/customer/Wishlist';"
  );
  
  c = c.replace(
    '<Route path="/become-vendor" element={<BecomeVendor />} />',
    '<Route path="/become-vendor" element={<BecomeVendor />} />\n                <Route path="/wishlist" element={<Wishlist />} />'
  );
  
  fs.writeFileSync('client/src/App.jsx', c);
  console.log('App.jsx updated with wishlist route');
}
