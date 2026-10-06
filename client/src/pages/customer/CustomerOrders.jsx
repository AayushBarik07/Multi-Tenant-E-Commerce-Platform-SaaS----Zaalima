import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const CustomerOrders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, LAST_7_DAYS, LAST_MONTH, PENDING
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
                      <p className="mt-1 text-sm font-medium text-gray-900">₹{parseFloat(order.total_amount).toFixed(2)}</p>
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
                  {/* Status & Actions Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
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
                        {isDelivered && "Your package has been delivered. Thank you for shopping with Zaalima!"}
                        {isCancelled && "This order was cancelled and will not be delivered."}
                        {!isDelivered && !isCancelled && "Your order is currently being prepared and dispatched by the vendor."}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedInvoice(order)}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-semibold rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        View Invoice
                      </button>
                      
                      {!isDelivered && !isCancelled && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 cursor-pointer"
                        >
                          Request Cancellation
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Progress Stepper */}
                  {!isCancelled && (
                    <div className="py-4 border-b border-gray-100">
                      <div className="flex items-center justify-between max-w-lg mx-auto text-xs font-semibold text-gray-500">
                        <div className="flex flex-col items-center text-indigo-600">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-1 text-[11px]">✓</span>
                          <span>Placed</span>
                        </div>
                        <div className={`flex-1 h-1 mx-2 ${status !== 'PENDING' ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
                        <div className={`flex flex-col items-center ${status !== 'PENDING' ? 'text-indigo-600' : 'text-gray-400'}`}>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[11px] ${status !== 'PENDING' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                          <span>Confirmed</span>
                        </div>
                        <div className={`flex-1 h-1 mx-2 ${isDelivered ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                        <div className={`flex flex-col items-center ${isDelivered ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[11px] ${isDelivered ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Purchased Items List */}
                  {order.items && order.items.length > 0 && (
                    <div className="pt-4">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items in this Order</h5>
                      <div className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                          <div key={item.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {item.image_url ? (
                                <img src={item.image_url} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0" />
                              ) : (
                                <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                                  No Img
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-gray-900">{item.product_name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.subcategory || item.category || 'Standard'} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">₹{parseFloat(item.subtotal || item.unit_price * item.quantity).toFixed(2)}</p>
                              <p className="text-xs text-gray-400">₹{parseFloat(item.unit_price).toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 sm:p-8">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">ZAALIMA</h3>
                <p className="text-xs text-gray-500">Official Tax Invoice & Order Receipt</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-100 text-xs">
              <div>
                <p className="text-gray-500 font-medium">Invoice Number:</p>
                <p className="font-mono font-bold text-gray-900">INV-{selectedInvoice.id.substring(0, 8).toUpperCase()}</p>
                <p className="text-gray-500 font-medium mt-2">Order Date:</p>
                <p className="text-gray-900 font-semibold">{new Date(selectedInvoice.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-medium">Fulfilled By:</p>
                <p className="font-bold text-gray-900">{selectedInvoice.store_name}</p>
                <p className="text-gray-500 font-medium mt-2">Payment Reference:</p>
                <p className="font-mono text-gray-700">{selectedInvoice.payment_reference || 'STRIPE-DIRECT'}</p>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 font-medium text-gray-900">{item.product_name}</td>
                        <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                        <td className="py-2 text-right text-gray-600">₹{parseFloat(item.unit_price).toFixed(2)}</td>
                        <td className="py-2 text-right font-bold text-gray-900">₹{parseFloat(item.subtotal).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-2 text-gray-500 italic">Product details included in order total</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Breakdown */}
            <div className="border-t border-gray-200 pt-4 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-gray-600">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-600">{selectedInvoice.payment_status}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping / Delivery:</span>
                <span className="font-medium text-gray-900">Included</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total Paid:</span>
                <span className="text-indigo-600 text-base">₹{parseFloat(selectedInvoice.total_amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm cursor-pointer flex items-center"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Print / Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
