import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const VendorWallet = () => {
  const { getToken } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payouts/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);
      }
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setError('');
    const requestAmount = parseFloat(amount);
    
    if (isNaN(requestAmount) || requestAmount <= 0) {
      return setError('Please enter a valid amount.');
    }
    
    if (requestAmount > wallet.availableBalance) {
      return setError('You cannot request more than your available balance.');
    }

    setRequesting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payouts/request`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ amount: requestAmount })
      });
      const data = await res.json();
      if (data.success) {
        setAmount('');
        fetchWallet(); // Refresh data
      } else {
        setError(data.error || 'Failed to request payout');
      }
    } catch (err) {
      setError('Server error.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="text-gray-500 p-8">Loading wallet...</div>;
  if (!wallet) return <div className="text-red-500 p-8">Failed to load wallet data. Make sure you have created a store.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Wallet & Earnings</h1>
      
      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-indigo-100 font-medium text-sm">Available Balance</h3>
          <p className="text-4xl font-bold mt-2">${parseFloat(wallet.availableBalance).toFixed(2)}</p>
          <p className="text-indigo-200 text-xs mt-2">Ready to withdraw</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-500 font-medium text-sm">Lifetime Earnings (After {wallet.commissionRate * 100}% Fee)</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">${parseFloat(wallet.lifetimeEarnings).toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-2">From ${parseFloat(wallet.totalSales).toFixed(2)} in total sales</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-500 font-medium text-sm">Pending Withdrawals</h3>
          <p className="text-2xl font-bold text-amber-500 mt-2">${parseFloat(wallet.totalPending).toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-2">Currently processing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Payout Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Request Payout</h3>
          <form onSubmit={handleRequestPayout}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2.5"
                  placeholder="0.00"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={requesting || wallet.availableBalance <= 0}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {requesting ? 'Processing...' : 'Withdraw Funds'}
            </button>
          </form>
        </div>

        {/* Payout History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payout History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {wallet.history.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500 text-sm">No payout requests yet.</td>
                  </tr>
                ) : (
                  wallet.history.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payout.requested_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${parseFloat(payout.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payout.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          payout.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payout.status}
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
    </div>
  );
};

export default VendorWallet;
