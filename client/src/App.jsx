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
import Success from './pages/public/Success';
import CustomerOrders from './pages/customer/CustomerOrders';
import Wishlist from './pages/customer/Wishlist';
import BecomeVendor from './pages/public/BecomeVendor';
import CartDrawer from './components/public/CartDrawer';
import Footer from './components/Footer';
import Header from './components/Header';
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
      return <CustomerOrders />;
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
          <Header />

          <CartDrawer />

          {/* Main Content */}
          <main className="flex-grow p-4 flex justify-center items-start">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store/:storeId" element={<Storefront />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/become-vendor" element={<BecomeVendor />} />
                <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/success/:transactionId" element={<Success />} />
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
          <Footer />
        </div>
      </SyncUser>
    </Router>
  );
}

export default App;
