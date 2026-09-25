const fs = require('fs');
let c = fs.readFileSync('client/src/pages/vendor/VendorOrders.jsx', 'utf8');

if (!c.includes('const [filter, setFilter] = useState')) {
  c = c.replace(
    "const [loading, setLoading] = useState(true);",
    "const [loading, setLoading] = useState(true);\n  const [filter, setFilter] = useState('ALL');"
  );
}

const filterLogic = `
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
`;

if (!c.includes('const getFilteredOrders')) {
  c = c.replace(
    "if (loading) return",
    filterLogic + "\n  if (loading) return"
  );
}

const tabsJSX = `
      {/* Filters */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['ALL', 'LAST_7_DAYS', 'LAST_MONTH', 'PENDING'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={\`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                \${filter === tab 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              \`}
            >
              {tab === 'ALL' && 'All Orders'}
              {tab === 'LAST_7_DAYS' && 'Last 7 Days'}
              {tab === 'LAST_MONTH' && 'Last 30 Days'}
              {tab === 'PENDING' && 'Pending Delivery'}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8 flex flex-col">`;

if (!c.includes('LAST_7_DAYS')) {
  c = c.replace(
    '<div className="mt-8 flex flex-col">',
    tabsJSX
  );
}

// Map over filteredOrders instead of orders
c = c.replace(/orders\.length === 0/g, 'filteredOrders.length === 0');
c = c.replace(/orders\.map\(\(order\)/g, 'filteredOrders.map((order)');

fs.writeFileSync('client/src/pages/vendor/VendorOrders.jsx', c);
console.log('VendorOrders updated with filters');
