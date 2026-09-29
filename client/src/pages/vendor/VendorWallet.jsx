import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayouts, requestPayout } from '../../redux/slices/payoutsSlice';

const VendorWallet = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const dispatch = useDispatch();
  const { items: payouts, status, requestStatus, error: payoutError } = useSelector(state => state.payouts);
  
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn && status === 'idle') {
      getToken().then(token => dispatch(fetchPayouts(token)));
    }
  }, [isLoaded, isSignedIn, status, dispatch, getToken]);

  
  const handleDownloadReport = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reports/vendor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to download');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'My_Store_Analytics.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download report.');
    }
  };
  
  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setError('');
    const requestAmount = parseFloat(amount);
    
    if (isNaN(requestAmount) || requestAmount < 100) {
      return setError('Minimum payout request is ₹100.');
    }

    const token = await getToken();
    const res = await dispatch(requestPayout({ token, amount: requestAmount }));
    
    if (res.error) {
      setError(res.payload || 'Failed to request payout');
    } else {
      setAmount('');
      dispatch(fetchPayouts(token)); // Refresh history
    }
  };

  const [wallet, setWallet] = useState({
    totalSales: 0,
    commissionRate: 0.1,
    lifetimeEarnings: 0,
    totalPending: 0,
    totalCompleted: 0,
    availableBalance: 0
  });

  useEffect(() => {
    const fetchWallet = async () => {
      if (!isSignedIn) return;
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
      }
    };
    if (isLoaded && isSignedIn && status !== 'loading') {
      fetchWallet();
    }
  }, [isLoaded, isSignedIn, status, getToken, payouts]); // re-fetch when payouts change

  const totalPending = wallet.totalPending;
  const totalCompleted = wallet.totalCompleted;
  const availableBalance = wallet.availableBalance;

  if (status === 'loading') return <div className="text-gray-500 p-8">Loading wallet...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wallet & Earnings</h1>
        <button
          onClick={handleDownloadReport}
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Excel Report
        </button>
      </div>
  
      
      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#FF5A24] rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-white/80 font-medium text-sm">Available Balance</h3>
          <p className="text-4xl font-bold mt-2">₹{availableBalance.toFixed(2)}</p>
          <p className="text-white/70 text-xs mt-2">Ready to withdraw</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-500 font-medium text-sm">Total Withdrawn</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">₹{totalCompleted.toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-2">Successfully transferred</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-gray-500 font-medium text-sm">Pending Withdrawals</h3>
          <p className="text-2xl font-bold text-amber-500 mt-2">₹{totalPending.toFixed(2)}</p>
          <p className="text-gray-400 text-xs mt-2">Currently processing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Payout Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Request Payout</h3>
          <form onSubmit={handleRequestPayout}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Minimum ₹100)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#FF5A24] focus:border-[#FF5A24] sm:text-sm border p-2.5 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {payoutError && <p className="text-red-500 text-sm mb-4">{payoutError}</p>}
            <button
              type="submit"
              disabled={requestStatus === 'loading' || availableBalance < 100}
              className="cursor-pointer w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF5A24] hover:bg-[#E5481B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A24] disabled:opacity-50"
            >
              {requestStatus === 'loading' ? 'Processing...' : 'Withdraw Funds'}
            </button>
            {availableBalance < 100 && (
              <p className="text-xs text-gray-500 mt-2 text-center">You need at least ₹100 available to request a payout.</p>
            )}
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
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500 text-sm">No payout requests yet.</td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payout.requested_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{parseFloat(payout.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payout.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
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
