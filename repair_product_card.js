const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductCard.jsx', 'utf8');

// Fix the wishlist button block
const badWishlistStart = "{!isStaff && (\n        {!isStaff && (\n          <button \n          onClick={handleWishlistToggle}";
const goodWishlistStart = "{!isStaff && (\n          <button \n            onClick={handleWishlistToggle}";
c = c.replace(badWishlistStart, goodWishlistStart);

// Let's just use string slicing or full regex to clean up the whole mess.
// Actually, it's safer to just rewrite the render block from the bottom half.
const renderBlockStart = "  return (\n    <div className=\"group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100/50\">";

const newRenderBlock = `  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100/50">
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#F8F9FA] overflow-hidden p-6 flex items-center justify-center">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
          {isNew && (
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {product.price > 50 && (
            <span className="bg-[#FF5A24] text-white text-[10px] font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {!isStaff && (
          <button 
            onClick={handleWishlistToggle}
            className={\`cursor-pointer absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm transition-colors \${isWishlisted ? 'text-[#FF5A24]' : 'text-gray-400 hover:text-[#FF5A24]'}\`}
          >
            <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>
        )}

        <Link to={\`/product/\${product.id}\`} className="cursor-pointer w-full h-full flex items-center justify-center">
          <img 
            src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <Link to={\`/product/\${product.id}\`}>
          <h3 className="text-[15px] font-semibold text-gray-900 truncate hover:text-[#FF5A24] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Store Name / Subtitle */}
        <p className="text-xs text-gray-500 mt-1 mb-2 truncate">{product.store_name || product.category || 'Premium Brand'}</p>

        {/* Price & Cart Container */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <div className="flex text-[#FFC107]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">({reviewCount})</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">\${parseFloat(product.price).toFixed(2)}</span>
              {product.price > 50 && (
                <span className="text-xs text-gray-400 line-through">\${(parseFloat(product.price) * (1 + (discount/100))).toFixed(2)}</span>
              )}
            </div>
          </div>

          {!isStaff && (
            <button 
              onClick={handleAddToCart}
              className="cursor-pointer w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-[#FF5A24] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A24]/30 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;`;

c = c.substring(0, c.indexOf(renderBlockStart)) + newRenderBlock;

fs.writeFileSync('client/src/components/ProductCard.jsx', c);
console.log('ProductCard completely fixed syntax error');
