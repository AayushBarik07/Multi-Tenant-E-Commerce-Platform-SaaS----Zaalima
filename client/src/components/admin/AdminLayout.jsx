import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] w-full bg-slate-900 text-slate-100">
      {/* Dark Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 shadow-xl flex-shrink-0 z-10">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Command Center</h2>
          <nav className="space-y-2">
            <Link 
              to="/admin" 
              className={`block px-4 py-3 rounded-lg transition-all ${isActive('/admin') ? 'bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Platform Overview
              </div>
            </Link>
            <Link 
              to="/vendor" 
              className={`block px-4 py-3 rounded-lg transition-all ${isActive('/vendor') ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Vendor Access
              </div>
            </Link>
            <Link 
              to="/admin/stores" 
              className={`block px-4 py-3 rounded-lg transition-all ${isActive('/admin/stores') ? 'bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                Stores Overview
              </div>
            </Link>
            <Link 
              to="/admin/products" 
              className={`block px-4 py-3 rounded-lg transition-all ${isActive('/admin/products') ? 'bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                Global Catalog
              </div>
            </Link>
            <Link 
              to="/admin/orders" 
              className={`block px-4 py-3 rounded-lg transition-all ${isActive('/admin/orders') ? 'bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                All Transactions
              </div>
            </Link>
            <Link 
              to="/admin/payouts" 
              className={`block px-4 py-3 rounded-lg transition-all ${isActive('/admin/payouts') ? 'bg-purple-600/20 text-purple-400 font-semibold border border-purple-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Payout Requests
              </div>
            </Link>
            <div className="pt-6 mt-6 border-t border-slate-800">
              <Link 
                to="/" 
                className="block px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Exit to Storefront
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area - Dark Mode */}
      <main className="flex-1 p-6 md:p-10 bg-slate-900 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
