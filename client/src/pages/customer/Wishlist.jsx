import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchWishlist } from '../../redux/slices/wishlistSlice';
import ProductCard from '../../components/ProductCard';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { items, status } = useSelector(state => state.wishlist);

  useEffect(() => {
    const loadWishlist = async () => {
      if (isLoaded && isSignedIn && status === 'idle') {
        const token = await getToken();
        dispatch(fetchWishlist(token));
      }
    };
    loadWishlist();
  }, [isLoaded, isSignedIn, status, getToken, dispatch]);

  if (!isSignedIn) {
    return (
      <div className="text-center py-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Sign in to view your Wishlist</h2>
        <Link to="/sign-in" className="cursor-pointer bg-[#FF5A24] text-white px-6 py-3 rounded-full font-bold">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Wishlist</h2>
          <p className="mt-2 text-sm text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      {status === 'loading' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
          {[1,2,3,4,5].map(n => <div key={n} className="bg-gray-100 h-80 rounded-2xl"></div>)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500 mb-6">Explore the catalog and find something you love!</p>
          <Link to="/" className="cursor-pointer bg-[#FF5A24] text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
