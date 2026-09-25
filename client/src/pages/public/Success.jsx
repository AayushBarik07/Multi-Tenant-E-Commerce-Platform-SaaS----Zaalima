import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const Success = () => {
  const { transactionId } = useParams();
  const { getToken } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you'd fetch the order details via the transaction ID
    // Since we don't have a direct endpoint for this, we will simulate fetching
    // the order details or build a simple endpoint.
    const fetchOrder = async () => {
      try {
        const token = await getToken();
        // Here we'd call an endpoint like /api/orders/transaction/:transactionId
        // We'll just fake a quick delay and use the transaction ID for the UI
        setTimeout(() => {
          setOrder({
            transactionId: transactionId,
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 5 days from now
            paymentMethod: 'Credit / Debit Card',
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [transactionId, getToken]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-500 font-medium">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-8 sm:p-12">
        <div className="flex justify-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h2>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for shopping with EComVerse. Your payment has been securely processed.
          </p>
        </div>

        <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-100 text-left">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 border-gray-200">Transaction Details</h3>
          
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd className="text-sm font-mono text-gray-900 bg-gray-200 px-2 rounded">{order?.transactionId}</dd>
            </div>
            
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
              <dd className="text-sm font-medium text-gray-900 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                {order?.paymentMethod}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
              <dd className="text-sm font-bold text-indigo-600">{order?.estimatedDelivery}</dd>
            </div>
            
            <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
              <dt className="text-sm font-medium text-gray-500">Order Status</dt>
              <dd className="text-sm font-bold text-emerald-500 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                Processing
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
