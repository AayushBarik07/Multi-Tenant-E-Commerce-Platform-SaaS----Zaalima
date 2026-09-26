const fs = require('fs');
let c = fs.readFileSync('client/src/components/Header.jsx', 'utf8');

if (c.includes('<button className="text-gray-800 hover:text-[#FF5A24] transition-colors hidden sm:block">')) {
  c = c.replace(
    '<button className="text-gray-800 hover:text-[#FF5A24] transition-colors hidden sm:block">',
    '<Link to="/wishlist" className="text-gray-800 hover:text-[#FF5A24] transition-colors hidden sm:block">'
  );
  
  // Replace the closing button tag for this specific block (wishlist)
  // Need to use regex carefully.
  const oldWishlist = /<Link to="\/wishlist" className="text-gray-800 hover:text-\[#FF5A24\] transition-colors hidden sm:block">\s*<svg[\s\S]*?<\/svg>\s*<\/button>/;
  const newWishlist = `<Link to="/wishlist" className="text-gray-800 hover:text-[#FF5A24] transition-colors hidden sm:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </Link>`;
          
  c = c.replace(oldWishlist, newWishlist);
  fs.writeFileSync('client/src/components/Header.jsx', c);
  console.log('Header.jsx updated with wishlist link');
}
