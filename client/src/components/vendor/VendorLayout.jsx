import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';

const VendorLayout = () => {
  const location = useLocation();
  const user = useSelector(state => state.auth.user);

  const navigation = [
    { name: 'Dashboard', href: '/vendor' },
    { name: 'Store Settings', href: '/vendor/store' },
    { name: 'Brands & Collections', href: '/vendor/brands' },
    { name: 'Products', href: '/vendor/products' },
    { name: 'Orders', href: '/vendor/orders' },
    { name: 'Wallet & Earnings', href: '/vendor/wallet' },
  ];

  return (
    <div className="flex h-full w-full bg-gray-100 absolute top-0 left-0">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-indigo-600">Vendor Portal</h2>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2 rounded-md ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          <div className="pt-8 mt-4 border-t border-gray-200 space-y-2">
            {user?.role === 'SUPER_ADMIN' && (
              <Link 
                to="/admin" 
                className="block px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-md font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Admin Access
              </Link>
            )}
            <Link 
              to="/" 
              className="block px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go to Public Store
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm flex items-center justify-end p-4">
          <UserButton />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
