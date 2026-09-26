import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../redux/slices/cartSlice';

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const dbUser = useSelector(state => state.auth.user);
  const cartItemsCount = useSelector(state => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
  const isStaff = dbUser && (dbUser.role === 'SUPER_ADMIN' || dbUser.role === 'VENDOR');

  // Hide the header on Admin and Vendor routes
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor')) {
    return null;
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white text-xs font-medium py-2 px-4 flex justify-between items-center hidden sm:flex">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
          <span>Free Worldwide Shipping Over $50</span>
        </div>
        <div className="flex space-x-6 text-gray-300">
          <span className="cursor-pointer hover:text-white transition-colors">Summer Sale Up To 70% Off</span>
          <span className="text-gray-600">|</span>
          <span className="cursor-pointer hover:text-white flex items-center space-x-1 transition-colors">
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"></path></svg>
            <span>Limited Time Flash Deals</span>
          </span>
        </div>
      </div>

      {/* Premium Navbar */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-all duration-300">
        {/* Logo */}
        <Link to="/" className="cursor-pointer text-2xl font-black text-gray-900 tracking-tighter">
          ECom<span className="text-[#FF5A24]">Verse</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 font-medium text-sm text-gray-700">
          <Link to="/" className="cursor-pointer text-[#FF5A24] border-b-2 border-[#FF5A24] pb-1">Home</Link>
          <Link to="/" className="cursor-pointer hover:text-[#FF5A24] transition-colors pb-1">Shop</Link>
          <Link to="/" className="cursor-pointer hover:text-[#FF5A24] transition-colors pb-1">New Arrivals</Link>
          <Link to="/" className="cursor-pointer hover:text-[#FF5A24] transition-colors pb-1">Best Sellers</Link>
          {(!dbUser || dbUser.role === 'CUSTOMER') && (
            <Link to="/become-vendor" className="cursor-pointer hover:text-[#FF5A24] transition-colors pb-1">Sell with us</Link>
          )}
        </nav>

        {/* Right Icons & Auth */}
        <div className="flex items-center space-x-5">
          {/* Search Icon */}
          <button className="cursor-pointer text-gray-800 hover:text-[#FF5A24] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="cursor-pointer text-gray-800 hover:text-[#FF5A24] transition-colors hidden sm:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </Link>

          {/* Hide Cart for Super Admins */}
          {(!dbUser || dbUser.role !== 'SUPER_ADMIN') && (
            <button 
              onClick={() => dispatch(toggleCart())}
              className="text-gray-800 hover:text-[#FF5A24] transition-colors relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF5A24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          {/* Auth Logic */}
          <div className="flex items-center border-l border-gray-200 pl-5 ml-2 space-x-4">
            <SignedIn>
              {dbUser && (
                <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${dbUser.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800 border-purple-200' : dbUser.role === 'VENDOR' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                  {dbUser.role === 'SUPER_ADMIN' ? 'ADMIN' : dbUser.role}
                </span>
              )}
              <Link to="/dashboard" className="cursor-pointer hidden md:inline-flex items-center text-sm font-semibold text-gray-700 hover:text-[#FF5A24]">
                Dashboard
              </Link>
              <div className="border-2 border-transparent hover:border-[#FF5A24] rounded-full transition-all">
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <button className="cursor-pointer text-gray-700 font-medium hover:text-[#FF5A24] text-sm">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/">
                <button className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#FF5A24] transition-colors hidden sm:block">Sign Up</button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
