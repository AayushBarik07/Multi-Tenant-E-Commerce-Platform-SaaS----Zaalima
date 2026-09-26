const fs = require('fs');
let c = fs.readFileSync('client/src/components/Header.jsx', 'utf8');

// Add isStaff variable
if (!c.includes('const isStaff')) {
  c = c.replace(
    'const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));',
    'const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));\n  const isStaff = dbUser && (dbUser.role === \'SUPER_ADMIN\' || dbUser.role === \'VENDOR\');'
  );
}

// Wrap Wishlist and Cart icons
const oldWishlist = `<Link to="/wishlist" className="text-gray-800 hover:text-[#FF5A24] transition-colors hidden sm:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </Link>`;

const newWishlist = `{!isStaff && (
            <Link to="/wishlist" className="text-gray-800 hover:text-[#FF5A24] transition-colors hidden sm:block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </Link>
          )}`;

c = c.replace(oldWishlist, newWishlist);

const oldCart = `{(!dbUser || dbUser.role !== 'SUPER_ADMIN') && (
            <button 
              onClick={() => dispatch(toggleCart())}
              className="text-gray-800 hover:text-[#FF5A24] transition-colors relative cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF5A24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}`;

const newCart = `{!isStaff && (
            <button 
              onClick={() => dispatch(toggleCart())}
              className="text-gray-800 hover:text-[#FF5A24] transition-colors relative cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF5A24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}`;

c = c.replace(oldCart, newCart);

fs.writeFileSync('client/src/components/Header.jsx', c);
console.log('Header.jsx updated to hide icons for staff');
