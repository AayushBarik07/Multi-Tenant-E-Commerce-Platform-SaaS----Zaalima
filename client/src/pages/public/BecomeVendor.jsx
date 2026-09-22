import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';

const BecomeVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const dbUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!isSignedIn) {
      openSignIn({ redirectUrl: '/become-vendor' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/become-vendor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Update Redux state with new role
        dispatch(setUser(data.user));
        // Redirect to Vendor dashboard so they can create their store!
        navigate('/vendor');
      } else {
        setError(data.error || 'Failed to upgrade account');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (dbUser?.role === 'VENDOR' || dbUser?.role === 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg">
          <h2 className="text-3xl font-extrabold text-gray-900">You're already a seller!</h2>
          <p className="mt-2 text-gray-600">Head over to your dashboard to manage your store.</p>
          <button 
            onClick={() => navigate('/vendor')}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Partner with Zaalima</h2>
        <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Sell your shoes to the world.
        </p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Join thousands of independent sellers and brands managing their stores on Zaalima's multi-tenant e-commerce platform.
        </p>
      </div>

      <div className="mt-16 max-w-lg mx-auto bg-white rounded-lg shadow-xl overflow-hidden p-8">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Start your journey today</h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">Create your own customized storefront</span>
          </div>
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">Manage products, variants, and inventory</span>
          </div>
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">View real-time analytics and sales data</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Register as a Vendor'}
        </button>
        <p className="mt-4 text-center text-xs text-gray-500">
          By registering, you agree to our Seller Terms and Conditions. One-click instant approval.
        </p>
      </div>
    </div>
  );
};

export default BecomeVendor;
