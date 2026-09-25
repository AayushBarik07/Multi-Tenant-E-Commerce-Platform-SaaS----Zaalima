const fs = require('fs');
let c = fs.readFileSync('client/src/pages/customer/CustomerOrders.jsx', 'utf8');

if (!c.includes('handleCancelOrder')) {
  c = c.replace(
    "const filteredOrders = getFilteredOrders();",
    `const filteredOrders = getFilteredOrders();

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const token = await getToken();
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/orders/\${orderId}/status\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`
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
  };`
  );
}

// Fix the map function body
const oldMapBodyRegex = /\/\/ Mock delivery date logic.*?<p className="mt-1 text-sm font-mono text-gray-500">\{order\.payment_reference \|\| order\.id\.split\('-'\)\[0\]\}<\/p>/s;

const newMapBody = `
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
                      <p className="mt-1 text-sm font-medium text-gray-900">\${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Store</p>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{order.store_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Transaction ID</p>
                      <p className="mt-1 text-sm font-mono text-gray-500">{order.payment_reference || order.id.split('-')[0]}</p>`;

c = c.replace(oldMapBodyRegex, newMapBody);

const oldBodyRegex = /<h4 className="text-lg font-bold text-gray-900 flex items-center">.*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\)/s;

const newBody = `<h4 className="text-lg font-bold text-gray-900 flex items-center">
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
          })`;

c = c.replace(oldBodyRegex, newBody);

fs.writeFileSync('client/src/pages/customer/CustomerOrders.jsx', c);
console.log('CustomerOrders updated');
