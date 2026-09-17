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
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group block">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 shadow-sm group-hover:shadow-md transition-shadow relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover object-center group-hover:opacity-75"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    OUT OF STOCK
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 font-medium">{product.name}</h3>
                </div>
                <p className="text-sm font-bold text-gray-900">${parseFloat(product.price).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Storefront;
