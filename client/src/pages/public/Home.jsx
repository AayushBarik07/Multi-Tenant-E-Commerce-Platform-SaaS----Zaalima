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

  if (loading) return <div className="text-center py-20">Loading stores...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-indigo-600">Zaalima</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover unique products from independent vendors.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stores</h2>
        {stores.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No stores available right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {stores.map((store) => (
              <Link key={store.id} to={`/store/${store.id}`} className="group block">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 shadow-sm group-hover:shadow-md transition-shadow">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={store.name}
                      className="w-full h-48 object-cover object-center group-hover:opacity-75"
                    />
                  ) : (
                    <div className="w-full h-48 bg-indigo-100 flex items-center justify-center text-indigo-300 font-bold text-2xl">
                      {store.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{store.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{store.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
