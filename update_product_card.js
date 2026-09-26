const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductCard.jsx', 'utf8');

if (!c.includes('useDispatch')) {
  c = c.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link, useNavigate } from 'react-router-dom';\nimport { useDispatch, useSelector } from 'react-redux';\nimport { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';\nimport { useAuth } from '@clerk/clerk-react';\nimport { addToCart } from '../redux/slices/cartSlice';"
  );
}

// Replace the start of the component to add hooks
const hookInjection = `const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const wishlistIds = useSelector(state => state.wishlist.itemIds);
  const isWishlisted = wishlistIds.includes(product.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isSignedIn) return navigate('/sign-in');
    
    const token = await getToken();
    if (isWishlisted) {
      dispatch(removeFromWishlist({ token, productId: product.id }));
    } else {
      dispatch(addToWishlist({ token, productId: product.id }));
    }
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    }));
  };`;

c = c.replace("const ProductCard = ({ product }) => {", hookInjection);

// Replace the Wishlist Button JSX
const oldWishlistBtn = /<button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-\[#FF5A24\] transition-colors">[\s\S]*?<\/button>/;
const newWishlistBtn = `
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className={\`absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors \${isWishlisted ? 'text-[#FF5A24]' : 'text-gray-400 hover:text-[#FF5A24]'}\`}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>`;

c = c.replace(oldWishlistBtn, newWishlistBtn);

// Update Add to Cart button logic
const oldCartBtn = /<Link \s*to={`\/product\/\$\{product\.id\}`}\s*className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-\[#FF5A24\] hover:-translate-y-1 hover:shadow-lg hover:shadow-\[#FF5A24\]\/30 transition-all duration-300"\s*>[\s\S]*?<\/Link>/;
const newCartBtn = `<button 
            onClick={handleAddToCart}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-[#FF5A24] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A24]/30 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </button>`;

c = c.replace(oldCartBtn, newCartBtn);

fs.writeFileSync('client/src/components/ProductCard.jsx', c);
console.log('ProductCard updated with wishlist functionality.');
