import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stores`);
        const data = await res.json();
        if (data.success) {
          setStores(data.stores);
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Sneaker background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-start">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-2xl">
            The Ultimate Sneaker <span className="text-indigo-400">Marketplace</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-xl">
            Discover rare drops, vintage classics, and custom kicks from the world's most exclusive independent sneaker boutiques.
          </p>
          <div className="mt-10 flex space-x-4">
            <a href="#stores" className="inline-block bg-indigo-600 border border-transparent rounded-full py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/30">
              Shop Now
            </a>
            <Link to="/become-vendor" className="inline-block bg-white border border-transparent rounded-full py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors shadow-lg">
              Sell with Us
            </Link>
          </div>
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

      {/* Stores Grid */}
      <div id="stores" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-5">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Featured Boutiques</h2>
            <p className="mt-2 text-sm text-gray-500">Shop directly from independent sneaker stores.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
            {[1,2,3,4].map(n => (
              <div key={n} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Stores Found</h3>
            <p className="mt-1 text-sm text-gray-500">Be the first to launch your sneaker boutique on Zaalima.</p>
            <div className="mt-6">
              <Link to="/become-vendor" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Open a Store
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
            {stores.map((store) => (
              <Link key={store.id} to={`/store/${store.id}`} className="group relative block rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100">
                <div className="w-full aspect-w-4 aspect-h-3 bg-gray-100 overflow-hidden">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={store.name}
                      className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-300 font-bold text-4xl group-hover:scale-105 transition-transform duration-500">
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {store.description || "Premium independent sneaker vendor."}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                    Visit Store <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
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
