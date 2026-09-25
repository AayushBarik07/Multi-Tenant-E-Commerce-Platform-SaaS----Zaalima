const fs = require('fs');
let c = fs.readFileSync('client/src/pages/public/Checkout.jsx', 'utf8');

c = c.replace(
  'if (items.length === 0) {\n    return (', 
  `if (isAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Super Admins Cannot Shop</h2>
        <p className="text-gray-500 mb-8">Your account is restricted to read-only supervision.</p>
        <a href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
          Return Home
        </a>
      </div>
    );
  }

  if (items.length === 0) {
    return (`
);

fs.writeFileSync('client/src/pages/public/Checkout.jsx', c);
console.log('Checkout.jsx updated successfully');
