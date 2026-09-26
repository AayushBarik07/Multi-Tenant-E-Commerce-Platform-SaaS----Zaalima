const fs = require('fs');
let c = fs.readFileSync('client/src/pages/public/ProductDetails.jsx', 'utf8');

c = c.replace(/bg-indigo-600/g, 'bg-[#FF5A24]');
c = c.replace(/text-indigo-600/g, 'text-[#FF5A24]');
c = c.replace(/hover:bg-indigo-700/g, 'hover:bg-[#E5481B]');
c = c.replace(/ring-indigo-500/g, 'ring-[#FF5A24]');
c = c.replace(/border-indigo-500/g, 'border-[#FF5A24]');
c = c.replace(/bg-indigo-50/g, 'bg-orange-50');

// Make the Add to cart button more prominent
c = c.replace(
  'className="flex-1 bg-indigo-600 border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-indigo-700 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"',
  'className="flex-1 bg-[#FF5A24] border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-lg font-bold text-white hover:bg-orange-600 hover:-translate-y-1 transition-all shadow-xl shadow-orange-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"'
);

fs.writeFileSync('client/src/pages/public/ProductDetails.jsx', c);
console.log('ProductDetails updated to new theme.');
