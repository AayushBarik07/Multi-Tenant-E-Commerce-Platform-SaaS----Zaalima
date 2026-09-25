const fs = require('fs');
let c = fs.readFileSync('client/src/App.jsx', 'utf8');

if (!c.includes('import CustomerOrders')) {
  c = c.replace(
    "import Success from './pages/public/Success';",
    "import Success from './pages/public/Success';\nimport CustomerOrders from './pages/customer/CustomerOrders';"
  );
}

const oldCustomerBlock = `      case 'CUSTOMER':
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>
            <p className="text-gray-600 mb-4">Welcome back to EComVerse!</p>
            <Link to="/" className="text-indigo-600 hover:underline">Start Shopping</Link>
          </div>
        );`;

const newCustomerBlock = `      case 'CUSTOMER':
      default:
        return <CustomerOrders />;`;

c = c.replace(oldCustomerBlock, newCustomerBlock);

fs.writeFileSync('client/src/App.jsx', c);
console.log('App.jsx updated with CustomerOrders');
