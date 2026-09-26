const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductCard.jsx', 'utf8');

if (!c.includes('const dbUser = useSelector')) {
  c = c.replace(
    'const { getToken, isSignedIn } = useAuth();',
    'const { getToken, isSignedIn } = useAuth();\n  const dbUser = useSelector(state => state.auth.user);\n  const isStaff = dbUser && (dbUser.role === \'SUPER_ADMIN\' || dbUser.role === \'VENDOR\');'
  );
}

// Wrap wishlist button
const oldWishlist = `<button 
            onClick={handleWishlistToggle}
            className={\`cursor-pointer absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors \${isWishlisted ? 'text-[#FF5A24]' : 'text-gray-400 hover:text-[#FF5A24]'}\`}
          >
            <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>`;

const newWishlist = `{!isStaff && (
          <button 
            onClick={handleWishlistToggle}
            className={\`cursor-pointer absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors \${isWishlisted ? 'text-[#FF5A24]' : 'text-gray-400 hover:text-[#FF5A24]'}\`}
          >
            <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>
        )}`;

if (c.includes(oldWishlist)) {
  c = c.replace(oldWishlist, newWishlist);
}

// Wrap Cart button
const oldCart = `<button 
              onClick={handleAddToCart}
              className="cursor-pointer w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-[#FF5A24] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A24]/30 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </button>`;

const newCart = `{!isStaff && (
            <button 
              onClick={handleAddToCart}
              className="cursor-pointer w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-[#FF5A24] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A24]/30 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </button>
          )}`;

if (c.includes(oldCart)) {
  c = c.replace(oldCart, newCart);
}

fs.writeFileSync('client/src/components/ProductCard.jsx', c);
console.log('ProductCard.jsx updated to hide icons for staff');
