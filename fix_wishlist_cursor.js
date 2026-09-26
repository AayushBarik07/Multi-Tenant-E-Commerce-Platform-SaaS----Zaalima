const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductCard.jsx', 'utf8');

// The dynamic className on the wishlist button
const oldDynamicClass = "className={`absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors ${isWishlisted ? 'text-[#FF5A24]' : 'text-gray-400 hover:text-[#FF5A24]'}`}";
const newDynamicClass = "className={`cursor-pointer absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors ${isWishlisted ? 'text-[#FF5A24]' : 'text-gray-400 hover:text-[#FF5A24]'}`}";

c = c.replace(oldDynamicClass, newDynamicClass);

fs.writeFileSync('client/src/components/ProductCard.jsx', c);
console.log('ProductCard wishlist button updated with cursor-pointer');
