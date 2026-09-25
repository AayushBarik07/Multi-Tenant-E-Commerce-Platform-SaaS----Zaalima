import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const CustomerOrders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, LAST_7_DAYS, LAST_MONTH, PENDING

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch customer orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken]);

  const getFilteredOrders = () => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      
      if (filter === 'LAST_7_DAYS') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        return orderDate >= sevenDaysAgo;
      }
      
      if (filter === 'LAST_MONTH') {
        // Just simplifying to last 30 days
        const now2 = new Date();
        const thirtyDaysAgo = new Date(now2.setDate(now2.getDate() - 30));
        return orderDate >= thirtyDaysAgo;
      }
      
      if (filter === 'PENDING') {
        // PENDING DELIVERY (Assuming CONFIRMED or PENDING status means it's not DELIVERED yet)
        return order.order_status !== 'DELIVERED' && order.order_status !== 'CANCELLED';
      }
      
      return true; // ALL
    });
  };

  const filteredOrders = getFilteredOrders();

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: 'CANCELLED' } : o));
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (err) {
      console.error(err);
      alert('Error cancelling order');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 min-h-[50vh]">Loading your orders...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full min-h-[60vh]">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Account & Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            Check the status of your recent orders, manage returns, and discover similar products.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['ALL', 'LAST_7_DAYS', 'LAST_MONTH', 'PENDING'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${filter === tab 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab === 'ALL' && 'All Orders'}
              {tab === 'LAST_7_DAYS' && 'Last 7 Days'}
              {tab === 'LAST_MONTH' && 'Last 30 Days'}
              {tab === 'PENDING' && 'Pending Delivery'}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex flex-col space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't placed any orders that match this filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            
            const orderDate = new Date(order.created_at);
            const status = order.order_status || 'PENDING';
            const isDelivered = status === 'DELIVERED';
            const isCancelled = status === 'CANCELLED';
            
            return (
              <div key={order.id} className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between border-b border-gray-200 gap-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 w-full sm:w-auto">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Order Placed</p>
                      <p className="mt-1 text-sm text-gray-900">{orderDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Total Amount</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Store</p>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{order.store_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Transaction ID</p>
                      <p className="mt-1 text-sm font-mono text-gray-500">{order.payment_reference || order.id.split('-')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                      order.payment_status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      Payment: {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex items-center">
                        {isDelivered && (
                          <>
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Delivered Successfully
                          </>
                        )}
                        {isCancelled && (
                          <>
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            Order Cancelled
                          </>
                        )}
                        {!isDelivered && !isCancelled && (
                          <>
                            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Processing / Pending Delivery
                          </>
                        )}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {isDelivered && "Your package has been delivered. Thank you for shopping with EComVerse!"}
                        {isCancelled && "This order was cancelled and will not be delivered."}
                        {!isDelivered && !isCancelled && "Your order is currently being processed by the vendor."}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
                      <button className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        View Invoice
                      </button>
                      
                      {!isDelivered && !isCancelled && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          Request Cancellation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
