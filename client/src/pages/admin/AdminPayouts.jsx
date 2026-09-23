import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const AdminPayouts = () => {
  const { getToken } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payouts/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayouts(data.payouts);
      }
    } catch (err) {
      console.error('Failed to fetch payouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payouts/admin/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchPayouts(); // Refresh list
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="text-slate-400">Loading payout requests...</div>;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-100 mb-6">Vendor Payout Requests</h2>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 bg-slate-900/20">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No payout requests found.</td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(p.requested_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-200">{p.store_name}</div>
                      <div className="text-xs text-slate-400">{p.owner_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-400">
                      ${parseFloat(p.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        p.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {p.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'PAID')}
                            disabled={processingId === p.id}
                            className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                          <span className="text-slate-600">|</span>
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'REJECTED')}
                            disabled={processingId === p.id}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {p.status === 'PAID' && (
                        <span className="text-slate-500 text-xs">Paid on {new Date(p.paid_at).toLocaleDateString()}</span>
                      )}
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

export default AdminPayouts;
