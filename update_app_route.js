const fs = require('fs');
let c = fs.readFileSync('client/src/App.jsx', 'utf8');

c = c.replace(
  "import Checkout from './pages/public/Checkout';",
  "import Checkout from './pages/public/Checkout';\nimport Success from './pages/public/Success';"
);

c = c.replace(
  '<Route path="/checkout" element={',
  `<Route path="/success/:transactionId" element={<Success />} />
                <Route path="/checkout" element={`
);

fs.writeFileSync('client/src/App.jsx', c);
console.log('App.jsx updated with Success route');
