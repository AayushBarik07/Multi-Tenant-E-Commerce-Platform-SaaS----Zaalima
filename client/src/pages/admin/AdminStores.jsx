import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const AdminStores = () => {
  const { getToken } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stores`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStores(data.stores);
        }
      } catch (error) {
        console.error('Failed to fetch stores', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [getToken]);

  if (loading) return <div className="text-slate-400">Loading stores...</div>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-100 mb-6">Global Stores</h2>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Store Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Owner Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No stores found.</td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-semibold">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{store.owner_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400 font-bold">{store.product_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-bold">${parseFloat(store.total_revenue).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(store.created_at).toLocaleDateString()}</td>
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

export default AdminStores;
