import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/slices/authSlice';
import VendorLayout from './components/vendor/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import StoreSettings from './pages/vendor/StoreSettings';
import ProductsList from './pages/vendor/ProductsList';
import ProductForm from './pages/vendor/ProductForm';

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
  
  if (!dbUser) return <div>Loading...</div>;

  switch (dbUser.role) {
    case 'SUPER_ADMIN':
      return <div><h2 className="text-2xl font-bold">Admin Dashboard</h2><p>Welcome Admin!</p></div>;
    case 'VENDOR':
      return <Navigate to="/vendor" />;
    case 'CUSTOMER':
    default:
      return <div><h2 className="text-2xl font-bold">Customer Dashboard</h2><p>Welcome back!</p></div>;
  }
}

function App() {
  return (
    <Router>
      <SyncUser>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Basic Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600">Zaalima</h1>
            <nav>
              <SignedIn>
                <a href="/dashboard" className="mr-4 font-medium text-gray-700 hover:text-indigo-600">Dashboard</a>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <a href="/sign-in" className="text-indigo-600 font-medium hover:underline mr-4">Sign In</a>
                <a href="/sign-up" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Sign Up</a>
              </SignedOut>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-4 flex justify-center items-center">
            <Routes>
              <Route path="/" element={
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Welcome to Zaalima</h2>
                  <p className="text-gray-600">The premier multi-tenant e-commerce platform.</p>
                </div>
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
              
              {/* Vendor Routes */}
              <Route path="/vendor" element={
                <SignedIn>
                  <VendorLayout />
                </SignedIn>
              }>
                <Route index element={<VendorDashboard />} />
                <Route path="store" element={<StoreSettings />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="products/:id" element={<ProductForm />} />
              </Route>
            </Routes>
          </main>
        </div>
      </SyncUser>
    </Router>
  );
}

export default App;
