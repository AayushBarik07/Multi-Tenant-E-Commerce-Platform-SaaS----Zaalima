const fs = require('fs');
let c = fs.readFileSync('client/src/pages/admin/AdminOrders.jsx', 'utf8');

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
        return order.payment_status === 'PENDING' || order.order_status === 'PENDING';
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
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-extrabold text-slate-100">All Global Transactions</h2>
        <div className="flex space-x-2">
          {['ALL', 'LAST_7_DAYS', 'LAST_MONTH', 'PENDING'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={\`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors \${
                filter === tab 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }\`}
            >
              {tab === 'ALL' && 'All'}
              {tab === 'LAST_7_DAYS' && 'Last 7 Days'}
              {tab === 'LAST_MONTH' && 'Last 30 Days'}
              {tab === 'PENDING' && 'Pending'}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">`;

if (!c.includes('LAST_7_DAYS')) {
  c = c.replace(
    '<h2 className="text-2xl font-extrabold text-slate-100 mb-6">All Global Transactions</h2>\n      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-6 rounded-2xl shadow-lg">',
    tabsJSX
  );
}

// Map over filteredOrders instead of orders
c = c.replace(/orders\.length === 0/g, 'filteredOrders.length === 0');
c = c.replace(/orders\.map\(\(order\)/g, 'filteredOrders.map((order)');

fs.writeFileSync('client/src/pages/admin/AdminOrders.jsx', c);
console.log('AdminOrders updated with filters');
