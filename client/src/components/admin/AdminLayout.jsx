import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm flex-shrink-0">
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin" 
            className={`block px-4 py-2 rounded-md transition-colors ${isActive('/admin') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Dashboard
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link 
              to="/" 
              className="block px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go to Public Store
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
