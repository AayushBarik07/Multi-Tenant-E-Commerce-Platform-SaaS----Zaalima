import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  
  // Do not render the footer on the admin or vendor dashboard screens
  if (
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/vendor') || 
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/sign-in') ||
    location.pathname.startsWith('/sign-up')
  ) {
    return null;
  }

  return (
    <footer className="w-full mt-auto border-t border-gray-100">
      {/* Top Split Section */}
      <div className="flex flex-col md:flex-row w-full bg-[#f8f9fa]">
        
        {/* Left Side Image */}
        <div 
          className="w-full md:w-5/12 lg:w-1/2 min-h-[300px] md:min-h-[400px] bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop")' }}
        >
          {/* Optional: we could put an overlay or logo here, but keeping it clean per the design */}
        </div>
        
        {/* Right Side Links */}
        <div className="w-full md:w-7/12 lg:w-1/2 py-12 px-8 lg:px-16 flex items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full text-left">
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-500 font-medium">
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Business Resources</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Press Release</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Partners</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Events</Link></li>
                <li><Link to="/become-vendor" className="hover:text-indigo-600 transition-colors">Affiliate Program</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">Offices</h3>
              <ul className="space-y-3 text-sm text-gray-500 font-medium">
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Bangalore</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Delhi</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Mumbai</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Chennai</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">Links</h3>
              <ul className="space-y-3 text-sm text-gray-500 font-medium">
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Terms</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Cancellation Policy</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Copyrights</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Fees and Charges</Link></li>
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dark Bar */}
      <div className="bg-[#222222] text-[#a0a0a0] py-5 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm">
        
        {/* Horizontal Links */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 md:mb-0">
          <Link to="/" className="hover:text-white transition-colors">About Us</Link>
          <span className="text-gray-600">|</span>
          <Link to="/" className="hover:text-white transition-colors">Services</Link>
          <span className="text-gray-600">|</span>
          <Link to="/" className="hover:text-white transition-colors">Team</Link>
          <span className="text-gray-600">|</span>
          <Link to="/" className="hover:text-white transition-colors">Testimonials</Link>
          <span className="text-gray-600">|</span>
          <Link to="/" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
        
        {/* Social Icons */}
        <div className="flex items-center space-x-5">
          <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="X (Twitter)">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Pinterest">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.3 2.7 8 6.5 9.5-.1-.8-.2-2 0-2.8l1.4-6s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1.1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.3 0-5.4 2.5-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.3-.1.2-.2.3-.4.2-1.6-.7-2.6-3-2.6-4.8 0-3.9 2.8-7.5 8.2-7.5 4.3 0 7.7 3.1 7.7 7.2 0 4.3-2.7 7.8-6.5 7.8-1.3 0-2.5-.7-2.9-1.5l-.8 3c-.3 1.1-1.1 2.5-1.6 3.4 1.3.4 2.7.6 4.2.6 5.5 0 10-4.5 10-10S17.5 2 12 2z"></path></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
