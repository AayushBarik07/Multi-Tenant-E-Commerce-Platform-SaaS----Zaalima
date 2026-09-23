import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp, UserButton, SignInButton, SignUpButton, useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/slices/authSlice';
import VendorLayout from './components/vendor/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import StoreSettings from './pages/vendor/StoreSettings';
import ProductsList from './pages/vendor/ProductsList';
import ProductForm from './pages/vendor/ProductForm';
import Home from './pages/public/Home';
import Storefront from './pages/public/Storefront';
import ProductDetails from './pages/public/ProductDetails';
import Checkout from './pages/public/Checkout';
import BecomeVendor from './pages/public/BecomeVendor';
import CartDrawer from './components/public/CartDrawer';
import { toggleCart } from './redux/slices/cartSlice';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStores from './pages/admin/AdminStores';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayouts from './pages/admin/AdminPayouts';
import BrandManager from './pages/vendor/BrandManager';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorWallet from './pages/vendor/VendorWallet';

function SyncUser({ children }) {
  const { isLoaded, userId, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const dbUser = useSelector(state => state.auth.user);

  useEffect(() => {
    const syncUserToBackend = async () => {
      if (isLoaded && userId && !dbUser) {
        try {
          const token = await getToken();
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              name: clerkUser?.fullName,
              email: clerkUser?.primaryEmailAddress?.emailAddress
            })
          });
          const data = await response.json();
          if (data.success) {
            dispatch(setUser(data.user));
          }
        } catch (error) {
          console.error("Failed to sync user", error);
        }
      } else if (isLoaded && !userId) {
        dispatch(clearUser());
      }
    };

    syncUserToBackend();
  }, [isLoaded, userId, dbUser, dispatch, clerkUser, getToken]);

  return children;
}

function RoleDashboard() {
  const dbUser = useSelector(state => state.auth.user);
  const { isLoaded } = useAuth();
  
  if (!isLoaded || !dbUser) return <div className="p-8 text-center">Loading dashboard...</div>;

  switch (dbUser.role) {
    case 'SUPER_ADMIN':
      return <Navigate to="/admin" />;
    case 'VENDOR':
      return <Navigate to="/vendor" />;
    case 'CUSTOMER':
    default:
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>
          <p className="text-gray-600 mb-4">Welcome back to Zaalima!</p>
          <Link to="/" className="text-indigo-600 hover:underline">Start Shopping</Link>
        </div>
      );
  }
}

// Security Guard for specific roles
function RequireRole({ children, allowedRoles }) {
  const dbUser = useSelector(state => state.auth.user);
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <div className="p-8 text-center">Checking permissions...</div>;
  
  if (!isSignedIn) return <Navigate to="/sign-in" />;

  // Wait for our database sync to finish
  if (isSignedIn && !dbUser) return <div className="p-8 text-center">Loading profile...</div>;

  if (dbUser && !allowedRoles.includes(dbUser.role)) {
    // Kicks unauthorized users back to the safe Customer Dashboard area
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();
  const dbUser = useSelector(state => state.auth.user);
  const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));

  return (
    <Router>
      <SyncUser>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Basic Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center relative z-10">
            <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">Zaalima</Link>
            <nav className="flex items-center space-x-6">
              {/* Become a Vendor Link (Only for Customers or logged out users) */}
              {(!dbUser || dbUser.role === 'CUSTOMER') && (
                <Link to="/become-vendor" className="text-gray-600 hover:text-indigo-600 font-medium text-sm">
                  Sell on Zaalima
                </Link>
              )}

              <button 
                onClick={() => dispatch(toggleCart())}
                className="text-gray-600 hover:text-gray-900 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              <SignedIn>
                <div className="flex items-center space-x-4 border-l border-gray-200 pl-4 ml-2">
                  {dbUser && (
                    <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                      dbUser.role === 'SUPER_ADMIN' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : dbUser.role === 'VENDOR'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {dbUser.role === 'SUPER_ADMIN' ? 'Admin Account' : dbUser.role === 'VENDOR' ? 'Vendor Account' : 'Customer Account'}
                    </span>
                  )}
                  <Link to="/dashboard" className="font-medium text-gray-700 hover:text-indigo-600 text-sm">Dashboard</Link>
                  <UserButton />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="text-indigo-600 font-medium hover:underline mr-4">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Sign Up</button>
                </SignUpButton>
              </SignedOut>
            </nav>
          </header>

          <CartDrawer />

          {/* Main Content */}
          <main className="flex-grow p-4 flex justify-center items-start">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store/:storeId" element={<Storefront />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/become-vendor" element={<BecomeVendor />} />
              <Route path="/checkout" element={
                <SignedIn>
                  <Checkout />
                </SignedIn>
              } />
              
              <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
              <Route path="/dashboard" element={
                <>
                  <SignedIn>
                    <RoleDashboard />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/sign-in" />
                  </SignedOut>
                </>
              } />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <RequireRole allowedRoles={['SUPER_ADMIN']}>
                  <AdminLayout />
                </RequireRole>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="stores" element={<AdminStores />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="payouts" element={<AdminPayouts />} />
              </Route>

              {/* Protected Vendor Routes */}
              <Route path="/vendor" element={
                <RequireRole allowedRoles={['VENDOR', 'SUPER_ADMIN']}>
                  <VendorLayout />
                </RequireRole>
              }>
                <Route index element={<VendorDashboard />} />
                <Route path="store" element={<StoreSettings />} />
                <Route path="brands" element={<BrandManager />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="products/:id" element={<ProductForm />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="wallet" element={<VendorWallet />} />
              </Route>
            </Routes>
          </main>
        </div>
      </SyncUser>
    </Router>
  );
}

export default App;
