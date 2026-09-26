const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductCard.jsx', 'utf8');

// The wishlist button starts with <button onClick={handleWishlistToggle} ... and ends with </button>
const wishlistRegex = /<button[\s\S]*?onClick=\{handleWishlistToggle\}[\s\S]*?<\/button>/;
const cartRegex = /<button[\s\S]*?onClick=\{handleAddToCart\}[\s\S]*?<\/button>/;

c = c.replace(wishlistRegex, (match) => {
  // Prevent double wrapping if already wrapped (just in case)
  if (match.startsWith('{!isStaff &&')) return match;
  return `{!isStaff && (\n        ${match}\n        )}`;
});

c = c.replace(cartRegex, (match) => {
  if (match.startsWith('{!isStaff &&')) return match;
  return `{!isStaff && (\n          ${match}\n          )}`;
});

// Also remove duplicate {/* Wishlist Button */} comments that accidentally got created earlier
c = c.replace(/\{\/\* Wishlist Button \*\/\}\s*\{\/\* Wishlist Button \*\/\}/g, '{/* Wishlist Button */}');

fs.writeFileSync('client/src/components/ProductCard.jsx', c);
console.log('ProductCard completely fixed to hide buttons for staff');
