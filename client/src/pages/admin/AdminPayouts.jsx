import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayouts, updatePayoutStatus } from '../../redux/slices/payoutsSlice';

const AdminPayouts = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const dispatch = useDispatch();
  const { items: payouts, status } = useSelector(state => state.payouts);

  useEffect(() => {
    if (isLoaded && isSignedIn && status === 'idle') {
      getToken().then(token => dispatch(fetchPayouts(token)));
    }
  }, [isLoaded, isSignedIn, status, dispatch, getToken]);

  const handleStatusChange = async (payoutId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this payout as ${newStatus}?`)) return;
    const token = await getToken();
    dispatch(updatePayoutStatus({ token, payoutId, status: newStatus }));
  };

  if (status === 'loading') {
    return <div className="p-8 text-gray-500 text-center">Loading payouts...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Payouts</h1>
          <p className="mt-2 text-sm text-gray-700">Manage and process withdrawal requests from vendors.</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                    No payout requests found.
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payout.requested_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payout.store_name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{payout.vendor_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{parseFloat(payout.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payout.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        payout.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {payout.status === 'PENDING' ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleStatusChange(payout.id, 'COMPLETED')}
                            className="cursor-pointer text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md transition-colors border border-green-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(payout.id, 'REJECTED')}
                            className="cursor-pointer text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors border border-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          Processed {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : ''}
                        </span>
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
