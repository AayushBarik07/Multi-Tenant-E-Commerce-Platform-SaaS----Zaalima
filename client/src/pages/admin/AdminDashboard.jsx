import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { getToken } = useAuth();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    platformRevenue: 0,
    totalOrders: 0,
    recentStores: [],
    revenueChartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        console.log('Admin Stats Response:', data);

        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          console.error('Failed to load stats, server returned:', data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [getToken]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="text-slate-100">
      <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        Super Admin Command Center
      </h2>
      
      {/* Top Stats Cards - Dark Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 p-6 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-purple-500/20 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
          <h3 className="text-purple-300 text-sm font-semibold uppercase tracking-wider flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Platform Revenue
          </h3>
          <p className="text-4xl font-black text-white mt-3">${stats.platformRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-emerald-500/10 w-24 h-24 rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Global Orders</h3>
          <p className="text-4xl font-black text-white mt-3">{stats.totalOrders}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-blue-500/10 w-24 h-24 rounded-full group-hover:bg-blue-500/20 transition-all"></div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Stores</h3>
          <p className="text-4xl font-black text-white mt-3">{stats.totalStores}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-indigo-500/10 w-24 h-24 rounded-full group-hover:bg-indigo-500/20 transition-all"></div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Registered Users</h3>
          <p className="text-4xl font-black text-white mt-3">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart - Dark Theme */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            Platform Revenue Trajectory (7 Days)
          </h3>
          <div className="h-72">
            {stats.revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.revenueChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
                    itemStyle={{ color: '#c084fc' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={4} dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 8, fill: '#c084fc' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">Not enough data to display chart</div>
            )}
          </div>
        </div>

        {/* Recent Stores List - Dark Theme */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg flex flex-col h-full">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Newly Registered Stores
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {stats.recentStores.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm py-10">No recent stores.</div>
            ) : (
              <ul className="space-y-4">
                {stats.recentStores.map((store) => (
                  <li key={store.id} className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-200">{store.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(store.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      Active
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Global Orders Monitor */}
      <div className="mt-8 bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          Global Transactions Monitor
        </h3>
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
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
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
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
