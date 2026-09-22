import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Storefront = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      try {
        // Fetch Store Details
        const storeRes = await fetch(`${import.meta.env.VITE_API_URL}/stores/${storeId}`);
        const storeData = await storeRes.json();
        
        if (storeData.success && storeData.store) {
          setStore(storeData.store);
          
          // Fetch Products for this store
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

    fetchStoreAndProducts();
  }, [storeId]);

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

      {/* Products Grid */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
      
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-white rounded-lg border border-gray-100 shadow-sm">
          This store has no active products at the moment.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group relative block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity duration-300"></div>
              </div>
              <div className="p-5 flex flex-col justify-between h-36">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">{store.name}</h3>
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
    </div>
  );
};

export default Storefront;
