import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../redux/slices/cartSlice';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const dbUser = useSelector(state => state.auth.user);
  const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
  
  // Hide the header on Admin and Vendor dashboard routes
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor')) {
    return null;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const categories = ['DRESSES', 'ACCESSORIES', 'GADGETS', 'WATCHES', 'FOOTWEARS', 'BEAUTY', 'DECOR'];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center h-[80px]">
        
        {/* 1. Logo */}
        <Link to="/" className="cursor-pointer text-2xl font-black text-gray-900 tracking-tighter flex-shrink-0 mr-8 lg:mr-12">
          ECom<span className="text-[#FF5A24]">Verse</span>
        </Link>

        {/* 2. Center Categories Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 font-bold text-[13px] tracking-wide text-[#282C3F] h-full flex-shrink-0">
          {categories.map(cat => (
            <Link 
              key={cat} 
              to={`/?category=${cat}`} 
              className="cursor-pointer hover:text-[#FF5A24] border-b-4 border-transparent hover:border-[#FF5A24] flex items-center h-full relative transition-colors"
            >
              {cat}
              {cat === 'STUDIO' && (
                <span className="absolute top-[20px] -right-[22px] text-[9px] font-extrabold text-[#FF3F6C]">
                  NEW
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* 3. Search Bar (Flex Grow) */}
        <div className="flex-grow flex justify-center ml-8 mr-8">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex w-full max-w-[500px] bg-[#F5F5F6] rounded-md items-center px-4 h-10 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
            <button type="submit" className="text-gray-500 mr-3 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <input 
              type="text" 
              placeholder="Search for products, brands and more" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-800 w-full placeholder-gray-500 font-medium"
            />
          </form>
        </div>

        {/* 4. Right Side Icons */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          
          <SignedOut>
            <div className="flex items-center space-x-3 mr-2">
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <button className="text-[13px] font-bold text-[#282C3F] hover:text-[#FF5A24] transition-colors cursor-pointer">Login</button>
              </SignInButton>
              <span className="text-gray-300">|</span>
              <SignUpButton mode="modal" fallbackRedirectUrl="/">
                <button className="text-[13px] font-bold text-[#FF3F6C] hover:text-rose-500 transition-colors cursor-pointer">Sign Up</button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            {/* Dashboard / Profile Icon */}
            <Link to="/dashboard" className="flex flex-col items-center hover:text-[#FF5A24] text-[#282C3F] cursor-pointer group">
              <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="text-[11px] font-bold">Dashboard</span>
            </Link>
          </SignedIn>

          {/* Wishlist */}
          <Link to="/wishlist" className="flex flex-col items-center hover:text-[#FF5A24] text-[#282C3F] cursor-pointer group">
            <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span className="text-[11px] font-bold">Wishlist</span>
          </Link>

          {/* Bag */}
          {(!dbUser || dbUser.role !== 'SUPER_ADMIN') && (
            <button onClick={() => dispatch(toggleCart())} className="flex flex-col items-center hover:text-[#FF5A24] text-[#282C3F] cursor-pointer relative group">
              <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <span className="text-[11px] font-bold">Bag</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#FF3F6C] text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          {/* Clerk Custom UserButton */}
          <SignedIn>
            <div className="hidden sm:block pl-6 border-l border-gray-200 ml-2">
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 hover:scale-105 transition-transform" } }} />
            </div>
          </SignedIn>

        </div>
      </div>
    </header>
  );
};

export default Header;
