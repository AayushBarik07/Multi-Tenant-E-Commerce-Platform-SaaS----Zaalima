import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

const VendorOrders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stores/my/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch vendor orders', error);
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
        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        return orderDate >= thirtyDaysAgo;
      }
      
      if (filter === 'PENDING') {
        return order.order_status !== 'DELIVERED' && order.order_status !== 'CANCELLED';
      }
      
      return true; // ALL
    });
  };

  const filteredOrders = getFilteredOrders();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Store Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all successful transactions and orders placed in your store.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer Email</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-10 text-center text-sm text-gray-500">
                        No orders have been placed in your store yet.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {order.id.split('-')[0]}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                          {order.customer_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.customer_email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-emerald-600">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <select
                              value={order.order_status || 'PENDING'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ring-1 ring-inset ${
                                order.order_status === 'DELIVERED' 
                                  ? 'bg-green-50 text-green-700 ring-green-600/20' 
                                  : order.order_status === 'CANCELLED'
                                  ? 'bg-red-50 text-red-700 ring-red-600/20'
                                  : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                              }`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="DELIVERED">Successfully Delivered</option>
                              <option value="CANCELLED">Declined Order</option>
                            </select>
                          </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-mono text-gray-500 text-xs">
                          {order.payment_reference || 'N/A'}
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
    </div>
  );
};

export default VendorOrders;
