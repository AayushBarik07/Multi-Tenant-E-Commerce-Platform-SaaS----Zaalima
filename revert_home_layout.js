const fs = require('fs');
let c = fs.readFileSync('client/src/pages/public/Home.jsx', 'utf8');

// Replace the Categories, New Arrivals, and Best Sellers sections with a single "All Products" section.

const oldMiddleSectionRegex = /\/\/ Extract unique categories[\s\S]*?\{\/\* Promo Banners \*\/\}/;

const newMiddleSection = `// Centralized Products Array
  const allProducts = products;

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <span className="text-[#FF5A24] font-bold tracking-wider text-sm uppercase mb-4 block">Trending Now</span>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
              Discover Products <br /> You'll Love
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
              Shop the latest trending products curated for modern lifestyles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#all-products" className="bg-[#FF5A24] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center">
                Shop Now <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </a>
              <Link to="/become-vendor" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                Become a Seller
              </Link>
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
            {/* Abstract Background Elements simulating the 3D red chair from reference */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-[#FF5A24] to-purple-400 blur-3xl rounded-full scale-150 transform translate-x-20 translate-y-20"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop" 
              alt="Fashion Model" 
              className="absolute h-full object-cover object-center z-10 drop-shadow-2xl"
            />
            
            {/* Floating Product Cards */}
            <div className="absolute top-12 left-12 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl z-20 flex flex-col items-center animate-bounce" style={{animationDuration: '3s'}}>
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" className="w-16 h-16 object-cover rounded-lg mb-2" alt="Shoe" />
              <p className="text-[10px] font-bold text-gray-900">Air Max 270</p>
              <p className="text-[10px] text-gray-500">$129.99</p>
            </div>

            <div className="absolute bottom-20 right-12 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl z-20 flex flex-col items-center animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" className="w-16 h-16 object-cover rounded-lg mb-2" alt="Headphones" />
              <p className="text-[10px] font-bold text-gray-900">Headphones</p>
              <p className="text-[10px] text-gray-500">$99.99</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Banner */}
      <div className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-4">
              <svg className="w-8 h-8 text-gray-900 mb-3 md:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              <div>
                <h4 className="font-bold text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-4">
              <svg className="w-8 h-8 text-gray-900 mb-3 md:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <div>
                <h4 className="font-bold text-gray-900">Secure Payments</h4>
                <p className="text-sm text-gray-500">100% secure checkout</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-4">
              <svg className="w-8 h-8 text-gray-900 mb-3 md:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path></svg>
              <div>
                <h4 className="font-bold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-500">30-day return policy</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-4">
              <svg className="w-8 h-8 text-gray-900 mb-3 md:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <h4 className="font-bold text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-500">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centralized All Products Section */}
      <div id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Products</h2>
            <p className="mt-2 text-sm text-gray-500">Shop all available items from our verified vendors.</p>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
            {[1,2,3,4,5,6,7,8,9,10].map(n => <div key={n} className="bg-gray-100 h-80 rounded-2xl"></div>)}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Promo Banners */}`;

c = c.replace(oldMiddleSectionRegex, newMiddleSection);

fs.writeFileSync('client/src/pages/public/Home.jsx', c);
console.log('Home.jsx reverted to centralized products layout.');
