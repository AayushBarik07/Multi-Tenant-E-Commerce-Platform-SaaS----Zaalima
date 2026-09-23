import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector(state => state.auth.user);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/brands`);
        const data = await res.json();
        if (data.success) {
          setBrands(data.brands);
        }
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const slides = [
    {
      title: "The Ultimate Premium",
      highlight: "Brand Marketplace",
      description: "Discover exclusive collections, unique products, and curated brands from independent creators around the world.",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
    },
    {
      title: "Premium Tech &",
      highlight: "Electronics",
      description: "Shop the latest gadgets, custom builds, and accessories directly from verified tech brands.",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
    },
    {
      title: "Exclusive Designer",
      highlight: "Fashion",
      description: "Find rare streetwear, vintage classics, and custom apparel from exclusive independent brands.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
    },
    {
      title: "Handcrafted Home",
      highlight: "Decor",
      description: "Elevate your living space with beautiful, handcrafted furniture and art from global artisans.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full">
      {/* Hero Section Carousel */}
      <div className="relative bg-gray-900 overflow-hidden h-[600px]">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              className="w-full h-full object-cover"
              src={slide.image}
              alt={slide.highlight}
            />
            {/* Subtle overlay just to ensure text readability on super bright images */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div className={`transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'} max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 p-8 sm:p-12 rounded-3xl shadow-2xl`}>
                  <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                    {slide.title} <br className="hidden sm:block" />
                    <span className="text-indigo-300 drop-shadow-md">{slide.highlight}</span>
                  </h1>
                  <p className="mt-6 text-lg sm:text-xl text-gray-100 drop-shadow-md font-medium">
                    {slide.description}
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <a href="#stores" className="inline-flex justify-center items-center bg-indigo-600/90 backdrop-blur-sm border border-transparent rounded-full py-3.5 px-8 text-base font-bold text-white hover:bg-indigo-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                      Shop Now
                    </a>
                    {(!user || user.role === 'CUSTOMER') && (
                      <Link to="/become-vendor" className="inline-flex justify-center items-center bg-white/90 backdrop-blur-sm border border-transparent rounded-full py-3.5 px-8 text-base font-bold text-gray-900 hover:bg-white hover:scale-105 transition-all shadow-lg">
                        Want to be a seller?
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-indigo-500 w-8' : 'bg-gray-400 hover:bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Feature Banner */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center flex-wrap gap-8 text-white font-medium text-sm sm:text-base">
            <span className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Verified Sellers</span>
            <span className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Secure Payments</span>
            <span className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg> Multi-Vendor Checkout</span>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div id="brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-5">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Featured Brands & Collections</h2>
            <p className="mt-2 text-sm text-gray-500">Shop directly from independent brands across our marketplace.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
            {[1,2,3,4].map(n => (
              <div key={n} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>
            <div className="relative z-10">
              <div className="mx-auto h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No brand listed</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">Our marketplace is fresh and waiting for its first collection. Want to be a seller?</p>
              <Link to="/become-vendor" className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:scale-105 transition-all">
                Become a Seller
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map((brand) => (
              <Link key={brand.id} to={`/store/${brand.store_id}?brand=${brand.id}`} className="group relative block rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100 flex flex-col">
                <div className="w-full h-56 bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-300 font-bold text-4xl group-hover:scale-105 transition-transform duration-500 rounded-lg">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{brand.name}</h3>
                  {brand.store_name && (
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">By {brand.store_name}</p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                    {brand.description || "Premium collection from verified store."}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                    Explore Brand <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
