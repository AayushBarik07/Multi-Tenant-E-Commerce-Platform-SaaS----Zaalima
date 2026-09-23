import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const AdminProducts = () => {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No products found.</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
