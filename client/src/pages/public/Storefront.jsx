import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const Storefront = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeRes = await fetch(`${import.meta.env.VITE_API_URL}/stores/${storeId}`);
        const storeData = await storeRes.json();
        
        if (storeData.success && storeData.store) {
          setStore(storeData.store);
          
          const brandRes = await fetch(`${import.meta.env.VITE_API_URL}/brands?store_id=${storeId}`);
          const brandData = await brandRes.json();
          if (brandData.success) {
            setBrands(brandData.brands);
            
            // Check for ?brand= URL param
            const searchParams = new URLSearchParams(location.search);
            const brandIdParam = searchParams.get('brand');
            if (brandIdParam) {
              const matchedBrand = brandData.brands.find(b => b.id === brandIdParam);
              if (matchedBrand) {
                setSelectedBrand(matchedBrand);
              }
            }
          }

          const prodRes = await fetch(`${import.meta.env.VITE_API_URL}/products?store_id=${storeId}`);
          const prodData = await prodRes.json();
          if (prodData.success) {
            setProducts(prodData.products);
          }
        } else {
          setError('Store not found.');
        }
      } catch (err) {
        console.error('Failed to fetch store data', err);
        setError('Failed to load store.');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const filteredProducts = selectedBrand 
    ? products.filter(p => p.brand_id === selectedBrand.id)
    : products;

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!store) return <div className="text-center py-20">Store not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Store Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-10 border border-gray-100">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-6 py-6 sm:flex sm:items-center sm:justify-between relative">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0 relative -mt-16 sm:-mt-20">
              {store.logo_url ? (
                <img className="h-24 w-24 rounded-full ring-4 ring-white object-cover sm:h-32 sm:w-32" src={store.logo_url} alt={store.name} />
              ) : (
                <div className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32 bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 sm:pt-1 sm:text-left text-center">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{store.name}</h1>
              <p className="text-sm font-medium text-gray-500 mt-1 max-w-2xl">{store.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedBrand ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Brands & Collections</h2>
          </div>

          {brands.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>
              <div className="relative z-10">
                <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No product listed</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">This store hasn't uploaded any collections yet. Check back later!</p>
                <Link to="/" className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:scale-105 transition-all">
                  Go back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <div 
                  key={brand.id} 
                  onClick={() => setSelectedBrand(brand)}
                  className="cursor-pointer group relative block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  <div className="w-full h-48 bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      />
                    ) : (
                      <span className="text-5xl font-black text-gray-200">{brand.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
                    {brand.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{brand.description}</p>
                    )}
                    <span className="inline-block mt-4 text-sm font-bold text-indigo-600 group-hover:text-indigo-800">
                      View Collection &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setSelectedBrand(null)}
              className="mr-4 text-gray-500 hover:text-indigo-600 flex items-center text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Brands
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{selectedBrand.name} Collection</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No products found in this brand.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group relative block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
                  <div className="w-full h-64 bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col justify-between h-36">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">{selectedBrand.name}</h3>
                      <p className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{product.name}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xl font-extrabold text-indigo-600">${parseFloat(product.price).toFixed(2)}</p>
                      <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors">View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Storefront;
