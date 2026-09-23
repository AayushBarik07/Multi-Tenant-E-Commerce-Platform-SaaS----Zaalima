import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const AdminOrders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [getToken]);

  if (loading) return <div className="text-slate-400">Loading transactions...</div>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-100 mb-6">All Global Transactions</h2>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">No transactions found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">{order.id.split('-')[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.customer_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-semibold">{order.store_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-bold">${parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.payment_status === 'SUCCESS' ? 'bg-emerald-100/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-100/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {order.payment_status}
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

export default AdminOrders;
