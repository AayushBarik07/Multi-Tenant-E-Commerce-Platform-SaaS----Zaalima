import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const AdminProducts = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [getToken]);

  if (loading) return <div className="text-slate-400">Loading catalog...</div>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-100 mb-6">Global Product Catalog</h2>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-semibold">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400">{product.store_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-bold">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => setSelectedImage({ url: product.image_url, name: product.name })}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        View Image
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal Popup */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-lg font-bold text-slate-200 mb-4 pr-8">{selectedImage.name}</h3>
            <div className="bg-slate-800 rounded-lg flex items-center justify-center h-96 overflow-hidden">
              {selectedImage.url ? (
                <img src={selectedImage.url} alt={selectedImage.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-slate-500 flex flex-col items-center">
                  <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
