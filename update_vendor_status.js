const fs = require('fs');
let c = fs.readFileSync('client/src/pages/vendor/VendorOrders.jsx', 'utf8');

// Inject handleStatusChange function
if (!c.includes('handleStatusChange')) {
  c = c.replace(
    "const filteredOrders = getFilteredOrders();",
    `const filteredOrders = getFilteredOrders();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = await getToken();
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/orders/\${orderId}/status\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`
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
  };`
  );
}

// Replace the status badge with a select dropdown
const oldBadge = `<td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold 
leading-5 text-green-800">
                              {order.order_status || 'CONFIRMED'}
                            </span>
                          </td>`;

// Let's just find the generic span matching
c = c.replace(
  /<td className="whitespace-nowrap px-3 py-4 text-sm">[\s\S]*?<\/td>/,
  `<td className="whitespace-nowrap px-3 py-4 text-sm">
                            <select
                              value={order.order_status || 'PENDING'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={\`text-xs font-semibold rounded-full px-2 py-1 border-0 ring-1 ring-inset \${
                                order.order_status === 'DELIVERED' 
                                  ? 'bg-green-50 text-green-700 ring-green-600/20' 
                                  : order.order_status === 'CANCELLED'
                                  ? 'bg-red-50 text-red-700 ring-red-600/20'
                                  : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                              }\`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="DELIVERED">Successfully Delivered</option>
                              <option value="CANCELLED">Declined Order</option>
                            </select>
                          </td>`
);

fs.writeFileSync('client/src/pages/vendor/VendorOrders.jsx', c);
console.log('VendorOrders updated');
